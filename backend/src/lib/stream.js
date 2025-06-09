import {StreamChat} from "stream-chat";
import "dotenv/config";


const apikey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apikey || !apiSecret)
{
    console.error("Steam Api key or Secret Is missing.");
}

const streamClient=StreamChat.getInstance(apikey,apiSecret);

export const upsertStreamUser = async (userData)=>{
    try {
        //upsert:=>if exists already then just update otherwise just create it
        await streamClient.upsertUsers([userData]); 
        return userData;
    } catch (error) {
        console.error("Error in upserting Stream User: ",error);
    }
}

export const generateStreamToken=(userId)=>{
    try {
        const userIdStr=userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.log("Error in generating stream token: ",error);
    }
};