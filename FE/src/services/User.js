import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
});

export const login = (email, password) => {
  return axiosInstance.post("api/v1/user/login", { email, password });
};

export const register = (fullName, email, userName, password) => {
  return axiosInstance.post("api/v1/user/register", {
    fullName,
    email,
    userName,
    password,
  });
};

export const forgetpass = (email) => {
  return axiosInstance.post("api/v1/user/forgetpass", { email });
};

export const changepass = (oldPassword, newPassword, userId) => {
  return axiosInstance.post(`api/v1/user/changepass/${userId}`, {
    oldPassword,
    newPassword,
  });
};

export const updateProfile = (data, userId) => {
  return axiosInstance.put(`api/v1/user/profile/update/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUser = (data) => {
  return axiosInstance.get("api/v1/user/get_user", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
};

export const getVacationOnPageUser = (userId) =>{
  return axiosInstance.get(`vacation/${userId}`);
}