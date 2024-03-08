import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import ConfirmationModal from "./ConfirmationPost";
import ReportDropdown from "./ReportDropDown";
import { BASE_URL } from "../../../Api/api";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/socialadmin/admin/reports/`
        );
        console.log(response.data, "----");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newDropdownVisible = {};
    posts.forEach((post) => {
      newDropdownVisible[post.id] = false;
    });
    setDropdownVisible(newDropdownVisible);
  }, [posts]);

  const handleRejectPostClick = (postId) => {
    setSelectedPost(postId);
    setShowConfirmationModal(true);
  };

  const handleConfirmRejection = async () => {
    console.log("jjjjjjjjjjjjjjj");
    try {
      await axios.post(
        `${BASE_URL}/socialadmin/posts/${selectedPost}/`
      );
      const response = await axios.get(
        `${BASE_URL}/socialadmin/admin/reports/`
      );
      setPosts(response.data);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto my-5">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Post ID</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Report Count</th>
              <th className="py-2 px-4 border-b">Reports</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="py-2 px-4 border-b">{post.id}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(post.created_at).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">{post.user__username}</td>
                <td className="py-2 px-4 border-b">{post.report_count}</td>
                <td className="py-2 px-4 border-b">
                  <ReportDropdown
                    reports={post.reports || []}
                    toggleDropdown={() =>
                      setDropdownVisible((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  {post.is_deleted ? (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
                      onClick={() => handleRejectPostClick(post.id)}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                      onClick={() => handleRejectPostClick(post.id)}
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {selectedPost && (
        <ConfirmationModal
          show={showConfirmationModal}
          onHide={closeConfirmationModal}
          onConfirm={handleConfirmRejection}
          title="Reject Post"
          message="Are you sure you want to reject this post?"
        />
      )}
    </>
  );
};

export default React.memo(PostList);
