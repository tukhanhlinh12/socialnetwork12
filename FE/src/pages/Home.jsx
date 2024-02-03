import React, { useState } from "react";
import LeftSidebar from "../components/leftSidebar/LeftSidebar";
import NewsFeed from "../components/feeds/NewsFeed";
import RightSidebar from "../components/rightSidebar/RightSidebar";
import { useNavigate, Navigate } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import AlbumFeed from "../components/album/AlbumFeed";

function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!token) {

    console.log(token);
    return <Navigate to = "/sign-in"></Navigate>;
  }

  console.log(value)
  

  return (
    <>
      <div className="flex content-center justify-center">
        <LeftSidebar value={value} />
        <div>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs
            sx={{ width: "100%" }}
            value={value}
            onChange={handleChange}
            centered
          >
            <Tab sx={{ width: "100%" }} label="Vacation" />
            <Tab sx={{ width: "100%" }} label="Album" />
          </Tabs>
        </Box>
        {value===0&&(<NewsFeed />)}
        {value===1&&(<AlbumFeed />)}
        </div>
        <RightSidebar value={value} />
      </div>
    </>
  );
}

export default Home;
