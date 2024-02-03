import React, { useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import { Alert, Avatar, AvatarGroup, Button, Grid, IconButton, Popover, Snackbar, Tooltip } from "@mui/material";
import { AVATAR_URL, CLOUDINARY_URL } from "../../config";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fade from "@mui/material/Fade";
import TourTwoToneIcon from "@mui/icons-material/TourTwoTone";
import { green, orange } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Delete, Edit, LockPerson, MoreHoriz, Public } from "@mui/icons-material";
import relativeTime from "dayjs/plugin/relativeTime";
import EditVacation from "../vacation/EditVacation";
import { deleteVacation } from "../../redux/slice/vacationSlice";

function VacationFeeds(vacation) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users);
  dayjs.extend(relativeTime);
  const [anchorEl, setAnchorEl] = React.useState(null);
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleSubmit = () => {
    incrementViews();
    navigate(`/vacation/${vacation.vacation._id}`);
  };
  const incrementViews = async () => {
    const currentViews = vacation.vacation.views;
    const data = {"views":  currentViews + 1};
    try {
      await axios.patch(
        `${process.env.API_URL}vacation/${vacation.vacation._id}`,
        data,{
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };
  const handleDeleteVacation = () =>{
    const id = vacation.vacation._id
    dispatch(deleteVacation(id))
  }
  console.log(vacation.vacation)
  return (
    <>
      <div className="mb-5">
        <div className="border w-full rounded-lg px-8 pt-8 rounded-b-none hover:bg-slate-100">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-x-3">
              <Avatar
                src={`${CLOUDINARY_URL}/${vacation?.vacation.createdBy.avatar}`}
                sx={{ width: 60, height: 60 }}
              ></Avatar>
              <div className="w-full flex flex-col">
                <div className="flex gap-x-2">
                  <p>{vacation.vacation.createdBy.fullName}</p>
                  <p className=" text-slate-400">
                    @{vacation.vacation.createdBy.userName}
                  </p>
                </div>
                <div className="flex w-full items-center">
                  <p className=" text-slate-400">
                    Created {dayjs(vacation.vacation.createdAt).fromNow()}{" "}
                    &#x2022;
                  </p>
                  {vacation.vacation.privacy === "public" && (
                    <Tooltip title="Public">
                      <Public fontSize="small" color="disabled" />
                    </Tooltip>
                  )}
                  {vacation.vacation.privacy === "onlyMe" && (
                    <Tooltip title="Private">
                      <LockPerson fontSize="small" color="disabled" />
                    </Tooltip>
                  )}
                  {vacation.vacation.privacy === "onlyUserChoose" && (
                    <Tooltip title="Customs">
                      <Edit fontSize="small" color="disabled" />
                    </Tooltip>
                  )}
                </div>
              </div>
              {vacation.vacation.createdBy._id==user.user._id&&(<div><IconButton
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                <MoreHoriz/>
              </IconButton>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="flex flex-col p-3">

                <EditVacation vacation={vacation.vacation}/>
                <Button onClick={()=>handleDeleteVacation()} color="warning" startIcon={<Delete/>}>Delete</Button>
                </div>
              </Popover></div>)}
            </div>
            <div className="w-full">
              <p className=" text-sky-600 text-2xl antialiased font-bold tracking-wide text-wrap uppercase border-b p-3">
                {vacation.vacation.title}
              </p>
              <div className="flex items-center py-2">
                <PeopleIcon fontSize="large" color="primary" />
                <p className="mx-2">
                  {vacation.vacation.participants.length} Participants
                </p>
                <AvatarGroup max={7} className="justify-self-end">
                  {vacation.vacation.participants.map((user) => (
                    <Tooltip title={`${user.fullName}`} key={user._id}>
                      <Avatar  src={`${CLOUDINARY_URL}/${user.avatar}`} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </div>
              <div className="flex items-center">
                <CalendarMonthOutlinedIcon
                  fontSize="large"
                  className="mr-2"
                  sx={{ color: orange[500] }}
                />
                <Grid container spacing={2} columns={16}>
                  <Grid item xs={8}>
                    <p className="border-r">
                      Start: {dayjs(vacation.vacation.startedAt).format("LL")}
                    </p>
                  </Grid>
                  <Grid item xs={8}>
                    <p>End: {dayjs(vacation.vacation.endedAt).format("LL")}</p>
                  </Grid>
                </Grid>
              </div>
              <div className="py-2">
                <div className="flex items-center">
                  <TourTwoToneIcon
                    fontSize="large"
                    className="mr-2"
                    sx={{ color: green[500] }}
                  />
                  <p>Recent milestones:</p>
                </div>
                {vacation.vacation.milestones.length > 0 ? (
                  <div className="pl-11">
                    {vacation.vacation.milestones.map((milestones) => (
                      <Accordion key={milestones._id}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography>
                            {dayjs(milestones.time).format("LL")}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{milestones.desc}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    {/* {!vacation.vacation.milestones && <p>There're no milestone have been created</p>} */}
                  </div>
                ) : (
                  <p className="pl-11 text-slate-400">
                    There're no milestones have been created
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t py-2 mt-4">
            <Grid
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
            >
              <Grid item>
                <Tooltip title="React">
                  <FavoriteIcon className="mr-1" color="warning" />
                  {vacation.vacation.likes&&vacation.vacation.likes.total}
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Comment">
                  <ChatBubbleIcon className="mr-1" color="primary" />
                  {vacation.vacation.totalComment}
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="View">
                  <EqualizerOutlinedIcon
                    className="mr-1"
                    sx={{ color: green[500] }}
                  />
                  {vacation.vacation.views}
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          variant="contained"
          className="w-full !rounded-t-none !rounded-lg"
        >
          Details
        </Button>
      </div>
    </>
  );
}

export default VacationFeeds;
