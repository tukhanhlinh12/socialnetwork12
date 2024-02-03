import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { fetchUserVacations } from "../../redux/slice/vacationSlice";
import { useEffect } from "react";
import VacationFeeds from "../feeds/VacationFeeds";
import { CircularProgress } from "@mui/material";

const Item = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.users);
  const [tabValue, setTabValue] = useState("1");
  const userVacations = useSelector((state) => state.vacation.userVacations);
  const status = useSelector((state) => state.vacation.status);

  useEffect(() => {
    const userId = user.user._id
    dispatch(fetchUserVacations(userId));
  },[dispatch,user.user._id]);

  if (status === 'loading') {
    return       <div className="w-[643px] h-screen flex justify-center items-center">
    <CircularProgress />
  </div>;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 3) {
      console.log("likes");
    } else if (newValue === 1) {
      console.log("posts");
    }
  };

  console.log(userVacations)

  return (
    <>
      <Box className="w-full" sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              <Tab className="w-4/12" label="Vaction" value="1" />
              <Tab className="w-4/12" label="Albums" value="2" />
              <Tab className="w-4/12" label="Likes" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <div className="w-full mt-3 h-full overflow-y-auto scroll-smooth">
            {userVacations &&
            userVacations.map((vacation) => (
              <VacationFeeds key={vacation._id} vacation={vacation} />
            ))}
            </div>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default Item;
