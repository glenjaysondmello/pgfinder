import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/pg";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const searchPgs = createAsyncThunk(
  "search/searchPgs",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/searchPgs?query=${query}`, {
        headers: getAuthHeaders(),
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching the data");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
      if (!action.payload.trim()) {
        state.results = [];
        state.error = null;
      }
    },
    clearResults: (state) => {
      state.results = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchPgs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPgs.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchPgs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
