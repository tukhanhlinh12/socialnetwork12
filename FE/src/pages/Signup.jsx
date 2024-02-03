import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/xjourney.png";
import { Link } from "react-router-dom";
import { register } from "../services/User";
import { useDispatch } from "react-redux";
import { registerSuccess } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

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

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = React.useState(false);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setShowAlert(false);
      const data = new FormData(event.currentTarget);
      // console.log({
      //   fullName: data.get("fullName"),
      //   email: data.get("email"),
      //   userName: data.get("userName"),
      //   password: data.get("password"),
      // });
      const user = await register(
        data.get("fullName"),
        data.get("email"),
        data.get("userName"),
        data.get("password")
      );
      // console.log(user.data);
      const token = user.data.token;

      if (token) {
        dispatch(registerSuccess(user.data));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user.data));
        navigate("/", { replace: true });
      } else {
        setShowAlert(true);
      }
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
          <img src={logo} className="logo" />
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  autoComplete="fullName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="userName"
                  autoComplete="userName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                />
              </Grid>
            </Grid>
            {showAlert && (
                <Alert variant="filled" severity="error" sx={{
                position: "fixed",
                bottom: theme => theme.spacing(2),
                left: theme => theme.spacing(2),
                backgroundColor: theme => theme.palette.error.main,
                color: theme => theme.palette.error.contrastText,
                padding: theme => theme.spacing(1),
                borderRadius: theme => theme.shape.borderRadius,
              }}>
                  Email or UserName have been used
                </Alert>
              )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/sign-in" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
