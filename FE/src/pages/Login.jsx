import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../assets/xjourney.png";
import { Link } from "react-router-dom";
import { login } from "../services/User";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slice/user.slice";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Loading from "./Loading";

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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = React.useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setShowAlert(false);
      setLoading(true);
      const data = new FormData(event.currentTarget);
      // console.log({
      //   email: data.get("email"),
      //   password: data.get("password"),
      // });
      const user = await login(data.get("email"), data.get("password"));
      // console.log(user.data);
      const { token } = user.data;

      if (token) {
        const { password, ...userWithoutPassword } = user.data.data;
        dispatch(loginSuccess(userWithoutPassword));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        navigate("/", { replace: true });
      } else {
        setShowAlert(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute w-7/12 ml-4 top-1/4 text-white font-extrabold text-8xl drop-shadow-[0_35px_35px_rgba(0,0,0,2)] font-mono">
            Share your trip to everyone!
          </div>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={logo} className="logo" />
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              {/* <LockOutlinedIcon /> */}
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {showAlert && (
                <Alert
                  variant="filled"
                  severity="error"
                  sx={{
                    position: "fixed",
                    bottom: (theme) => theme.spacing(2),
                    left: (theme) => theme.spacing(2),
                    backgroundColor: (theme) => theme.palette.error.main,
                    color: (theme) => theme.palette.error.contrastText,
                    padding: (theme) => theme.spacing(1),
                    borderRadius: (theme) => theme.shape.borderRadius,
                  }}
                >
                  Email or Password not found
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              {loading && <Loading />}
              <Grid container>
                <Grid item xs>
                  <Link to="/forgetpass" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/sign-up" style={{ color: "blue" }} variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
