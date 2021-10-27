import { useState } from "react";
import firebase, { registerWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { Avatar, Button, Grid, TextField, InputAdornment, Typography, Link } from "@material-ui/core";
import { AccountCircleOutlined, LockOutlined, EmailOutlined } from "@material-ui/icons";
import { makeStyles, createStyles, Theme, ThemeProvider, createTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginBtns: {
      margin: theme.spacing(2),
      minWidth: 250
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
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
      >
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
          <Button className={classes.loginBtns} variant="contained" onClick={() => { sendPasswordResetEmail(email); }}>Send password reset email</Button>
          <Button className={classes.loginBtns} variant="contained" onClick={() => { setResetPass(false); }}>Back to login</Button>
        </ThemeProvider>
      </Grid>
    )
  } else if (registered) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ height: 400, maxWidth: 300 }}
      >
        <ThemeProvider theme={customTheme}>
          <Avatar style={{ margin: 1, backgroundColor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <form onSubmit={(e) => { e.preventDefault() }}> {/* Again this form allows submission on enter, div below needs styling */}
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
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
            <Button className={classes.loginBtns} variant="contained" type="submit" onClick={() => { registerWithEmailAndPassword(name, email, password); }}>Register</Button>
          </form>
          <Button className={classes.loginBtns} variant="contained" onClick={() => { setRegistered(false); }}>Back to login</Button>
        </ThemeProvider>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ height: 400, maxWidth: 300 }}
      >
        <Avatar style={{ margin: 1, backgroundColor: "secondary" }}>
          <LockOutlined />
        </Avatar>
        <ThemeProvider theme={customTheme}>
          <form onSubmit={(e) => { e.preventDefault() }}> {/* This form allows form submission on enter */}
            <div> {/* This div keeps things in one column */}
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
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
              onClick={(e) => {
                e.preventDefault();
                signInWithEmailAndPassword(email, password);
              }}
              className={classes.loginBtns}

            >
              Log In
            </Button>
          </form>

          <Button
            variant="contained"
            onClick={signInWithGoogle}
            className={classes.loginBtns}
          >
            Sign in with Google
          </Button>
          <Link color="primary" href="#" variant="body2" onClick={() => { setResetPass(true) }}>
            Forgot password?
          </Link>
          <Link color="primary" href="#" variant="body2" onClick={() => { setRegistered(true) }}>
            {"Don't have an account? Sign Up"}
          </Link>
        </ThemeProvider>
      </Grid>
    );
  }
}

const Login = (props: loginProps) => {
  if (props.loggedIn) {
    return (
      <Grid>
        <div className="App">
          <p>
            {" "}
            Welcome {firebase.auth()?.currentUser?.displayName}! You are now
            signed-in!
          </p>
          <Button onClick={() => firebase?.auth()?.signOut()}>Sign-out</Button>
        </div>
      </Grid>
    );
  } else {
    return (
      <div className="App">
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 300, minWidth: 300 }}>
          <Grid container item alignItems="center" direction="column">
            {IsRegister()}
          </Grid>
        </div>
      </div>
    );
  }
};

export default Login;
