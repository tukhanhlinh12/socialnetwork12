import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVacations = createAsyncThunk(
  "vacation/fetchVacations",
  async () => {
    const response = await axios.get(
      `${process.env.API_URL}vacation/get-all-vacations?pageSize=${100000000}&pageIndex=${1}`,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }
    );
    return response.data.data;
  }
);
export const createVacation = createAsyncThunk(
  "vacation/createVacation",
  async ({ vacationData, userId }) => {
    const response = await axios.post(
      `${process.env.API_URL}vacation/create/`,
      vacationData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data.data;
  }
);

export const fetchVacationDetail = createAsyncThunk(
  "vacation/fetchDetail",
  async (id) => {
    const response = await axios.get(
      `${process.env.API_URL}vacation/detail/${id}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data.data;
  }
);

export const fetchInProgressVacations = createAsyncThunk(
  "vacation/fetchInProgress",
  async () => {
    const response = await axios.get(
      `${process.env.API_URL}vacation/in-progess/`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data.data;
  }
);

export const finishVacation = createAsyncThunk(
  "vacation/finish",
  async (id) => {
    const response = await axios.patch(`${process.env.API_URL}vacation/finish/${id}`,{status: "Finished"},{
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response.data.data;
  }
)

export const updateVacation = createAsyncThunk(
  "vacation/update",
  async ({id,vacationData}) => {
    const response = await axios.patch(`${process.env.API_URL}vacation/${id}`,vacationData,{
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
    return response.data.data
  }
)
export const deleteVacation = createAsyncThunk(
  "vacation/delete",
  async (id) => {
    const response = await axios.delete(`${process.env.API_URL}vacation/delete/${id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    console.log(response)
    return response.data.data;
  }
);
export const createPostInVacation = createAsyncThunk(
  "vacation/createPostInVacation",
  async ({ vacationId, milestoneId, postData }) => {
    const response = await axios.post(
      `${process.env.API_URL}post/create-post`,
      { vacationId, milestoneId, postData },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data.data;
  }
);
export const fetchUserVacations = createAsyncThunk(
  "vacation/fetchUserVacations",
  async (userId) => {
    const response = await axios.get(
      `${process.env.API_URL}vacation/${userId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data.data;
  }
);

const vacationSlice = createSlice({
  name: "vacation",
  initialState: {
    vacations: [],
    userVacations: [],
    inProgressVacations: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVacation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVacation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vacations = [...state.vacations, action.payload];
      })
      .addCase(createVacation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchVacations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVacations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vacations = [...state.vacations, ...action.payload];
      })
      .addCase(fetchVacations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchVacationDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVacationDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.detail !== action.payload) {
          state.detail = action.payload;
        }
      })
      .addCase(fetchVacationDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // .addCase(createPostInVacation.fulfilled, (state, action) => {
      //   state.status = "succeeded";
      //   state.detail = state.vacations.map(vacation =>
      //     vacation._id === action.payload.vacationId
      //       ? {
      //           ...vacation,
      //           milestones: vacation.milestones.map(milestone =>
      //             milestone._id === action.payload.milestoneId
      //               ? {
      //                   ...milestone,
      //                   posts: [...milestone.posts, action.payload.postData],
      //                 }
      //               : milestone
      //           ),
      //         }
      //       : vacation
      //   )
      // })
      .addCase(fetchInProgressVacations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInProgressVacations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inProgressVacations = action.payload;
      })
      .addCase(fetchInProgressVacations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(finishVacation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vacations = state.vacations.map(vacation =>
          vacation._id === action.payload._id ? action.payload : vacation
        );
        state.inProgressVacations = state.inProgressVacations.filter(vacation =>
          vacation._id !== action.payload._id
        );
      })
      .addCase(updateVacation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVacation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vacations = state.vacations.map(vacation =>
          vacation._id === action.payload._id ? action.payload : vacation
        );
        state.inProgressVacations = state.inProgressVacations.map(vacation =>
          vacation._id === action.payload._id ? action.payload : vacation
        );
      })
      .addCase(updateVacation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteVacation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteVacation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserVacations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserVacations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userVacations = action.payload;
      })
      .addCase(fetchUserVacations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export default vacationSlice.reducer;
