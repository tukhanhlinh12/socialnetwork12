import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LicenseInfo } from "@mui/x-date-pickers-pro";
import AddIcon from "@mui/icons-material/Add";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/slice/userSlice";
import { createVacation } from "../../redux/slice/vacationSlice";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";

LicenseInfo.setLicenseKey(
  "e0d9bb8070ce0054c9d9ecb6e82cb58fTz0wLEU9MzI0NzIxNDQwMDAwMDAsUz1wcmVtaXVtLExNPXBlcnBldHVhbCxLVj0y"
);
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CreateJourney() {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [selectedOption, setSelectedOption] = useState("public");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [userTags, setUseTags] = useState([]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState([dayjs(), dayjs()]);
  const [milestonesDesc, setMilestonesDesc] = useState();
  const [milestonesDate, setMilestonesDate] = useState(dayjs());
  const [sortedMilestones, setSortedMilestones] = useState([]);
  const user = useSelector((state) => state.users);
  const [openAlert, setOpenAlert] = useState(false);

  const handleShowAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };
  const handleMilestonesDescChange = (e) => {
    setMilestonesDesc(e.target.value);
  };
  useEffect(() => {
    const cloneMilestones = [...milestones];
    cloneMilestones.sort((a, b) => new Date(a.time) - new Date(b.time));

    setSortedMilestones(cloneMilestones);
  }, [milestones]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="w-full flex justify-center items-center">
        <CircularProgress color="inherit" className="flex justify-center" />
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const handleAddMilestone = () => {
    if (milestonesDate && milestonesDesc) {
      setMilestones([
        ...milestones,
        {
          time: milestonesDate.format("LL"),
          desc: milestonesDesc,
          key: new Date().getTime(),
        },
      ]);
      setMilestonesDesc("");
      setMilestonesDate(dayjs(null));
    }
  };
  const handleDeleteMilestone = (index) => {
    const newMilestones = [...sortedMilestones];
    newMilestones.splice(index, 1);
    setSortedMilestones(newMilestones);
    setMilestones(newMilestones);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const vacationData = {
    privacy: selectedOption,
    title: title,
    desc: desc,
    participants: userTags.map((userTags) => userTags._id),
    startedAt: estimatedTime[0],
    endedAt: estimatedTime[1],
    milestones: milestones,
  };
  if (selectedOption === "onlyUserChoose") {
    vacationData.userChoose = allowedUsers.map(
      (allowedUsers) => allowedUsers._id
    );
  }
  const handleSubmit = async () => {
    try {
      dispatch(createVacation({ vacationData }));
      handleShowAlert();
      handleClose();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getModules = () => {
    return sortedMilestones.map((milestone, index) => {
      return (
        <TimelineItem key={milestone.key}>
          <TimelineOppositeContent color="textSecondary">
            {milestone.time}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{milestone.desc}</TimelineContent>
          <button onClick={() => handleDeleteMilestone(index)}>Delete</button>
        </TimelineItem>
      );
    });
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        className="w-full !bg-blue-500 !rounded-full !text-white"
      >
        Start a trip
      </Button>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{ width: "100%",zIndex: 100000 }}
        >
          Successfully created a vacation
        </Alert>
      </Snackbar>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="!overflow-auto"
      >
        <Box sx={style} className=" !border-none !rounded-lg !w-[600px]">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Start a new trip
          </Typography>
          <select
            className="w-fit rounded-full border border-solid text-blue-400 px-2 border-blue-400"
            id="privacyOptions"
            value={selectedOption}
            onChange={handleOptionChange}
            defaultValue={"public"}
          >
            <option value={"public"}>Everyone</option>
            <option value={"onlyMe"}>Only Me</option>
            <option value={"onlyUserChoose"}>Custom</option>
          </select>
          {selectedOption === "onlyUserChoose" && (
            <Autocomplete
              className="my-3 !z-0"
              multiple
              size="small"
              limitTags={2}
              id="multiple-limit-tags"
              onChange={(event, value) => setAllowedUsers(value)}
              options={users}
              getOptionLabel={(option) => option.userName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Custom privacy list"
                  placeholder="Username"
                  className="!z-0"
                />
              )}
            />
          )}
          <form className="p-4 md:p-5 flex flex-col gap-4">
            <TextField
              id="standard-multiline-flexible"
              label="Title"
              multiline
              maxRows={2}
              variant="standard"
              value={title}
              onChange={handleTitleChange}
              autoFocus={true}
            />
            <TextField
              id="standard-multiline-flexible"
              label="Description"
              multiline
              maxRows={6}
              variant="standard"
              value={desc}
              onChange={handleDescChange}
            />
            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={users}
              disableCloseOnSelect
              //   onChange={handleUserTagsChange}
              onChange={(event, value) => setUseTags(value)}
              getOptionLabel={(option) => option.userName}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.userName}
                </li>
              )}
              //   style={{ width: 500 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Participants..."
                  placeholder="Add an user"
                />
              )}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem label="Estimated time: " component="DateRangePicker">
                <DateRangePicker
                  value={estimatedTime}
                  onChange={(newValue) => setEstimatedTime(newValue)}
                />
              </DemoItem>
            </LocalizationProvider>
            <div className="flex items-center">
              <h1 className="mr-4">Milestones: </h1>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Time"
                  minDate={estimatedTime[0]}
                  maxDate={estimatedTime[1]}
                  value={milestonesDate}
                  onChange={(newValue) => setMilestonesDate(newValue)}
                />
                <TextField
                  id="outlined-multiline-flexible"
                  label="Describe"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  className="w-full"
                  value={milestonesDesc}
                  onChange={handleMilestonesDescChange}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAddMilestone}
                >
                  <AddIcon />
                </Button>
              </DemoContainer>
            </LocalizationProvider>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              {getModules()}
            </Timeline>
            <Button
              className="w-full !bg-blue-500 !rounded-full !text-white"
              onClick={handleSubmit}
            >
              Create
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}
