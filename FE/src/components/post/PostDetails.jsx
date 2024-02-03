import {
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import { orange } from "@mui/material/colors";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import KeyboardBackspace from "@mui/icons-material/KeyboardBackspace";
import { createComment, fetchPostDetail, toggleLike } from "../../redux/slice/postSlice";
import relativeTime from "dayjs/plugin/relativeTime";
import MediaDisplay from "../feeds/MediaDisplay";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import { CLOUDINARY_URL } from "../../config";

const Post = ({ postDetail, user }) => {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(
    postDetail.likes.uId.includes(user.user._id)
  );
  const [usable, setUsable] = useState(true);
  const [number, setNumber] = useState(0);
  const [comment,setComment] = useState();
  dayjs.extend(relativeTime);

  const handleToggleLike = () => {
    const postId = postDetail._id;
    const userId = { userId: user.user._id };
    dispatch(toggleLike({ postId, ...userId }));
    setIsLiked(!isLiked);
    setUsable(false);
  };
  const handleCreateComment = ()=>{
    const postId = postDetail._id;
    const data = {userId:user.user._id,comment:comment}
    dispatch(createComment({postId,...data}))
  }

  useEffect(() => {
    if (isLiked === true) {
      setNumber(1);
    } else {
      setNumber(0);
    }
  }, [isLiked]);

  return (
    <>
      <div className="w-[643px] px-3 pt-16 h-full flex-col justify-start items-start inline-flex overflow-y-auto scroll-smooth border mr-6">
        <section className="z-50 w-[629px] flex items-center fixed top-0 bg-white bg-opacity-90 border-b">
          <KeyboardBackspace
            className="cursor-pointer"
            onClick={() => history.back()}
          />
          <h1 className="py-3 text-xl font-bold opacity-80 ml-5">Post</h1>
        </section>
        <div className="w-full mb-3 pb-17 flex flex-col justify-center items-center self-center"></div>
        <div className="w-full p-5">
          <div className="flex gap-x-2 mb-3 items-center">
            <Avatar src={`${CLOUDINARY_URL}/${postDetail.postBy.avatar}`} />
            <div className="flex w-full justify-between">
              <div className="flex flex-col gap-x-2">
                {postDetail.postBy && (
                  <h1 className="font-bold">{postDetail.postBy.fullName}</h1>
                )}
                {postDetail.postBy && (
                  <h3 className="text-slate-500">
                    @{postDetail.postBy.userName}
                  </h3>
                )}{" "}
              </div>
              <p className="text-slate-500">
                &#x2022; posted {dayjs(postDetail.createdAt).fromNow()}
              </p>
            </div>
          </div>
          <p>{postDetail.content}</p>
          {postDetail.images && (
            <MediaDisplay src={postDetail.images} postId={postDetail._id} />
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
                  <h1>{postDetail.likes && postDetail.likes.total}</h1>
                ) : (
                  <h1>{postDetail.likes.total + number}</h1>
                )}
              </Grid>
              <Grid
                className="flex justify-center items-center gap-x-2"
                item
                xs={8}
              >
                <IconButton size="large">
                  <ModeCommentOutlinedIcon />
                </IconButton>
                {postDetail.comments && <h1>{postDetail.comments.length}</h1>}{" "}
              </Grid>
            </Grid>
          </div>
          <div className="flex flex-col">
            <div>
              {postDetail.comments &&
                postDetail.comments.map((comment) => (
                  <div className="flex gap-x-3 mb-2" key={comment._id}>
                    <Avatar src={`${CLOUDINARY_URL}/${comment.userId.avatar}`}/>
                    <div className="bg-slate-100 p-3 rounded-2xl">
                    <div className="flex gap-x-2">
                      <h1 className="font-bold">{comment.userId.fullName}</h1>
                      <h1 className=" text-slate-400">
                        @{comment.userId.userName}
                      </h1>
                    </div>
                    <p>{comment.comment}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex gap-x-4 mt-4 items-center">
              <Avatar src={`${CLOUDINARY_URL}/${user?.user.avatar}`} />
              <TextField
                className="w-full"
                autoFocus={true}
                InputProps={{
                  style: {
                    borderRadius: "12px",
                  },
                  endAdornment: (
                    <InputAdornment onClick={handleCreateComment} className="cursor-pointer" position="end">
                      <SendIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                multiline
                label="Write a comment..."
                value={comment}
                onChange={(e)=>{setComment(e.target.value)}}
                onSubmit={handleCreateComment}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PostDetails = (id) => {
  const dispatch = useDispatch();
  const { postDetail, loading, error } = useSelector((state) => state.post);
  const user = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchPostDetail(id.id));
  }, [dispatch, id]);

  if (loading === "loading") {
    return (
      <div className="w-[643px] h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (loading === "failed") {
    return <p>Error loading post detail: {error}</p>;
  }

  return postDetail.likes && <Post postDetail={postDetail} user={user} />;
};

export default PostDetails;
