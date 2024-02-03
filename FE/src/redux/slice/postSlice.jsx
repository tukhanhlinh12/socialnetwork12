import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPostDetail = createAsyncThunk(
  "post/fetchDetail",
  async (postId) => {
    const response = await axios.get(
      `${process.env.API_URL}post/detail/${postId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data.data.post;
  }
);

export const toggleLike = createAsyncThunk(
  "post/toggleLike",
  async ({ postId, userId }) => {
    console.log(postId);
    const response = await axios.patch(
      `${process.env.API_URL}post/${postId}/like`,
      { userId },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data.data);
    return response.data.data;
  }
);

export const createComment = createAsyncThunk(
  "post/createComment",
  async ({postId,comment}) => {
    const response = await axios.post(
      `${process.env.API_URL}post/detail/${postId}`,{comment},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    postDetail: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostDetail.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.loading = "succeeded";
        if (state.postDetail !== action.payload) {
          state.postDetail = action.payload;
        }
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.loading = "succeeded";
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.postDetail.comments.push(action.payload);
      })
  },
});

export default postSlice.reducer;
