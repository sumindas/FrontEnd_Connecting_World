import React from 'react-redux'
import {  Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'


//Pages................
import Login from '../Login/login'
import { SignUp } from '../Signup/SignUp'

import Profile from '../Profile/Profile'
import ChatBox from '../Chatbox/ChatBox'
import Home from '../Home/Home'
import NavBar from '../NavBar/NavBar'
import LeftBar from '../LeftBar/LeftBar'
import RightBar from '../RightBar/RightBar'
import Verification from '../Verification/Verify'
import AdminLogin from '../Admin/Pages/login'
import Users from '../Admin/Pages/Users'
import OtherUser from '../Userprofile/otherUserProfile'
import Posts from '../Admin/Pages/Posts'
import ChatRoom from '../Chatbox/ChatRoom'
import NotificationComponent from '../Home/Notifications'
import PasswordReset from '../Verification/PasswordReset'
import SinglePostDetails from '../Home/PostDetails'
import AdminDashboard from '../Admin/Pages/AdminDashboard'
import PostList from '../Admin/Pages/Reports'
import { useMediaQuery } from 'react-responsive';
import NotificationComponent2 from '../Home/NotNew'
import { useState } from 'react'
import ZegoVcall from '../Chatbox/ZegoVideoCall'



export default function LayOut() {

 const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
 const [isLeftBarVisible, setIsLeftBarVisible] = useState(false);
 const [isRightBarVisible,setRightBarVisible] = useState(false)

 const toggleLeftBar = () => {
    setIsLeftBarVisible(!isLeftBarVisible);
 };

 const toggleRightBar = () => {
  setRightBarVisible(!isRightBarVisible)
 }
  
  const Feed = () => {
    return (
      <>
       <NavBar toggleLeftBar={toggleLeftBar} toggleRightBar={toggleRightBar} />
        <main>
        {isMobile && isRightBarVisible && <RightBar />}
        {(isMobile ? isLeftBarVisible : true) && <LeftBar />}
          <div className="container">
            <Outlet />
          </div>
          {!isMobile && !isRightBarVisible && <RightBar /> }
        </main>
      </>
    )
  }

  //Router................
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login /> 
    },
    {
      path: '/signup',
      element: <SignUp />
    },
    {
      path: '/verify',
      element: <Verification />
    },
    {
      path : '/resetpassword',
      element : <PasswordReset />
    },
    {
      path : '/admin',
      element : <AdminLogin />,
    },
    {
      path : '/adminhome',
      element : <AdminDashboard />
    },
    {
      path : '/userslist',
      element : <Users />
    },
    {
      path: '/postlist',
      element : <Posts />
    },
    {
      path: '/reports',
      element : <PostList />
    },
    {
      path :'/meeting/:userId/:id',
      element : <ZegoVcall />
    },
    {
      path: '/home', 
      element: <Feed />,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'chat/:id',
          element: <ChatBox />
        },
       
        {
          path: 'user/:id', 
          element: <OtherUser />
        },
        {
          path : 'chats/:id',
          element : <ChatRoom />
        },
        {
          path : 'notificatins/:id',
          element : <NotificationComponent />
        },
        {
          path : 'postdetail/:id',
          element : <SinglePostDetails />
        },
      ]
    }
  ])


  return (
    <>
        <RouterProvider router = {router} />
    </>
  )
}
