import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DetailModal from './DetailModal'; 


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/socialadmin/admin/posts/');
        setPosts(response.data);
        console.log("res",response.data)
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchData();
  }, []);

  const handleViewMoreClick = (post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };


  

  const closeDetailModal = () => {
    setShowDetailModal(false);
  };


  return (
    <>
      <div className="text-center">
        <h1 className="text-4xl mt-3 mb-3 text-pink-700 font-bold">Post Management</h1>
      </div>
      <div className="container mx-auto my-5">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Post ID</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">User</th>
              {/* <th className="py-2 px-4 border-b">Likes</th>
              <th className="py-2 px-4 border-b">Comments</th> */}
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="py-2 px-4 border-b">{post.id}</td>
                <td className="py-2 px-4 border-b">{new Date(post.created_at).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{post.user.username}</td>
                {/* <td className="py-2 px-4 border-b">{post.likes_count}</td>
                <td className="py-2 px-4 border-b">{post.comments_count}</td> */}
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleViewMoreClick(post)}>
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <DetailModal
          post={selectedPost}
          show={showDetailModal}
          onClose={closeDetailModal}
        />
      )}

      
    </>
  );
};

export default React.memo(PostList);
