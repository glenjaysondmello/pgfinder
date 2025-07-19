import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/pay";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const payment = createAsyncThunk(
  "pay/payment",
  async ({ amt, pgId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/payment`,
        { pgId, amount: amt },
        { headers: getAuthHeaders(), withCredentials: true }
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error Sending the data");
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
      return rejectWithValue(error.response?.data || "Error Sending the data");
    }
  }
);

export const userLogs = createAsyncThunk(
  "pay/userLogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/user_logs`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching the data");
    }
  }
);

export const adminLogs = createAsyncThunk(
  "pay/adminLogs",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/admin_logs`, {
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
    paymentStatus: "idle",
    verifyStatus: "idle",
    fetchPaymentsStatus: "idle",
    order: null,
    history: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(payment.pending, (state) => {
        state.paymentStatus = "loading";
      })
      .addCase(payment.fulfilled, (state, action) => {
        state.paymentStatus = "succeeded";
        state.order = action.payload;
      })
      .addCase(payment.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.error = action.payload;
      })

      .addCase(verify.pending, (state) => {
        state.verifyStatus = "loading";
      })
      .addCase(verify.fulfilled, (state) => {
        state.verifyStatus = "succeeded";
      })
      .addCase(verify.rejected, (state, action) => {
        state.verifyStatus = "failed";
        state.error = action.payload;
      })

      .addCase(userLogs.pending, (state) => {
        state.fetchPaymentsStatus = "loading";
      })
      .addCase(userLogs.fulfilled, (state, action) => {
        state.fetchPaymentsStatus = "succeeded";
        state.history = action.payload;
      })
      .addCase(userLogs.rejected, (state, action) => {
        state.fetchPaymentsStatus = "failed";
        state.error = action.payload;
      })

      .addCase(adminLogs.pending, (state) => {
        state.fetchPaymentsStatus = "loading";
      })
      .addCase(adminLogs.fulfilled, (state, action) => {
        state.fetchPaymentsStatus = "succeeded";
        state.history = action.payload;
      })
      .addCase(adminLogs.rejected, (state, action) => {
        state.fetchPaymentsStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
