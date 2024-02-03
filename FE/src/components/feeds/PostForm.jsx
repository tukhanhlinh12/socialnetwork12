import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Alert, IconButton, Snackbar, TextField } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import axios from "axios";
import dayjs from "dayjs";

function PostForm(vacation) {
  const [media, setMedia] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [milestone, setMilestone] = useState();
  const [selectMilestoneForm, setSelectMilestoneForm] = useState(true);
  const [createMilestoneForm, setCreateMilestoneForm] = useState(false);
  const [content, setContent] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [openAlert2, setOpenAlert2] = useState(false);


  const handleShowAlert = () => {
    setOpenAlert(true);
  };
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };
  const handleShowAlert2 = () => {
    setOpenAlert2(true);
  };

  const handleCloseAlert2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert2(false);
  };

  const handleMilestoneChange = (e) => {
    setMilestone(e.target.value);
  };
  const handleAddMilestoneChange = (e) => {
    setMilestone(e.target.value);
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const toggleCreateMilestoneForm = (e) => {
    setCreateMilestoneForm(!createMilestoneForm);
    setSelectMilestoneForm(!selectMilestoneForm);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    file.preview = URL.createObjectURL(file);
    setMedia(file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedFile(file);
        setPreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      media && URL.revokeObjectURL(media.preview);
    };
  }, [media]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("vacation", vacation.vacation._id);
    formData.append("milestone", milestone);
    formData.append("content", content);
    if (selectedFile) {
      formData.append("images", selectedFile);
    }
    const apiUrl = `${process.env.API_URL}post/create-post`;

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      console.log(response);
      if (response.status === 200) {
        console.log("Data successfully sent to the API");
        setContent("")
        setSelectedFile(null)
        setPreview(null)
        handleShowAlert()
      } else {
        console.error("Failed to send data to the API");
        handleShowAlert2()
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      <div className="flex w-full h-auto mt-2 overflow-y-auto">
        <div className="flex flex-col w-full p-3 ">
          <div className="flex my-3 content-center items-center ">
            <h2 className="mr-4">Milestone: </h2>
            {selectMilestoneForm === true && (
              <div className="flex items-center !justify-around w-full">
                <FormControl className="w-[230px]" size="small">
                  <InputLabel id="demo-simple-select-label">Select</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={milestone}
                    label="Select"
                    onChange={handleMilestoneChange}
                  >
                    {vacation.vacation.milestones.map((item) => (
                      <MenuItem value={item._id}>
                        {dayjs(`${item.time}`).format("LL")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <h2>or create new</h2>
                <Fab
                  size="small"
                  color="primary"
                  aria-label="add"
                  onClick={toggleCreateMilestoneForm}
                >
                  <AddIcon />
                </Fab>
              </div>
            )}
            {createMilestoneForm === true && (
              <div className="flex self-center items-center">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      slotProps={{ textField: { size: "small" } }}
                      label="Select a new milestone"
                      value={milestone}
                      onChange={handleAddMilestoneChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <RemoveCircleTwoToneIcon
                  onClick={toggleCreateMilestoneForm}
                  color="warning"
                  className="mx-3 self-center mt-2"
                />
              </div>
            )}
          </div>
          <TextField
            className="w-[96%] !ml-2 "
            id="standard-textarea"
            placeholder="Say something about your trip..."
            multiline
            maxRows={10}
            rows={3}
            variant="standard"
            value={content}
            onChange={handleContentChange}
            autoFocus={true}
          />
          {preview && (
            <div>
              {selectedFile.type.startsWith("image") ? (
                <img
                  className="rounded-lg"
                  src={preview}
                  alt="Preview"
                  style={{ maxWidth: "100%" }}
                />
              ) : (
                <video
                  className="rounded-lg"
                  controls
                  style={{ maxWidth: "100%" }}
                >
                  <source src={preview} type={selectedFile.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {preview && <hr className="mt-3" />}
          <form
            action="/create-post"
            method="post"
            encType="multipart/form-data"
          >
            <input
              id="media"
              type="file"
              onChange={handleFileChange}
              accept="image/*, video/*"
              hidden
            />
          </form>
          <div className="flex w-full justify-between p-2">
            <div>
              <label htmlFor="media" alt="Media">
                <IconButton aria-label="upload" component="span">
                  <ImageOutlinedIcon />
                </IconButton>
              </label>
              <label htmlFor="">
                <IconButton aria-label="upload">
                  <PlaceOutlinedIcon />
                </IconButton>
              </label>
            </div>
            <Button
              className="!rounded-full"
              variant="contained"
              onClick={handleSubmit}
              type="submit"
            >
              Post
            </Button>
          </div>
          <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseAlert}
              severity="success"
              variant="filled"
              sx={{ width: "100%", zIndex: 100000 }}
            >
              Successfully created a post
            </Alert>
          </Snackbar>
          <Snackbar
            open={openAlert2}
            autoHideDuration={6000}
            onClose={handleCloseAlert2}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseAlert2}
              severity="error"
              variant="filled"
              sx={{ width: "100%", zIndex: 100000 }}
            >
              Failed create a post!
            </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
}

export default PostForm;
