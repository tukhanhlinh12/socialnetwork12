import {
  Avatar,
  AvatarGroup,
  CircularProgress,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AVATAR_URL, CLOUDINARY_URL } from "../../config";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { orange } from "@mui/material/colors";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import { v4 as uuidv4 } from "uuid";
import Test from "../feeds/Test";
import { useDispatch, useSelector } from "react-redux";
import { fetchVacationDetail } from "../../redux/slice/vacationSlice";
import dayjs from "dayjs";
import Post from "../feeds/Post";
import KeyboardBackspace from "@mui/icons-material/KeyboardBackspace";

function Vacation(id) {
  const dispatch = useDispatch();
  const [vacationDetail, setVacationDetail] = useState(null);

  useEffect(() => {
    dispatch(fetchVacationDetail(id.id))
      .then((response) => {
        setVacationDetail(response.payload);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, id]);

  console.log(vacationDetail)

  if (!vacationDetail) {
    return (
      <div className="w-[643px] h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  const getModules = () => {
    return vacationDetail.milestones.map((milestone) => {
      return (
        <TimelineItem key={milestone._id}>
          <TimelineSeparator>
            <TimelineDot color="success" />
            <TimelineConnector sx={{ bgcolor: "success.main" }} />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "1px", px: 2 }}>
            <Typography
              className="flex"
              color="success.main"
              variant="h6"
              component="span"
            >
              {dayjs(milestone.time).format("LL")} &#x2022;
              <p className="text-slate-500 ml-1 ">{milestone.desc}</p>
            </Typography>
            <ul>
              {milestone.posts.map((post) => {
                return (
                  <li className="list-none mt-3" key={uuidv4()}>
                    <Post post={post} />
                  </li>
                );
              })}
            </ul>
          </TimelineContent>
        </TimelineItem>
      );
    });
  };
  return (
    <>
      <div className="w-[643px] px-3 pt-16 h-full flex-col justify-start items-start inline-flex overflow-y-auto scroll-smooth">
        <section className="z-50 w-[630px] px-3 flex items-center fixed top-0 bg-white bg-opacity-90 border-b">
          <KeyboardBackspace
            className="cursor-pointer"
            onClick={() => history.back()}
          />
          <h1 className="py-3 text-xl font-bold opacity-80 ml-5">Vacation</h1>
        </section>
        <div className="w-full border-b mb-3 pb-17 flex flex-col justify-center items-center self-center">
          <div className="flex gap-x-4">
            <div className="">
              <Avatar
                src={`${CLOUDINARY_URL}/${vacationDetail?.createdBy.avatar}`}
                sx={{ width: 60, height: 60 }}
              ></Avatar>
              <p className="font-bold">{vacationDetail.createdBy.fullName}</p>
            </div>
            <div className="flex flex-col">

            <h1 className="f font-bold text-2xl text-blue">
              {vacationDetail.title}
            </h1>
            <p>{vacationDetail.desc}</p>
            </div>
          </div>

          <div className="flex items-center">
            <PeopleIcon fontSize="large" color="primary" />
            <p className="mx-2">{vacationDetail.participants.length} members</p>
            <AvatarGroup max={10} className="justify-self-end">
              {vacationDetail.participants.map((user) => (
                <Tooltip title={`${user.fullName}`} key={user._id}>
                  <Avatar src={`${CLOUDINARY_URL}/${user.avatar}`} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </div>
          <div className="flex items-center w-full">
            <CalendarMonthOutlinedIcon
              fontSize="large"
              className="mr-2"
              sx={{ color: orange[500] }}
            />
            <Grid container spacing={2} columns={16}>
              <Grid item xs={8}>
                <p>Start: {dayjs(vacationDetail.startedAt).format("LL")}</p>
              </Grid>
              <Grid item xs={8}>
                <p>End: {dayjs(vacationDetail.endedAt).format("LL")}</p>
              </Grid>
            </Grid>
          </div>
        </div>
        <Timeline
          className="w-full"
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {getModules()}
        </Timeline>
      </div>
    </>
  );
}

export default Vacation;
