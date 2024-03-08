/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import "./friendreq.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../Api/api";

export default function FriendReq() {
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    const fetchFriendSuggestions = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/user_suggestions/${userId}/`
        );
        console.log("data:", response.data);
        const suggestionsWithStatus = response.data.map((friend) => ({
          ...friend,
          following: false,  
        }));
        setFriendSuggestions(suggestionsWithStatus);
      } catch (error) {
        console.error("Error fetching friend suggestions:", error);
      }
    };

    fetchFriendSuggestions();
  }, [userId]);

  const handleFollow = async (friendId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/following/${userId}/`,
        { followed: friendId }
      );
      console.log("Server Response:", response.data);

      const followingStatus = !friendSuggestions.find(friend => friend.id === friendId).following;

      setFriendSuggestions((currentFriendSuggestions) => {
        console.log("Before Update:", currentFriendSuggestions);
        const updatedSuggestions = currentFriendSuggestions.map((friend) =>
          friend.id === friendId ? { ...friend, following: followingStatus } : friend
        );
        console.log("After Update:", updatedSuggestions);
        return updatedSuggestions;
      });
      
      alert(response.data.message);
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user. Please try again later.");
    }
  };

  return (
    <div className="Friend-Requests">
      <h4
        style={{ textAlign: "center", marginTop: "10px", marginLeft: "-15px" }}
      >
        <strong>Follow Suggestions</strong>
      </h4>
      {friendSuggestions.map((friend) => (
        <div className="request" key={friend.id}>
          <Link to={`/home/user/${friend.id}`}>
            <div className="info">
              <div className="user">
                {friend && friend.userprofile && friend.userprofile.profile_image ? (
                  <img
                    src={`${BASE_URL}${friend.userprofile.profile_image}`}
                    alt="Profile Photo"
                  />
                ) : null}
                <h5>{friend.username}</h5>
              </div>
              <div style={{textAlign:'center'}} className="info-name ">
                <p>{friend.userprofile?.location}</p>
              </div>
            </div>
          </Link>
          <div className="action">
            <button
              className="btn btn-primary"
              onClick={() => handleFollow(friend.id)}
            >
              {friend.following ? "Friends" : "Follow"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
