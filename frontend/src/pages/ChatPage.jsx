import React, { useEffect, useState } from 'react'
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window} from "stream-chat-react";
import { StreamChat } from 'stream-chat';
import { toast } from "react-hot-toast"
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';

const ChatPage = () => {
  const { id : targetUserId }=useParams();
  // console.log(id);
  const [chatClient, setChatClient]=useState(null);
  const [channel, setChannel]=useState(null);
  const [loading, setLoading]=useState(true);

  const {authUser}=useAuthUser();

  const STREAM_API_KEY=import.meta.env.VITE_STREAM_API_KEY;

  const {data:tokenData}=useQuery({
    queryKey:["streamToken"],
    queryFn:getStreamToken,
    //we dont want to run this query untill authUser is being fetched so we converted authuser variable into boolean using two !s to check if authuser already been fetched or not
    enabled:!!authUser  
  });


  useEffect(()=>{
    const initChat=async ()=>{
      if(!tokenData?.token || !authUser)return;

      try {
        console.log("Intializing stream chat client...");
        //create a stream client
        const client= StreamChat.getInstance(STREAM_API_KEY);

        // connect the client
        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        }, tokenData.token);

        const channelId=[authUser._id, targetUserId].sort().join("-");

        //you and me chatting
        // if i start the chat channelId:[myId, yourId];
        //if you start the chatt channelId:[yourId, myId]
        //to make them similar we are sorting the array

        //now create the channel
        const currChannel=client.channel("messaging", channelId, {
          members:[authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
        

      } catch (error) {
        console.log("Error initializing chat: ",error);
        toast.error('Could not connect to chat. Please try again!');
      }
      finally{
        setLoading(false);
      }
    }

    initChat();
  },[tokenData, authUser, targetUserId]);

  if(loading || !chatClient || !channel ) return <ChatLoader/>

  const handleVideoCall=()=>{
    if(channel)
    {
      const callUrl=`${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join Here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully.");
    }
  }

  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader/>
              <MessageList/>
              <MessageInput focus/>
            </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
