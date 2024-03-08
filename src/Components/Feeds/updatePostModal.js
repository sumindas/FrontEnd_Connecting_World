import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../Api/api";

export default function EditPostModal({ post, images, videos, onClose }) {
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState('');
  const [editedVideo, setEditedVideo] = useState('');

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setEditedImage(e.target.value);
  };

  const handleVideoChange = (e) => {
    setEditedVideo(e.target.value);
  };

  const handleUpdateClick = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updatepost/${post.id}`,
        {
          content: editedContent,
          image: editedImage,
          video: editedVideo,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "Post updated.") {
        onClose();
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-96 rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        <textarea
          value={editedContent}
          onChange={handleContentChange}
          className="w-full h-24 p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Edit your post..."
        />
        <input
          type="text"
          value={editedImage}
          onChange={handleImageChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Image URL"
        />
        <input
          type="text"
          value={editedVideo}
          onChange={handleVideoChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Video URL"
        />
        <div className="mt-4">
          <h3 className="mb-2">Media Preview</h3>
          <div className="media-preview">
            {images.map((image, index) => (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img key={index} src={`${BASE_URL}${image.images_url}`} alt={`Post Image ${index}`} />
            ))}
            {videos.map((video, index) => (
              <video key={index} controls>
                <source src={`${BASE_URL}${video.video_url}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleUpdateClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Update Post
          </button>
          <button onClick={onClose} className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 focus:outline-none">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
