import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useParams } from "react-router-dom";
import { changepass } from "../services/User";
import { useDispatch } from "react-redux";
import { changepassSuccess } from "../redux/slice/user.slice";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const dispatch = useDispatch();
  const userID = useParams();
  
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        password: data.get("oldpassword"),
        password: data.get("newpassword"),
      });
      const user = await changepass(
        data.get("oldpassword"),
        data.get("newpassword"),
        userID.id
      );
      console.log(user.data);
      dispatch(changepassSuccess(user.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Pass
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldpassword"
              label="Code"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newpassword"
              label="New Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
