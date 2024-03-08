import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../Api/api";
import { useSelector } from "react-redux";

function CommentsList({ post }) {
  const [comments, setComments] = useState([]);
  const currentUser = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");
  const postId = post.id;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/posts/${post.id}/comments/`
        );
        const commentsWithReplies = await Promise.all(
          response.data.map(async (comment) => {
            const repliesResponse = await axios.get(
              `${BASE_URL}/comments/${comment.id}/replies/create/${userId}/`
            );
            return { ...comment, replies: repliesResponse.data };
          })
        );
        setComments(commentsWithReplies);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [post.id, userId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentText = e.target.comment.value;

    try {
      const response = await axios.post(
        `${BASE_URL}/posts/${postId}/comments/create/${userId}/`,
        { content: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setComments((prevComments) => [...prevComments, response.data]);
      e.target.reset();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // sourcery skip: avoid-function-declarations-in-blocks
  function ReplyForm({ commentId, userId, onSubmit }) {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const commentText = e.target.comment.value;
      try {
        const response = await axios.post(
          `${BASE_URL}/comments/${commentId}/replies/create/${userId}/`,
          { content: commentText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        onSubmit(response.data);
        e.target.reset();
      } catch (error) {
        console.error("Error posting reply:", error);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          name="comment"
          placeholder="Write a reply"
          className="flex-grow py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="ml-4 py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Reply
        </button>
      </form>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg flex flex-col gap-4 m-4">
      <div className="writebox">
        <form
          onSubmit={handleCommentSubmit}
          className="flex flex-col sm:flex-row"
        >
          <div className="flex items-center">
            {currentUser && currentUser.user_profile ? (
              <img
                src={`${BASE_URL}${currentUser.user_profile.profile_image}`}
                alt=""
                className="rounded-full w-8 h-8 mr-2"
              />
            ) : null}
            <input
              type="text"
              name="comment"
              placeholder="Write a comment"
              className="flex-grow py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
            />
            <button
              type="submit"
              className="ml-2 py-1 px-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm sm:py-0.5 sm:px-1 sm:text-xs"
            >
              Comment
            </button>
          </div>
        </form>
      </div>
      {comments.length === 0 ? (
        <p className="text-center">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="flex flex-col mb-4">
            <div className="flex items-center">
              {comment.user && comment.user.userprofile ? (
                <img
                  src={`${comment.user.userprofile.profile_image}`}
                  alt=""
                  className="rounded-full w-8 h-8 mr-2"
                />
              ) : null}
              <div>
                <h5 className="font-semibold text-sm sm:text-xs">
                  {comment.user ? comment.user.username : "Anonymous"}
                </h5>
                <p className="text-sm sm:text-xs">{comment.content}</p>
              </div>
            </div>
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="flex items-center ml-4 mt-1">
                {reply.user && reply.user.userprofile ? (
                  <img
                    src={`${BASE_URL}${reply.user.userprofile.profile_image}`}
                    alt=""
                    className="rounded-full w-8 h-8 mr-2"
                  />
                ) : null}
                <div>
                  <h5 className="font-semibold text-sm sm:text-xs">
                    {reply.user ? reply.user.username : "Anonymous"}
                  </h5>
                  <p className="text-sm sm:text-xs">{reply.content}</p>
                </div>
              </div>
            ))}
            <ReplyForm
              commentId={comment.id}
              userId={userId}
              onSubmit={(newReply) => {
                setComments(
                  comments.map((c) =>
                    c.id === comment.id
                      ? { ...c, replies: [...c.replies, newReply] }
                      : c
                  )
                );
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default CommentsList;
