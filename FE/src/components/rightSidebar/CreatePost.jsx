import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PostForm from '../feeds/PostForm';
import { useEffect } from 'react';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreatePost(prop) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [vacation, setVacation] = React.useState()
  const fetchData = async (id) => {
    try {
      const response = await axios.get(`${process.env.API_URL}vacation/detail/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };
  useEffect(() => {
    const id = prop.vacationId;
    fetchData(id)
      .then(data => setVacation(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Button  variant="contained" onClick={handleOpen}>Create post</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className=" !border-none !rounded-lg !w-[600px]">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create a new post
          </Typography>
            <PostForm vacation={vacation}/>
        </Box>
      </Modal>
    </div>
  );
}