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
      const user = action.payload.user || null;
      const token = action.payload.token || null;
      const role = action.payload.role || null;

      state.user = user;
      state.token = token;
      state.role = role;
      state.currentUser = user.uid;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },
    clearAuthUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.currentUser = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const { setAuthUser, clearAuthUser, setRole, setCurrentUser } =
  authSlice.actions;

export default authSlice.reducer;
