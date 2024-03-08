/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CommentsList from "../Comments/Comments"; 
import { BASE_URL } from "../../Api/api";

const SinglePostDetails = () => {
  const { id } = useParams();
  const postId = Number(id);
  const userId = localStorage.getItem("userId");
  const userPosts = useSelector((state) => state.post[userId] || []);
  const post = userPosts.find((p) => p.id === postId);
  console.log("Post:", post);
  console.log("Image Path:", post.user.userprofile.profile_image);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchLikeAndCommentInfo = async () => {
      try {
        const likeResponse = await axios.get(`${BASE_URL}/likes/`, {
          params: {
            postId: postId,
            userId: userId,
          },
        });

        setLikeCount(likeResponse.data.count);
        setLiked(likeResponse.data.likedByUser);

        const commentResponse = await axios.get(
          `${BASE_URL}/posts/${postId}/comments/`
        );
        setCommentCount(commentResponse.data.length);
      } catch (error) {
        console.error("Error fetching like and comment info:", error);
      }
    };

    if (post) {
      fetchLikeAndCommentInfo();
    }
  }, [post, postId, userId]);

  const handleLikeClick = async () => {
    setLiked(!liked);
    try {
      const response = await axios.post(`${BASE_URL}/likes/`, {
        postId: postId,
        userId: userId,
      });
      if (
        response.data.message === "Like created." ||
        response.data.message === "Like already exists."
      ) {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };

  if (!post || !post.user) {
    return <div>Loading post details...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 my-4">
      <div className="flex items-center">
        {post && post.user && post.user.userprofile && post.user.userprofile.profile_image && (
          <img
            src={`${BASE_URL}${post.user.userprofile.profile_image}`}
            alt={`Profile image of ${post.user.username}`}
            className="w-10 h-10 rounded-full object-cover mr-4"
          />
        )}
        {post.user && <p className="font-bold text-lg">{post.user.username}</p>}
        <small style={{ marginLeft: "10px" }}>
          {new Date(post.created_at).toLocaleString()}
        </small>
      </div>

      <h2 className="font-bold text-xl mt-4 mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>

      <div className="media">
        {post.images &&
          post.images.map((image, index) => (
            <img
              key={index}
              src={`${BASE_URL}${image.images_url}`}
              alt={`Image ${index}`}
              className="w-full h-auto"
            />
          ))}

        {post.videos &&
          post.videos.length > 0 &&
          post.videos.map(
            (videoObj, index) =>
              videoObj && (
                <video key={index} controls className="w-full h-auto">
                  <source
                    src={`${BASE_URL}${videoObj.video_url}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )
          )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <button
            onClick={handleLikeClick}
            className={`mr-2 px-3 py-1 text-sm font-semibold rounded ${
              liked ? "text-red-500" : "text-gray-700"
            } hover:text-red-500`}
          >
            <FontAwesomeIcon icon={faHeart} /> {likeCount}
          </button>
          <button
            onClick={toggleCommentsVisibility}
            className="px-3 py-1 text-sm font-semibold rounded text-gray-700 hover:text-gray-500"
          >
            <FontAwesomeIcon icon={faComment} /> {commentCount}
          </button>
        </div>
      </div>
      {showComments && <CommentsList post={post} />}
    </div>
  );
};

export default SinglePostDetails;
