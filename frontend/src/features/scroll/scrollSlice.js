import { createSlice } from "@reduxjs/toolkit";

const scrollSlice = createSlice({
  name: "scroll",
  initialState: {
    showNavbar: true,
    lastScrollY: 0,
  },
  reducers: {
    setShowNavbar: (state, action) => {
      state.showNavbar = action.payload;
    },
    setLastScrollY: (state, action) => {
      state.lastScrollY = action.payload;
    },
  },
});

export const { setShowNavbar, setLastScrollY } = scrollSlice.actions;

export default scrollSlice.reducer;
