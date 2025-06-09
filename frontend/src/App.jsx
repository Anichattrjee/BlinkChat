import React from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"

const App = () => {
  return (
    <div className="h-screen" data-theme="coffee">
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/onboarding" element={<OnboardingPage/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
        <Route path="/call" element={<CallPage/>}/>
        <Route path="/notifications" element={<NotificationsPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
