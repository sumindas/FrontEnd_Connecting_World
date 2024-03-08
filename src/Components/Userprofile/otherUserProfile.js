/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faFeed,
  faHeart,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";

import { BASE_URL } from "../../Api/api";
import PostCard from "./otherPostCard";

const OtherUser = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const CurrentUser = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const userId = localStorage.getItem('userId')
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserProfileAndFollowingStatus = async () => {
      try {
        // Fetch the user profile
        const response = await axios.get(
          `http://localhost:8000/userprofile/${id}/`
        );
        setUserProfile(response.data);

        // Check if the current user is following the user whose profile is being viewed
        const followingResponse = await axios.get(
          `http://localhost:8000/following/check/${userId}/${id}/`
        );
        console.log("The", followingResponse.data.isFollowing);
        setIsFollowing(followingResponse.data.isFollowing);
      } catch (error) {
        console.error(
          "Error fetching user profile and following status:",
          error
        );
      }
    };

    fetchUserProfileAndFollowingStatus();
  }, [id, userId]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/posts/${id}/`);
        console.log("resp:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
    fetchUserPosts();
  }, [id]);

  if (!userProfile || !posts) {
    return <div>Loading...</div>;
  }

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/following/${userId}/`,
        { followed: id }
      );
      const followingStatus = response.data.following;
      console.log("---", followingStatus);
      setIsFollowing(!isFollowing);
      alert(response.data.message);
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user. Please try again later.");
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userProfile">
      <div className="cover-photos">
        {userProfile.userprofile?.cover_photo ? (
          <img src={userProfile.userprofile.cover_photo} alt="Cover Photo" />
        ) : (
          // Placeholder or alternative content for when the cover photo URL is not available
          <div className="placeholder">No Cover Photo</div>
        )}
      </div>
      <div className="profile-info">
        {userProfile.userprofile?.profile_image ? (
          <img
            src={userProfile.userprofile.profile_image}
            alt="Profile Photo"
          />
        ) : (
          // Placeholder or alternative content for when the profile photo URL is not available
          <div className="placeholder">No Profile Photo</div>
        )}
        <div className="user-name">
          <h5>{userProfile.username}</h5>
          <div className="user-location">
            <h5>{userProfile.userprofile?.location}</h5>
          </div>
          <div>
            <p className="bio">{userProfile.userprofile?.bio}</p>
          </div>
        </div>
        <div className="profile-button">
          <Link to={`/home/chat/${id}`}>
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </Link>
          <button className="btn btn-primary" onClick={handleFollow}>
            <FontAwesomeIcon icon={faFeed} />
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
      <div className="feed-container">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default OtherUser;
