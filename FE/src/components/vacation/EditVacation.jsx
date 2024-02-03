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
import { Alert, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../../redux/slice/userSlice";
import { createVacation, updateVacation } from "../../redux/slice/vacationSlice";
import { v4 as uuidv4 } from "uuid";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { Edit } from "@mui/icons-material";

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

export default function EditVacation(vacation) {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [milestones, setMilestones] = useState([...vacation.vacation.milestones]);
  const [selectedOption, setSelectedOption] = useState(vacation.vacation.privacy);
  const [title, setTitle] = useState(vacation.vacation.title);
  const [desc, setDesc] = useState(vacation.vacation.desc);
  const [userTags, setUseTags] = useState([...vacation.vacation.participants]);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState([dayjs(vacation.vacation.startedAt), dayjs(vacation.vacation.endedAt)]);
  const [milestonesDesc, setMilestonesDesc] = useState();
  const [milestonesDate, setMilestonesDate] = useState(dayjs());
  const [sortedMilestones, setSortedMilestones] = useState([]);
  const user = useSelector((state) => state.users);


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
    return <div className="w-full flex justify-center items-center"><CircularProgress color="inherit" className="flex justify-center" /></div>;
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
  };
  if (selectedOption === "onlyUserChoose") {
    vacationData.userChoose = allowedUsers.map(
      (allowedUsers) => allowedUsers._id
    );
  }
  const handleSubmit = async () => {
    const id =  vacation.vacation._id
    try {
      dispatch(updateVacation({id,vacationData}));
      handleClose();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<Edit/>}
      >
        Edit
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className=" !overflow-auto"
      >
        <Box sx={style} className=" !border-none !rounded-lg !w-[600px]	">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit your trip
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
              onChange={(event, value) => setAllowedUsers(...value)}
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
              value={userTags}
            //   defaultValue={vacation.vacation.participants}
              disableCloseOnSelect
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
            <Button
              className="w-full !bg-blue-500 !rounded-full !text-white"
              onClick={()=>handleSubmit()}
            >
              Update
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
}
