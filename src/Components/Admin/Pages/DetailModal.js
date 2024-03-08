/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import BASE_URL from '../../../Api/api'

const DetailModal = ({ post, show, onClose }) => {
  if (!show) {
    return null;
  }

  console.log(post);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Post Details
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Post ID: {post.id}</p>
                  <p className="text-sm text-gray-500">
                    Created At: {new Date(post.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    User: {post.user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    Content: {post.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    Likes Count: {post.like_count}
                  </p>
                  <p className="text-sm text-gray-500">
                    Comments Counts: {post.comment_count}
                  </p>
                  <div className="mt-4">
                    {post.images &&
                      post.images.map((imageObj, index) => {
                        const imageUrl = `${BASE_URL}${imageObj.images_url}`;
                        return (
                          <img
                            src={imageUrl}
                            alt={`Post ${post.id} Image ${index + 1}`}
                            key={index}
                            className="mb-2"
                          />
                        );
                      })}
                    {post.videos &&
                      post.videos.map((videoObj, index) => {
                        const videoUrl = `${BASE_URL}${videoObj.video_url}`;
                        return (
                          <video controls key={index} className="mb-2">
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
