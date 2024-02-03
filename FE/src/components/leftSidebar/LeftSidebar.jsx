import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from "@mui/icons-material/Message";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import logo from "../.././assets/xjourney.png";
import CreateJourney from "./CreateJourney";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loginSuccess, registerSuccess } from "../../redux/slice/user.slice";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import { CLOUDINARY_URL } from "../../config";
import CreateAlbum from "./CreateAlbum";

function LeftSidebar(props) {
  const user = useSelector((state) => state.users);
  // console.log(user);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(loginSuccess(JSON.parse(savedUser)));
      dispatch(registerSuccess(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleClose();
    window.location.href = "/sign-in";
  };

  return (
    <div>
      <div className="w-[275px] h-screen px-3 flex-col justify-start items-start inline-flex top-0 sticky">
        <div className="self-stretch h-14 py-[3px] flex-col justify-start items-start gap-2.5 flex my-6">
          <Link to="/">
            <img src={logo} className="logo"></img>
          </Link>
          <div className="w-[50px] h-[50px] flex-col justify-center items-center gap-2.5 flex" />
        </div>
        <div className="self-stretch h-[602px] flex-col justify-start items-start gap-[38px] flex">
          <div className="px-3 flex-col justify-start items-start gap-8 flex">
            <Link to="/">
              <div className="self-stretch h-[50px] justify-start items-center gap-5 inline-flex cursor-pointer py-2  hover:bg-slate-100 hover:rounded-full hover:p-2">
                <div className="w-[26px] h-[26px] relative">
                  {/* <div className="w-[7px] h-[7px] left-[17px] top-[-1px] absolute bg-sky-500 rounded-full" /> */}
                  <HomeRoundedIcon />
                </div>
                <div className="w-[55px] text-neutral-900 text-xl font-normal leading-normal">
                  Home
                </div>
              </div>
            </Link>
            <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer py-2 hover:bg-slate-100 hover:rounded-full hover:p-2">
              <div className="w-[26px] h-[26px] relative">
                <SearchIcon />
              </div>
              <div className="w-[68px] text-neutral-900 text-xl font-normal leading-normal">
                Explore
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer  py-2 hover:bg-slate-100 hover:rounded-full hover:p-2">
              <div className="w-[26px] h-[26px] relative">
                <NotificationsIcon />
              </div>
              <div className="w-[119px] text-neutral-900 text-xl font-normal leading-normal">
                Notifications
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer py-2 hover:bg-slate-100 hover:rounded-full hover:p-2">
              <div className="w-[26px] h-[26px] relative">
                <MessageIcon />
              </div>
              <div className="w-[92px] text-neutral-900 text-xl font-normal leading-normal">
                Messages
              </div>
            </div>
            <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer py-2 hover:bg-slate-100 hover:rounded-full hover:p-2">
              <div className="w-[26px] h-[26px] relative">
                <BookmarkIcon />
              </div>
              <div className="w-[104px] text-neutral-900 text-xl font-normal leading-normal">
                Bookmarks
              </div>
            </div>
            {/* <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer">
              <div className="w-[26px] h-[26px] relative" />
              <div className="w-[43px] text-neutral-900 text-xl font-normal leading-normal">
                Lists
              </div>
            </div> */}
            <Link to={`/profile/${user.user._id}`}>
              <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer py-2 hover:bg-slate-100 hover:rounded-full hover:p-2">
                <div className="w-[26px] h-[26px] relative">
                  <PersonIcon />
                </div>
                <div className="w-[59px] text-neutral-900 text-xl font-normal leading-normal">
                  Profile
                </div>
              </div>
            </Link>
            <div className="self-stretch justify-start items-center gap-5 inline-flex cursor-pointer py-2 hover:bg-slate-100 hover:rounded-full hover:p-2">
              <div className="w-[26px] h-[26px] relative">
                <MoreHorizIcon />
              </div>
              <div className="w-[47px] text-neutral-900 text-xl font-normal leading-normal">
                More
              </div>
            </div>
          </div>
          {props.value !== 1 ? <CreateJourney /> : <CreateAlbum />}
        </div>
        <div className="self-stretch grow shrink basis-0 justify-start items-end gap-[29px] inline-flex">
          <div className="grow shrink basis-0 h-[90px] py-6 justify-start items-center gap-4 flex">
            <div className="w-10 h-10 rounded-[500px] justify-center items-center flex">
              <div className="w-10 h-10 justify-center items-center inline-flex">
                <Avatar
                  src={`${process.env.CLOUDINARY_URL}/${user.user.avatar}`}
                />
              </div>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-0.5 inline-flex">
              <div className="self-stretch text-neutral-900 text-[15px] font-bold leading-tight">
                {user.user.fullName}
              </div>
              <div className="self-stretch text-slate-600 text-[15px] font-normal leading-tight">
                @{user.user.userName}
              </div>
            </div>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreHorizIcon className="w-10 h-10 justify-center items" />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
