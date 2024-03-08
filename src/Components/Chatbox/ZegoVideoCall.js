import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 } from 'uuid'

const ZegoVcall = () => {
  const { userId, id } = useParams();
  const VURL = 'http://localhost:5173'
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState(
    `${VURL}/meeting/${userId}/${id}`
  );
  const token = localStorage.getItem('token');
  const [socket, setSocket] = useState(null);

  const myMeeting = async (element) => {
    const appID = 405182362;
    const serverSecret = "75651d7bd9a2ece1f54fce1093141b41";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      userId,
      Date.now().toString(),
      v4()
    );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      onLeaveRoom: () => {
        navigate(`/home/chat/${id}`);
      },
    });
  };

  useEffect(() => {
    getSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [id, token]);

  const getSocket = () => {
    let newSocket = null;
    if (userId && token) {
      newSocket = new WebSocket(`wss://crickstore.shop/ws/chat/${id}/?token=${token}`);
      setSocket(newSocket);
      newSocket.onopen = () => {
        console.log("WebSocket connected");
        const data = {
          message: `Visit this link to join the meet: <a href="${newMessage}" target="_blank">${newMessage}</a>`,
         };
         
        if (newSocket !== null) {
          // Check if newSocket is not null
          newSocket.send(JSON.stringify(data)); // Send data using newSocket
        } else {
          console.error("Socket is null. Cannot send data.");
        }
      };
      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onclose = () => {
        console.log("WebSocket closed");
        // getSocket()
      };
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full h-full" ref={myMeeting} />
    </div>
  );
};

export default ZegoVcall;