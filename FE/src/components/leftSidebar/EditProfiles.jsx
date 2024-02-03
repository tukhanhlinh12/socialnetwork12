import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { updateProfile, getUser } from "../../services/User";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { updateUser } from "../../redux/slice/user.slice";
import { useDispatch } from "react-redux";

const EditProfileModal = ({ open, handleClose, user }) => {
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(user.user.fullName);
  const [userName, setUserName] = useState(user.user.userName);
  const [dateOfBirth, setDateOfBirth] = useState(dayjs(user.user.dateOfBirth));
  const [gender, setGender] = useState(user.user.gender);
  const [avatar, setAvatar] = useState(user.user.avatar);
  const [cover, setCover] = useState(user.user.cover);

  const [avatarPreview, setAvatarPreview] = useState(user.user.avatar);
  const [coverPreview, setCoverPreview] = useState(user.user.cover);

  const handleAvatarUpload = (e) => {
    setAvatar(e.target.files[0]);
    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleCoverUpload = (e) => {
    setCover(e.target.files[0]);
    setCoverPreview(URL.createObjectURL(e.target.files[0]));
  };

  // console.log(user.user);
  const handleSave = () => {
    const formData = new FormData();
    formData.append("fullName", String(fullName));
    formData.append("userName", String(userName));
    formData.append("dateOfBirth", String(dateOfBirth));
    formData.append("gender", String(gender));
    formData.append("avatar", avatar);
    formData.append("cover", cover);

    updateProfile(formData, user.user._id)
      .then((response) => {
        handleClose();
        getUser().then(() => {});
        dispatch(updateUser(response.data.user));
        localStorage.setItem("user", JSON.stringify(response.data.user));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <div
          style={{
            width: "500px",
            height: "300px",
            border: "1px solid black",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${coverPreview})`,
          }}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="cover"
            type="file"
            onChange={handleCoverUpload}
          />
          <label htmlFor="cover">
            <IconButton color="primary" component="span">
              <CameraAltIcon />
            </IconButton>
          </label>
        </div>
        <br />
        <div
          style={{
            borderRadius: "50%",
            border: "1px solid black",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "103px",
            height: "100px",
            backgroundImage: `url(${avatarPreview})`,
          }}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar"
            type="file"
            onChange={handleAvatarUpload}
          />
          <label htmlFor="avatar">
            <IconButton
              color="primary"
              component="span"
              style={{ padding: "5px" }}
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
          </label>
        </div>
        <br />
        <TextField
          margin="dense"
          label="Full Name"
          fullWidth
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="User Name"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Date of Birth"
              value={dateOfBirth}
              slotProps={{ textField: { fullWidth: true } }}
              onChange={(newValue) => setDateOfBirth(newValue)}
            />
          </DemoContainer>
        </LocalizationProvider>
        {/* <TextField
          margin="dense"
          label="Gender"
          fullWidth
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />  */}
        <br />
        <FormControl fullWidth>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
