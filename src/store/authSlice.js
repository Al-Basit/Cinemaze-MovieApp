import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authUser: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      state.isLoading = false;
    },
    clearAuthUser: (state) => {
      state.authUser = null;
      state.isLoading = false;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export default authSlice.reducer;
