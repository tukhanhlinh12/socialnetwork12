import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/user.slice";
import usersReducer from "../slice/userSlice";
import vacationReducer from "../slice/vacationSlice";
import postReducer from "../slice/postSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    user: usersReducer,
    vacation: vacationReducer,
    post: postReducer,
  }
});
