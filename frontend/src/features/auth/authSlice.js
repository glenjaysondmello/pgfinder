import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload;
    
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
   
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export default authSlice.reducer;
