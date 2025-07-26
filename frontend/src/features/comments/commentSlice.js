import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const API_URL = "http://localhost:5000/api/comments";
const API_URL = `${backendUrl}/api/comments`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (pgId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${pgId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching the data");
    }
  }
);

export const postComment = createAsyncThunk(
  "comments/postComment",
  async ({ pgId, text }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/${pgId}`,
        { text },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error posting comment");
    }
  }
);

export const replyToComment = createAsyncThunk(
  "comments/replyToComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/${commentId}/reply`,
        { text },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error replying to comment"
      );
    }
  }
);

export const likeComment = createAsyncThunk(
  "comments/likeComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/${commentId}/like`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error liking comment");
    }
  }
);

export const dislikeComment = createAsyncThunk(
  "comments/dislikeComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/${commentId}/dislike`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error disliking comment");
    }
  }
);

export const editComment = createAsyncThunk(
  "comments/editComment",
  async ({ commentId, text }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/${commentId}/edit`,
        { text },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error editing comment");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${commentId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting comment");
    }
  }
);

//reply

export const likeReply = createAsyncThunk(
  "comments/likeReply",
  async ({ commentId, replyId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/${commentId}/reply/${replyId}/like`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error liking comment");
    }
  }
);

export const dislikeReply = createAsyncThunk(
  "comments/dislikeReply",
  async ({ commentId, replyId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/${commentId}/reply/${replyId}/dislike`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error disliking comment");
    }
  }
);

export const editReply = createAsyncThunk(
  "comments/editReply",
  async ({ commentId, replyId, text }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/${commentId}/reply/${replyId}/edit`,
        { text },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error editing comment");
    }
  }
);

export const deleteReply = createAsyncThunk(
  "comments/deleteReply",
  async ({ commentId, replyId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${commentId}/reply/${replyId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      return { commentId, replyId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })
      .addCase(replyToComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(likeReply.fulfilled, (state, action) => {
        const commentIndex = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (commentIndex !== -1) state.comments[commentIndex] = action.payload;
      })
      .addCase(dislikeReply.fulfilled, (state, action) => {
        const commentIndex = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (commentIndex !== -1) state.comments[commentIndex] = action.payload;
      })
      .addCase(editReply.fulfilled, (state, action) => {
        const commentIndex = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (commentIndex !== -1) state.comments[commentIndex] = action.payload;
      })
      .addCase(deleteReply.fulfilled, (state, action) => {
        const { commentId, replyId } = action.payload;
        const comment = state.comments.find((c) => c._id === commentId);
        if (comment) {
          comment.replies = comment.replies.filter((r) => r._id !== replyId);
        }
      });
  },
});

export default commentSlice.reducer;

// .addCase(deleteReply.fulfilled, (state, action) => {
//   const { commentId, replyId } = action.payload;
//   const comment = state.comments.find((c) => c._id === commentId);
//   if (comment) {
//     comment.replies = comment.replies.filter((r) => r._id !== replyId);
//   }
// });
