/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { Link, useHistory, useNavigate } from "react-router-dom"; // Import useHistory
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../Api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';


export default function Message({toggleVisibility}) {
 const [followedUsers, setFollowedUsers] = useState([]);
 const userId = localStorage.getItem("userId");
 const navigate = useNavigate()

 const handleUserClick = async (user) => {
    navigate(`/home/chat/${user.id}`);
    toggleVisibility();
    const response = await axios.get(`${BASE_URL}/chat/mark_messages_as_read/${user.id}/`);
    console.log(response.data.length,"---nnhh")
    if(response.data.length > 0){
      const res = await axios.post(`${BASE_URL}/chat/mark_messages_as_read/${user.id}/`);
      console.log("Res:",res)
      Swal.fire({
        position: 'top-end', 
        icon: 'info', 
        title: 'New Message', 
        text: `You have a new message from ${user.username}`, 
        showConfirmButton: false, 
        timer: 3000, 
        timerProgressBar: true, 
     });
    }
 };

 useEffect(() => {
    const fetchFollowedUsers = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/followed_users/${userId}/`
        );
        setFollowedUsers(response.data);
        console.log("users---",response.data)
      } catch (error) {
        console.error("Error fetching followed users:", error);
      }
    };

    fetchFollowedUsers();
 }, [userId]);

 return (
    <div className="Messages" style={{ marginLeft: "15px" }}>
      <div className="message-top flex justify-between items-center px-4 py-2 bg-gray-200 rounded-lg text-center">
        <h4 className="text-lg ml-8 font-semibold">Messages</h4>
        <FontAwesomeIcon icon={faEdit} className="text-gray-500" />
      </div>

      <div className="border-div" ></div>
      {followedUsers.length > 0 ? (
        followedUsers.map((user) => (
          <div
            key={user.id}
            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleUserClick(user)} // Attach onClick to div instead of Link
          >
            <div className="message flex items-center">
              <div className="user mr-4">
                {user && user.userprofile && user.userprofile.profile_image ? (
                 <img
                    src={user.userprofile.profile_image}
                    alt="Profile Photo"
                    className="w-10 h-10 rounded-full"
                 />
                ) : (
                 <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">?</span>
                 </div>
                )}
              </div>
              <div className="message-body">
                <div className="user-info flex items-center">
                 <h5
                    className="font-semibold"
                    style={{ marginRight: "auto", textAlign: "left" }}
                 >
                    {user.username}
                 </h5>
                 <p
                    className={`online-status ${
                      user.is_online ? "green" : "gray"
                    }`}
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      marginLeft: "5px",
                    }}
                 ></p>
                </div>
                <p className="text-sm text-gray-500">{user.bio}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="px-4 py-2 text-center text-gray-500">
          No followed users found
        </div>
      )}
    </div>
 );
}
