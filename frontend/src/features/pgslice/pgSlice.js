import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/pg";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchPgs = createAsyncThunk(
  "pg/fetchPgs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/getAllPg`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching the data");
    }
  }
);

export const addPg = createAsyncThunk(
  "pg/addPg",
  async (pgData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(pgData).forEach((key) => {
        if (key === "images") {
          pgData.images.forEach((image) => formData.append("images", image));
        } else if (key === "amenities") {
          pgData.amenities.split(",").forEach((a) => formData.append("amenities", a.trim()));

        } else {
          formData.append(key, pgData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/addPg`, formData, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const deletePg = createAsyncThunk(
  "pg/deletePg",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/deletePg/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting PG");
    }
  }
);

export const getPg = createAsyncThunk(
  "pg/getPg",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/getPg/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error getting PG");
    }
  }
);

export const updatePg = createAsyncThunk(
  "pg/updatePg",
  async (pgData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.keys(pgData).forEach((key) => {
        if (Array.isArray(pgData[key])) {
          pgData[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, pgData[key]);
        }
      });

      await axios.patch(`${API_URL}/updatePg/${pgData._id}`, formData, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      return pgData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating PG");
    }
  }
);

const pgSlice = createSlice({
  name: "pg",
  initialState: { pgRooms: [], selectedPg: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPgs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPgs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pgRooms = action.payload;
      })
      .addCase(fetchPgs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addPg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPg.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addPg.rejected, (state) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deletePg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePg.fulfilled, (state, action) => {
        state.pgRooms = state.pgRooms.filter((pg) => pg._id !== action.payload);
      })
      .addCase(deletePg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getPg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPg.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedPg = action.payload;
      })
      .addCase(getPg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updatePg.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePg.fulfilled, (state, action) => {
        state.pgRooms = state.pgRooms.map((pg) =>
          pg._id === action.payload._id ? action.payload : pg
        );
      })
      .addCase(updatePg.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default pgSlice.reducer;
