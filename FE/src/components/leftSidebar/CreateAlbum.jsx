import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Add, AddAPhoto, Close, Delete, Remove } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
    cols: 2,
  },
];

export default function CreateAlbum() {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = useState("public");
  const { users, status, error } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [vacation, setVacation] = useState();
  const [title, setTitle] = useState();
  const [userVacations, setUserVacations] = useState([]);
  const [openSelectImage, setOpenSelectImage] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  const handleImagesChange = (value) => {
    const updatedItems = selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];

    setSelectedItems(updatedItems);
  };

  const handleOpenSelectImage = () => {
    setOpenSelectImage(true);
  };
  const handleCloseSelectImage = () => {
    setOpenSelectImage(false);
  };
  const user = useSelector((state) => state.users);
  const handleChange = (event) => {
    setVacation(event.target.value);
  };

  useEffect(() => {
    const data = { vacationId: "65be1c4818b7e4337894d760" };
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}vacation/get/all-post`,
          data,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setAllPosts(response.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAllPosts();
  },[vacation]);

  useEffect(() => {
    const userId = user.user._id;
    const fetchUserVacations = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}vacation/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setUserVacations(response.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserVacations();
  });
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  if (status === "loading") {
    return (
      <div className="w-full flex justify-center items-center">
        <CircularProgress color="inherit" className="flex justify-center" />
      </div>
    );
  }
  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  console.log(allPosts);

  return (
    <>
      <Button
        className="!w-full !bg-green-500 !rounded-full !text-white"
        onClick={handleOpen}
      >
        Create an album
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          className=" !border-none !rounded-lg !w-[600px]"
          sx={{ ...style, width: 400 }}
        >
          <h2 id="parent-modal-title">Create an album</h2>
          <select
            className="w-fit rounded-full border border-solid text-blue-400 px-2 border-blue-400"
            id="privacyOptions"
            value={selectedOption}
            onChange={handleOptionChange}
            defaultValue={"public"}
          >
            <option value={"public"}>Everyone</option>
            <option value={"onlyMe"}>Only Me</option>
            <option value={"onlyUserChoose"}>Custom</option>
          </select>
          {selectedOption === "onlyUserChoose" && (
            <Autocomplete
              className="my-3 !z-0"
              multiple
              size="small"
              limitTags={2}
              id="multiple-limit-tags"
              onChange={(event, value) => setAllowedUsers(value)}
              options={users}
              getOptionLabel={(option) => option.userName}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Custom privacy list"
                  placeholder="Username"
                  className="!z-0"
                />
              )}
            />
          )}
          {selectedFile && (
            <div className="w-full flex justify-end">
              <IconButton onClick={() => setSelectedFile(null)}>
                <Close />
              </IconButton>
            </div>
          )}
          <div className="bg-slate-200 w-full mt-3 h-60">
            <input id="media" type="file" onChange={onSelectFile} hidden />
            {selectedFile && <img className="w-full h-60" src={preview} />}
            {!selectedFile && (
              <label
                className="flex justify-center items-center h-60"
                htmlFor="media"
                alt="Media"
              >
                <IconButton aria-label="upload" size="large" component="span">
                  <AddAPhoto fontSize="inherit" />
                </IconButton>
              </label>
            )}
          </div>
          <TextField
            className="!mt-5 w-full"
            label="Title"
            multiline
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Box className="my-5" sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Vacation</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userVacations}
                label="Vacation"
                onChange={handleChange}
              >
                {userVacations&&userVacations.map((vacation) => (
                  <MenuItem value={vacation._id}>
                    {vacation.title}
                    <p className="w-full flex justify-end text-slate-400">
                      created at {dayjs(vacation.createdAt).format("LL")}
                    </p>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {vacation && (
            <Button onClick={handleOpenSelectImage}>Select images</Button>
          )}
          <Modal
            open={openSelectImage}
            onClose={handleCloseSelectImage}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box
              className=" !border-none !rounded-lg !w-[600px]"
              sx={{ ...style, width: 200 }}
            >
              <h1 id="child-modal-title" className="mb-5">
                Select images
              </h1>
              <ImageList className="w-full h-[600px]">
                {itemData.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item.img}?w=248&fit=crop&auto=format`}
                      alt={item.title}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={item.title}
                      subtitle={item.author}
                      actionIcon={
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255)" }}
                          aria-label={`info about ${item.title}`}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                inputProps={{ "aria-label": "controlled" }}
                                icon={<Add color="primary" />}
                                checkedIcon={<Remove color="warning" />}
                                value={item.img}
                                checked={selectedItems.includes(item.img)}
                                onChange={() => handleImagesChange}
                              />
                            }
                          />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
              <Button onClick={handleCloseSelectImage}>Next</Button>
            </Box>
          </Modal>
        </Box>
      </Modal>
    </>
  );
}
