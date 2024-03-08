import { createSlice } from "@reduxjs/toolkit";

const initialState = {}

const postSlice = createSlice({
 name: "post",
 initialState,
 reducers: {
    addPost: (state, action) => {
      const { userId, post } = action.payload;
      if (!state[userId]) {
        state[userId] = []; 
      }
      const postExists = state[userId].some(existingPost => existingPost.id === post.id);
      if (!postExists){
        state[userId].push(post);
      }
    },
    editPost: (state, action) => {
      const { userId, post } = action.payload;
      if (state[userId]) {
        const index = state[userId].findIndex((p) => p.id === post.id);
        if (index !== -1) {
          state[userId][index] = post; 
        }
      }
    },
    deletePost: (state, action) => {
      const { userId, postId } = action.payload;
      if (state[userId]) {
        state[userId] = state[userId].filter((post) => post.id !== postId);
      }
    },
    updatePost: (state, action) => {
      const { userId, postId, updatedPost } = action.payload;
      if (state[userId]) {
        const index = state[userId].findIndex((p) => p.id === postId);
        if (index !== -1) {
          state[userId][index] = { ...state[userId][index], ...updatedPost };
        }
      }
    },
    resetState : () => initialState, 
 },
});

export const { addPost, deletePost,editPost,updatePost,resetState } = postSlice.actions;
export default postSlice.reducer;
