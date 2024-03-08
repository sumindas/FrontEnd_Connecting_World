// Feeds.js
import React from 'react';
import Feed from './Feed';
import {  useSelector } from 'react-redux';


export default function Feeds({feeds,onRemovePost,onEditPost }) {
  const userId = useSelector((state) => state.auth.user?.user?.id);
  const posts = useSelector((state) => state.post);
  console.log("----",posts)
  console.log("User", userId);


  return (

    <>
      <div className="feeds">
        {feeds.length >  0 ? (
          feeds.map((feed) => (
            <Feed key={feed.id} post={feed} onRemovePost={ onRemovePost } onEditPost ={ onEditPost }/>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No posts yet.
          </div>
        )}
      </div>
    </>
  
  );
}
