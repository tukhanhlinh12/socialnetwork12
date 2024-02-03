import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  email: {},
  token: "",
  
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
    forgetpassSuccess: (state, action) => {
      state.email = action.payload.email;
    },
    changepassSuccess: (state, action) => {
      state.id = action.payload.id;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});
export const {
  loginSuccess,
  registerSuccess,
  forgetpassSuccess,
  changepassSuccess,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;
