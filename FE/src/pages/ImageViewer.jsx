import React, { useEffect, useState } from "react";
import { CLOUDINARY_URL } from "../config";
import {
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
  Link,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import CloseIcon from "@mui/icons-material/Close";

function PostDetails() {
  return (
    <>
      <div className="w-full h-screen flex">
        <div className="bg-black w-9/12 flex justify-center items-center relative">
          <img
            className="w-auto h-auto "
            src={`${CLOUDINARY_URL}/1706177607720-iamge.png`}
            alt=""
          />
          <IconButton
            onClick={() => history.back()}
            type="submit"
            className="!absolute z-10 top-0 left-0"
          >
            <CloseIcon style={{ color: "white" }} />
          </IconButton>
        </div>
        <div className="w-3/12 h-screen p-3 overflow-hidden">
          <div className="flex gap-x-2 mb-3 items-center">
            <Avatar src="" sx={{ width: 50, height: 50 }} />
            <div className="flex flex-col">
              <h1 className="font-bold">asdasd</h1>
              <h3 className="text-slate-400">@asdasdasd</h3>
            </div>
          </div>
          <p>desc</p>
          <p className="text-slate-400">&#x2022; adasdasdasd &#x2022;</p>
          <div className="p-0.5 border-t border-b m-3">
            <Grid container spacing={2} columns={16}>
              <Grid
                className="flex justify-center items-center gap-x-2"
                item
                xs={8}
              >
                <IconButton size="large">
                  <FavoriteBorderIcon />
                </IconButton>
                <h1>123</h1>
              </Grid>
              <Grid
                className="flex justify-center items-center gap-x-2"
                item
                xs={8}
              >
                <IconButton size="large">
                  <ModeCommentOutlinedIcon />
                </IconButton>
                <h1>123</h1>
              </Grid>
            </Grid>
          </div>
          <div className="h-full overflow-y-auto">hi</div>
          <div className="sticky flex gap-x-4 mt-2 bottom-2 w-full">
            <Avatar src="" />
            <TextField
              className="w-full"
              InputProps={{
                style: {
                  borderRadius: "12px",
                },
              }}
              multiline
              label="Write a comment..."
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PostDetails;
