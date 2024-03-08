
import { createSlice } from '@reduxjs/toolkit';

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    userProfile: null,
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const { setUserProfile } = userProfileSlice.actions;
export const selectUserProfile = (state) => state.userProfile.userProfile;

export default userProfileSlice.reducer;
