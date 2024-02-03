import React, { useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { useSelector } from "react-redux";
import tichxanh from "../../img/tichxanh.png";
import EditProfileModal from "./EditProfiles";
import dayjs from "dayjs";
import Item from "./Item";

const Profiles = () => {
  const user = useSelector((state) => state.users);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => navigate("/");

  const handleOpenProfileModel = () => {
    console.log("openprofile");
    setIsEditProfileOpen(true);
  };

  const handleCloseProfileModel = () => {
    setIsEditProfileOpen(false);
  };

  const handleFollowUser = () => {
    console.log("followuser");
    setIsEditProfileOpen(false);
  };

  return (
    <div className="w-[643px] h-full px-3 overflow-y-auto scroll-smooth">
      <section className='z-50 w-[630px] px-3 flex items-center fixed top-0 bg-white bg-opacity-90 border-b'>
        <KeyboardBackspaceIcon
          className="cursor-pointer"
          onClick={() => history.back()}
          />
        <h1 className="py-3 text-xl font-bold opacity-80 ml-5">{user.user.fullName}</h1>
      </section>

      <section className="mt-14">
        <img
          className="w-[100%] h-[15rem] object-cover"
          src={`https://res.cloudinary.com/dmonbjexk/image/upload/f_auto,q_auto/${user.user.cover}`}
          alt=""
        ></img>
      </section>

      <section className="px-6 border border-b-0">
        <div className="flex justify-between items-start mt-5 h-[5rem]">
          <Avatar
            className="transform -translate-y-24"
            alt=""
            src={`https://res.cloudinary.com/dmonbjexk/image/upload/f_auto,q_auto/${user.user.avatar}`}
            sx={{ width: "10rem", height: "10rem", border: "4px solid white" }}
          />
          {true ? (
            <Button
              onClick={handleOpenProfileModel}
              variant="contained"
              sx={{ borderRadius: "20px" }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              onClick={handleFollowUser}
              variant="contained"
              sx={{ borderRadius: "20px" }}
            >
              {true ? "Follow" : "UnFollow"}
            </Button>
          )}
          {isEditProfileOpen && (
            <EditProfileModal
              open={isEditProfileOpen}
              handleClose={handleCloseProfileModel}
              user={user}
            />
          )}
        </div>
        <div>
          <div className="flex items-center">
            <h1 className="font-bold text-lg"> {user.user.fullName}</h1>
            {true && <img className="ml-2 w-5 h-5" src={tichxanh} alt="" />}
          </div>
          <h1 className="text-gray-500">@ {user.user.userName}</h1>
        </div>
        <div className="mt-2 space-y-3">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            vitae justo nec leo malesuada cursus.
          </p>
          <div className="py-1 flex space-x-5">
            <div className="flex items-center text-gray-500">
              <CalendarMonthIcon />
              <p className="ml-2">
                Date of Birth: {dayjs(user.user.dateOfBirth).format("LL")}{" "}
              </p>
            </div>
            <div className="flex items-center text-gray-500">
              <p className="ml-2"> Age: {user.user.age} </p>
            </div>
            <div className="flex items-center text-gray-500">
              <TransgenderIcon />
              <p className="ml-2"> Gender: {user.user.gender} </p>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-1 font-semibold">
              <span>0</span>
              <span className="text-gray-500">Following</span>
            </div>
            <div className="flex items-center space-x-1 font-semibold">
              <span>0</span>
              <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </section>
      <section className=" py-5 border border-y-0">
        <Item/>
      </section>
    </div>
  );
};

export default Profiles;
