import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendUrl}/api`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchPgs = createAsyncThunk(
  "pg/fetchPgs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/pg/getAllPg`, {
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
          pgData.amenities.forEach((a) =>
            formData.append("amenities", a.trim())
          );
        } else {
          formData.append(key, pgData[key]);
        }
      });

      const response = await axios.post(`${API_URL}/pg/addPg`, formData, {
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
      await axios.delete(`${API_URL}/pg/deletePg/${id}`, {
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
      const { data } = await axios.get(`${API_URL}/pg/getPg/${id}`, {
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

      await axios.patch(`${API_URL}/pg/updatePg/${pgData._id}`, formData, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      return pgData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating PG");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ pgRoomId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/cart/addcart`,
        { pgId: pgRoomId, quantity },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error adding to the cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (pgRoomId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/cart/removecart/${pgRoomId}`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      return pgRoomId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error removing from the cart"
      );
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/cart/getcart`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "ERror fetching the items from the cart"
      );
    }
  }
);

const pgSlice = createSlice({
  name: "pg",
  initialState: {
    pgRooms: [],
    selectedPg: null,
    cart: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = [];
    },
    clearStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
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
        state.pgRooms.push(action.payload);
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
      })
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;

        if (item && item.pgId) {
          const isAlreadyInCart = state.cart.some(
            (cartItem) => cartItem.pgId !== item.pgId
          );

          if (!isAlreadyInCart) {
            state.cart.push(item);
          }
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart.items = state.cart.items.filter(
          (item) => item.pgId._id !== action.payload
        );
      });
  },
});

export const { clearCart, clearStatus } = pgSlice.actions;

export default pgSlice.reducer;
