import React, { useEffect, useCallback, useRef, useState } from "react";
import Post from "./Post";
import Test from "./Test";
import PostForm from "./PostForm";
import VacationFeeds from "./VacationFeeds";
import { useSelector, useDispatch } from "react-redux";
import { fetchVacations } from "../../redux/slice/vacationSlice";
import { createVacation } from "../../redux/slice/vacationSlice";
import { Alert, Box, CircularProgress, Snackbar, Tab, Tabs } from "@mui/material";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
function NewsFeed() {
  const dispatch = useDispatch();
  const vacations = useSelector((state) => state.vacation.vacations);
  const inProgressVacations = useSelector((state) => state.vacation);
  const status = useSelector((state) => state.vacation.status);
  const error = useSelector((state) => state.vacation.error);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [openAlert, setOpenAlert] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem("token");
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };
  const fetchData = async (__page) => {
    const response = await axios.get(
      `${
        process.env.API_URL
      }vacation/get-all-vacations?pageSize=${4}&pageIndex=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setItems([...items, ...response.data.data]);
    setPage(page + 1);
    if (response.data.data.length === 0) {
      setHasMore(false);
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTimeout(()=>{
      fetchData(1);
    },3000)
  }, [inProgressVacations]);

  if (status === "loading") {
    return (
      <div className="flex justify-center w-[600px] mt-10">
        <CircularProgress className="flex justify-center" />
      </div>
    );
  }
  return (
    <>
      <div className="w-[643px] mt-3 h-full px-3 justify-start items-start inline-flex overflow-y-auto scroll-smooth">
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="info"
            variant="filled"
            sx={{ width: "100%", zIndex: 100000 }}
          >
            You have finished reading the newsfeed!
          </Alert>
        </Snackbar>
        <InfiniteScroll
          className="!w-full"
          style={{ margin: "10px" }}
          pageStart={0}
          loadMore={fetchData}
          hasMore={hasMore}
          loader={
            <div className="loader flex justify-center !w-full mt-6" key={0}>
              <CircularProgress className="flex justify-center" />
            </div>
          }
        >
          {vacations &&
            items.map((vacation) => (
              <VacationFeeds key={vacation._id} vacation={vacation} />
            ))}
        </InfiniteScroll>
      </div>
    </>
  );
}

export default NewsFeed;
