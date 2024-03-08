/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faPencilAlt,
  faTrash,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../Api/api";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import './feeds.css'
import { updatePost } from "../../Redux/Slice/postSlice";
import Comments from "../Comments/Comments";

export default function Feed({ post,onRemovePost,onEditPost }) {
  const [openComment, setOpenComment] = useState(false);
  const CurrentUserData = useSelector((state) => state.auth.user);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likedByUser, setLikedByUser] = useState(post.likedByUser);
  const userId = post?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImages, setEditedImages] = useState(post.images || []);
  const [editedVideos, setEditedVideos] = useState(post.videos || []);
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  console.log("PostId:",post)
  const [commentTotal,setCommentTotal] = useState(0)

  useEffect(() => {
    const fetchLikeInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/likes/`, {
          params: {
            postId: post.id || "",
            userId: post.user.id  || " ",
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("LikedByuser:",response.data.likedByUser)
        setLikeCount(response.data.count);
        setLikedByUser(response.data.likedByUser);
        setLiked(response.data.likedByUser);
      } catch (error) {
        console.error("Error fetching like info:", error);
      }
    };

    if (post.id && userId) {
      fetchLikeInfo();
    }
  }, [post, userId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/${post.id}/comments/`);
        setCommentTotal(response.data.length);
        console.log("Total Comments",commentTotal)
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [post.id,commentTotal]);

  const handleLikeClick = async () => {
    setLiked(!liked);
    try {
      const response = await axios.post(
        `${BASE_URL}/likes/`,
        {
          postId: post.id,
          userId: post.user.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (
        response.data.message === "Like created." ||
        response.data.message === "Like already exists."
      ) {
        setLikeCount(likedByUser ? likeCount - 1 : likeCount + 1);
        setLikedByUser(!likedByUser);
      }
    } catch (error) {
      console.error("Error posting like:", error);
    }
  };

  const CommentHandler = () => {
    setOpenComment(!openComment);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("-------------")

    const formData = new FormData();
    formData.append("user", userId);
    formData.append("id", post.id);
    formData.append("content", editedContent);

    Array.from(editedImages).forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    
      Array.from(editedVideos).forEach((video, index) => {
        formData.append(`videos[${index}]`, video);
      });

    try {
      const response = await axios.put(
        `${BASE_URL}/updatepost/${post.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      dispatch(updatePost(post.id, userId, response.data));
      onEditPost(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/updatepost/${post.id}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      onRemovePost(post.id);
      //   dispatch(deletePost(post.id, userId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="feed">
        <div className="top-content">
          <Link to={`/profile/${post.user?.id}`}>
            <div className="user">
              {CurrentUserData && CurrentUserData.user_profile ? (
                <img
                  src={`${BASE_URL}${CurrentUserData.user_profile.profile_image}`}
                  alt=""
                />
              ) : null}
              <div className="div">
                {CurrentUserData && CurrentUserData.user ? (
                  <h5 style={{ marginLeft: "10px" }}>
                    {CurrentUserData.user.username}
                  </h5>
                ) : null}
                <small style={{ marginLeft: "10px" }}>
                  {new Date(post.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          </Link>
          <div>
            <span>
              <FontAwesomeIcon
                icon={faTrash}
                className="cursor-pointer"
                onClick={handleDeleteClick}
              />
            </span>
          </div>
        </div>
        <div>
          <Transition show={isDeleteModalOpen} as={React.Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center"
              onClose={handleCancelDelete}
            >
              <div className="min-h-screen px-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-0"></div>
                  </div>
                </Transition.Child>

                <Transition.Child
                  as={React.Fragment}
                  enter="transform transition ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transform transition ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Confirm Deletion
                    </Dialog.Title>
                    <div className="mt-2">
                      <p>Are you sure you want to delete this post?</p>
                      <div className="mt-4">
                        <button
                          onClick={handleConfirmDelete}
                          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={handleCancelDelete}
                          className="mt-4 ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>

        <div className="content">{post.content}</div>

        <div className="media">
          {/* Display Images */}
          {post.images &&
            post.images.length > 0 &&
            post.images.map((image, index) => (
              <img
                key={index}
                src={`${BASE_URL}${image.images_url}`}
                alt={`Image ${index}`}
                className="media-item"
              />
            ))}

          {/* Display Videos */}
          {post.videos &&
            post.videos.length > 0 &&
            post.videos.map((video, index) => (
              <video key={index} controls className="media-item">
                <source
                  src={`${BASE_URL}${video.video_url}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ))}
        </div>

        <div className="bottom-content">
          <div className="action-item" onClick={handleLikeClick}>
            <span className={`${likedByUser ? "text-red-500" : ""}`}>
              <FontAwesomeIcon icon={faHeart} />
              {likeCount} Likes
            </span>
          </div>
          <div className="action-item" onClick={CommentHandler}>
            <span>
              <FontAwesomeIcon icon={faComment}  />{commentTotal} Comments
            </span>
          </div>
          <div className="action-item" onClick={handleEditClick}>
            <span>
              <FontAwesomeIcon icon={faPencilAlt} />
              Edit
            </span>
          </div>
          
        </div>
        {openComment && <Comments post = {post}/>}
        
        {/* Edit Post Modal */}
        <Transition show={isEditing} as={React.Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={handleCloseEditModal}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
              </Transition.Child>

              {/* Your existing modal content */}
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transform transition ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Edit Post
                  </Dialog.Title>

                  <div className="mt-2">
                    <form onSubmit={handleEditSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="editedContent"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Content
                        </label>
                        <textarea
                          name="editedContent"
                          id="editedContent"
                          rows="3"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="editedImages"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Current Images
                        </label>
                        {post.images && post.images.length > 0 ? (
                          post.images.map((image, index) => (
                            <div key={index} className="mt-2 rounded-md">
                              <img
                                src={`${BASE_URL}${image.images_url}`}
                                alt={`Current Image ${index}`}
                                style={{ maxWidth: "100%" }}
                              />
                              <p>Click to change:</p>
                            </div>
                          ))
                        ) : (
                          <p>No images available</p>
                        )}
                        <input
                          type="file"
                          name="editedImages"
                          id="editedImages"
                          accept="image/*"
                          multiple
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          onChange={(e) => setEditedImages(e.target.files)}
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="editedVideos"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Current Videos
                        </label>
                        {post.videos && post.videos.length > 0 ? (
                          post.videos.map((video, index) => (
                            <div key={index} className="mt-2 rounded-md">
                              <video
                                controls
                                className="mt-2 rounded-md"
                                style={{ maxWidth: "100%" }}
                              >
                                <source
                                  src={`${BASE_URL}${video.video_url}`}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                              <p>Click to change:</p>
                            </div>
                          ))
                        ) : (
                          <p>No videos available</p>
                        )}
                        <input
                          type="file"
                          name="editedVideos"
                          id="editedVideos"
                          accept="video/*"
                          multiple
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          onChange={(e) => setEditedVideos(e.target.files)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                      <button
                        style={{ marginLeft: "20px" }}
                        onClick={handleCloseEditModal}
                        type="button"
                        className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Close
                      </button>
                    </form>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        
      </div>
    </>
  );
}