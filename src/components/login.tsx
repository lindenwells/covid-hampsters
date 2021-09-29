import firebase, { authUiConfig } from "../firebase";
import { Button, Grid, TextField, InputAdornment } from "@material-ui/core";
import { StyledFirebaseAuth } from "react-firebaseui";
import { AccountCircle, LockRounded } from "@material-ui/icons";
type loginProps = {
  loggedIn: boolean;
};

// TODO: Feel free to play around with the style and make it look nice :)
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
          <Button onClick={() => firebase?.auth()?.signOut()}>Sign-out</Button>
          {/* </header> */}
        </div>
      </Grid>
    );
  } else {
    return (
      <div className="App">
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, minWidth: 300 }}>
          <Grid container item alignItems="center" direction="column">
            {/* <header className="App-header"> */}
            <p>You're logged out</p>
            <p>Sign In</p>
            <TextField color="primary" label="Username" margin="normal" InputProps={{ startAdornment: <InputAdornment position="start"><AccountCircle /></InputAdornment> }} />
            <TextField color="primary" label="Password" type="password" margin="normal" InputProps={{ startAdornment: <InputAdornment position="start"><LockRounded /></InputAdornment> }} />
            <div style={{ height: 20 }} />
            <Button variant="contained">
              Log In
            </Button>
            <div style={{ height: 20 }} />
            <Button variant="contained">Sign Up</Button>
            <StyledFirebaseAuth
              uiConfig={authUiConfig}
              firebaseAuth={firebase.auth()}
            ></StyledFirebaseAuth>
            {/* </header> */}
          </Grid>
        </div>
      </div>
    );
  }
};

export default Login;
