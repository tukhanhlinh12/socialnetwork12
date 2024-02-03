import {
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostDetail, toggleLike } from "../../redux/slice/postSlice";
import MediaDisplay from "./MediaDisplay";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { fetchVacationDetail } from "../../redux/slice/vacationSlice";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { CLOUDINARY_URL } from "../../config";


const Post = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users);
  const [isLiked, setIsLiked] = useState(
    props.post.likes.uId.includes(user.user._id)
  );
  const [usable, setUsable] = useState(true);
  const [number, setNumber] = useState(0);
  const navigate = useNavigate();
  dayjs.extend(relativeTime);

  const handleToggleLike = () => {
    const postId = props.post._id;
    const userId = { userId: user.user._id };
    dispatch(toggleLike({ postId, ...userId }));
    setIsLiked(!isLiked);
    setUsable(false);
  };

  useEffect(() => {
    if (isLiked === true) {
      setNumber(1);
    } else {
      setNumber(0);
    }
  }, [isLiked]);
  return (
    <>
      <div className="w-[570px] border rounded-xl p-5 hover:bg-slate-100">
        <div className="flex gap-x-2 mb-3 items-center">
          <Avatar src={`${CLOUDINARY_URL}/${props.post.postBy.avatar}`} />
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-x-2">
              {props.post.postBy && (
                <h1 className="font-bold">{props.post.postBy.fullName}</h1>
              )}
              {props.post.postBy && (
                <h3 className="text-slate-500">
                  @{props.post.postBy.userName}
                </h3>
              )}{" "}
            </div>
            <p className="text-slate-500">&#x2022; posted {dayjs(props.post.createdAt).fromNow()}</p>
          </div>
        </div>
        <p>{props.post.content}</p>
        {props.post.images && (
          <MediaDisplay src={props.post.images} postId={props.post._id} />
        )}
        <div className="p-2 border-t border-b m-3">
          <Grid container spacing={2} columns={16}>
            <Grid
              className="flex justify-center items-center gap-x-2"
              item
              xs={8}
            >
              <IconButton onClick={handleToggleLike} size="large">
                {isLiked ? (
                  <FavoriteIcon color="warning" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              {usable ? (
                <h1>{props.post.likes.total}</h1>
              ) : (
                <h1>{props.post.likes.total + number}</h1>
              )}
            </Grid>
            <Grid
              className="flex justify-center items-center gap-x-2"
              item
              xs={8}
            >
              <IconButton onClick={()=>navigate(`/post/${props.post._id}`)} size="large">
                <ModeCommentOutlinedIcon />
              </IconButton>
              {props.post.comments && <h1>{props.post.comments.length}</h1>}{" "}
            </Grid>
          </Grid>
        </div>
        <div className="flex flex-col">
          <Link onClick={()=>navigate(`/post/${props.post._id}`)} className="cursor-pointer">See comments</Link>
        </div>
      </div>
    </>
  );
};

export default Post;
