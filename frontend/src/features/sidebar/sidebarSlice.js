import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    open: false,
  },
  reducers: {
    setBarOpen: (state) => {
      state.open = !state.open;
    },
    setCloseBar: (state) => {
      state.open = false;
    },
    setOpenBar: (state) => {
      state.open = true;
    },
  },
});

export const { setBarOpen, setCloseBar, setOpenBar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
