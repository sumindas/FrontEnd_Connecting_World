import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Api/api";


const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else {
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }
};

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const { id } = useParams();
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/chat/user/${id}/notifications/`
        );
        console.log("notifications:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("There was a problem with your fetch operation:", error);
      }
    };

    fetchNotifications();
  }, [id]);

  useEffect(() => {
    const socket = new WebSocket(`wss://crickstore.shop/ws/chat/${id}/?token=${token}`);
    socket.onopen = (event) => {
      console.log("WebSocket connection opened:", event);
     };
     
     socket.onerror = (error) => {
      console.error("WebSocket error:", error);
     };
     
     socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
     };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification_event') {
          const notification = JSON.parse(data.notification);
          console.log("Not:",notification)
          setNotifications(prevNotifications => [...prevNotifications, notification]);
      }
  };

  }, [id, notifications, token]);

  const markNotificationAsRead = async (notificationId) => {
    console.log("Notification ID:", notificationId);
    try {
      await axios.get(
        `${BASE_URL}/chat/user/notifications/${notificationId}/mark-as-read/`
      );
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Notifications
          </div>
          <p className="mt-2 text-gray-500">
            Here are your latest notifications.
          </p>
          <ul className="mt-4">
            {notifications.map((notification, index) => (
              <li
                key={index}
                className={`rounded-lg p-4 mt-2 flex justify-between items-center ${
                 notification.read ? "bg-gray-200" : "bg-gray-100 font-bold"
                }`}
              >
                <div className="flex items-center">
                 <div className="text-sm text-gray-600">
                    {notification.content}
                 </div>
                 <div className="ml-5 text-xs text-gray-500">
                    {formatTimeAgo(new Date(notification.timestamp))}
                 </div>
                </div>
                <div className="ml-5">
                 {notification.type === 'message' ? (
                    <Link
                      to={`/home/chat/${notification.user.id}`}
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      View Chat
                    </Link>
                 ) : notification.post ? (
                    <Link
                      to={`/home/postdetail/${notification.post.id}`}
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      View Post
                    </Link>
                 ) : (
                    <Link
                      to={`/home/user/${notification.follower}`}
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      View Profile
                    </Link>
                 )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationComponent;


// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";

// const formatTimeAgo = (date) => {
//   const now = new Date();
//   const diffInSeconds = Math.floor((now - date) / 1000);

//   if (diffInSeconds < 60) {
//     return `${diffInSeconds} seconds ago`;
//   } else if (diffInSeconds < 3600) {
//     return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//   } else if (diffInSeconds < 86400) {
//     return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//   } else {
//     return `${Math.floor(diffInSeconds / 86400)} days ago`;
//   }
// };

// const NotificationComponent = () => {
//   const [notifications, setNotifications] = useState([]);
//   const { id } = useParams();
//   const BASE_URL = "http://localhost:8000"; 

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/chat/user/${id}/notifications/`
//         );
//         console.log("notifications:", response.data);
//         setNotifications(response.data);
//       } catch (error) {
//         console.error("There was a problem with your fetch operation:", error);
//       }
//     };

//     fetchNotifications();
//   }, [id]);

//   useEffect(() => {
//     console.log("Updated notifications:", notifications);
// }, [notifications]);

//   const markNotificationAsRead = async (notificationId) => {
//     console.log("Notification ID:", notificationId)
//     try {
//       await axios.get(
//         `${BASE_URL}/chat/user/notifications/${notificationId}/mark-as-read/`
//       );
//       setNotifications(
//         notifications.map((notification) =>
//           notification.id === notificationId
//             ? { ...notification, read: true }
//             : notification
//         )
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
//       <div className="md:flex">
//         <div className="p-8">
//           <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
//             Notifications
//           </div>
//           <p className="mt-2 text-gray-500">
//             Here are your latest notifications.
//           </p>
//           <ul className="mt-4">
//             {notifications.map((notification, index) => (
//               <li
//                 key={index}
//                 className={`rounded-lg p-4 mt-2 flex justify-between items-center ${
//                   notification.read ? "bg-gray-200" : "bg-gray-100 font-bold"
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div className="text-sm text-gray-600">
//                     {notification.content}
//                   </div>
//                   <div className="ml-5 text-xs text-gray-500">
//                     {formatTimeAgo(new Date(notification.timestamp))}
//                   </div>
//                 </div>
//                 <div className="ml-5">
//                   {notification.post ? (
//                     <Link
//                       to={`/home/postdetail/${notification.post.id}`}
//                       className="text-blue-500 hover:text-blue-700" onClick={() => markNotificationAsRead(notification.id)}
//                     >
//                       View Post
//                     </Link>
//                   ) : (
//                     <Link
//                       to={`/home/user/${notification.follower}`}
//                       className="text-blue-500 hover:text-blue-700" onClick={() => markNotificationAsRead(notification.id)}
//                     >
//                       View Profile
//                     </Link>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationComponent;