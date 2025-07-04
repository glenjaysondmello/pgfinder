import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/pay";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const payment = createAsyncThunk(
  "pay/payment",
  async (amt, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/payment`,
        { amount: amt },
        { headers: getAuthHeaders(), withCredentials: true }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching the data");
    }
  }
);

export const verify = createAsyncThunk(
  "pay/verify",
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/verify`, paymentData, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching the data");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    status: "idle",
    order: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(payment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(payment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(payment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
