import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    role: null,
    currentUser: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload;
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.currentUser = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    }
  },
});

export const { setAuthUser, clearAuthUser, setRole, setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
