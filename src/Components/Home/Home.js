
import React, { useState, useEffect } from 'react';
import FeedItem from './FeedItem';
import { BASE_URL } from '../../Api/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);

  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
   
  useEffect(() => {
    if(!token){
      navigate('/')
    } 
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/followed-posts/${userId}/`);
        console.log(response.data)
        setPosts(response.data);
        
      } catch (error) {
        console.error("Failed to fetch posts: ", error);
      }
    };
  
    fetchPosts();   
  }, [userId]);
  

  return (
    <div className="container mx-auto px-4"> 
      {posts.length ===  0 ? (
        <p className="text-center text-gray-500">No posts to display yet.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
