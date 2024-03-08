/* eslint-disable no-unused-expressions */
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    
    name :'auth',
    initialState : {
        user : null,
        error : null,
        email : "",
        login : false,
        token : null,
        admin_token : "",
        reset_email:"",
        allUsers : [],
    },
    reducers :{
        setUser : (state,action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.error = null
        },
        setError : (state,action)=>{
            console.log("Error:",action.payload)
            state.error = action.payload
        },
        clearError :(state) => {                                                                       
          state.error = null
        },
        setEmail :(state,action) => {
          state.email = action.payload
        },
        setLogin : (state,action) => {
          state.user = action.payload.user
          state.login = true
        },
        setToken :(state,action) =>{
          state.token = action.payload
        },
        userLogout: (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
          state.login = false;
          state.token = null;
      },
      adminLogin:(state,action) => {
        state.admin_token = action.payload.jwt
      },
      adminLogout : (state) => {
        state.admin_token = " "
        state.allUsers = []
      },
      UsersList : (state,action) => {
        state.allUsers = action.data
      },
      userUpdate : (state,action) => {
          state.user.username = action.payload.username;
          state.user.location = action.payload.location;
          state.user.dateOfBirth = action.payload.dateOfBirth;
          state.user.bio = action.payload.bio;
          state.user.profileImage = action.payload.profileImage;
          state.user.coverPhoto = action.payload.coverPhoto;
      },
      setResetEmail: (state, action) => {
        state.reset_email = action.payload; 
    },
    },
    
   
})


export const {setUser,setError,clearError,setEmail,setLogin,setToken,userLogout,adminLogin,adminLogout,usersList,userUpdate,setResetEmail} = authSlice.actions

export default authSlice.reducer