import React, { useState } from "react";
import firebase, { registerWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { Button, Grid, TextField, InputAdornment, Input, Link } from "@material-ui/core";
import { AccountCircleOutlined, LockOutlined, EmailOutlined, Lock} from "@material-ui/icons";
import { makeStyles, createStyles, Theme, ThemeProvider, createTheme } from "@material-ui/core/styles";
import { palette } from "@mui/system";
// import Register from "./register";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginBtns: {
      // TODO: Feel free to play around with the login buttons styling
      margin: theme.spacing(2),
    },
  }),
);

const customTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

type loginProps = {
  loggedIn: boolean;
};

const IsRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registered, setRegistered] = useState(false);
  const [resetPass, setResetPass] = useState(false);
  const classes = useStyles();

  if (resetPass) {
    return (
      <ThemeProvider theme={customTheme}>
        <TextField
          color="primary"
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <EmailOutlined />
            </InputAdornment>
          }}
        />
        <Button style={{ width: 250 }} className={classes.loginBtns} variant="contained" onClick={() => { sendPasswordResetEmail(email); }}>Send password reset email</Button>
        <Button style={{ width: 250 }} className={classes.loginBtns} variant="contained" onClick={() => { setResetPass(false); }}>Back to login</Button>
      </ThemeProvider>
    )
  } else if (registered) {
    return (
      <ThemeProvider theme={customTheme}>
        <form onSubmit={(e) => { e.preventDefault() }}> {/* Again this form allows submission on enter, div below needs styling */}
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300 }}>
            Register
            <TextField
              color="primary"
              label="Name"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <AccountCircleOutlined />
                </InputAdornment>
              }}
            />
            <TextField
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <EmailOutlined />
                </InputAdornment>
              }}
            />
            <TextField
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
              }}
            />
            <Button style={{ width: 250 }} className={classes.loginBtns} variant="contained" type="submit" onClick={() => { registerWithEmailAndPassword(name, email, password); }}>Register</Button>
          </div>
        </form>
        <Button style={{ width: 250 }} className={classes.loginBtns} variant="contained" onClick={() => { setRegistered(false); }}>Back to login</Button>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={customTheme}>
        <p>You're logged out</p>

        <form onSubmit={(e) => { e.preventDefault() }}> {/* This form allows form submission on enter */}
          <div> {/* This div keeps things in one column */}
            {/* TODO: This div makes login too wide, not sure how to fix */}
            <h2>Sign In</h2>
            <TextField
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{

                startAdornment: <InputAdornment position="start">
                  <EmailOutlined />
                </InputAdornment>
              }}
            />

            <TextField
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment:
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
              }}
            />
          </div>
          <Button
            variant="contained"
            type="submit"
            // replace onClick func with email/pass firebase stuff
            onClick={(e) =>
            (e.preventDefault,
              signInWithEmailAndPassword(email, password))}
            className={classes.loginBtns}
            style={{ width: 250 }}
          >
            Log In
          </Button>
        </form>

        <Button
          variant="contained"
          onClick={signInWithGoogle}
          className={classes.loginBtns}
          style={{ width: 250 }}>
          Sign in with Google
        </Button>
        <Link color="primary" href="#" variant="body2" onClick={() => { setResetPass(true) }}>
          Forgot password?
        </Link>
        <Link color="primary" href="#" variant="body2" onClick={() => { setRegistered(true) }}>
          {"Don't have an account? Sign Up"}
        </Link>
      </ThemeProvider>
    );
  }
}

const Login = (props: loginProps) => {
  if (props.loggedIn) {
    return (
      <Grid>
        <div className="App">
          {/* <header className="App-header"> */}
          <p>
            {" "}
            Welcome {firebase.auth()?.currentUser?.displayName}! You are now
            signed-in!
          </p>
          <Button style={{ width: 250 }} onClick={() => firebase?.auth()?.signOut()}>Sign-out</Button>
          {/* </header> */}
        </div>
      </Grid>
    );
  } else {
    return (
      <div className="App">
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300 }}>
          <Grid container item alignItems="center" direction="column">
            {IsRegister()}
          </Grid>
        </div>
      </div>
    );
  }
};

export default Login;
