import React, { useState } from "react";
import firebase, { authUiConfig } from "../firebase";
import { Button, Grid, TextField, InputAdornment, Input } from "@material-ui/core";
import { StyledFirebaseAuth } from "react-firebaseui";
import { AccountCircle, LockRounded } from "@material-ui/icons";

type loginProps = {
  loggedIn: boolean;
};

const Login = (props: loginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



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
            <TextField 
              color="primary"
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }}
            />

            <TextField 
              color="primary"
              label="Password" 
              type="password" 
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ startAdornment: 
              <InputAdornment position="start">
                <LockRounded />
              </InputAdornment>
              }}
            />

            <div style={{ height: 20 }} />
            <Button 
              variant="contained"
              onClick={() => {
                alert(email + ", " + password);
                }}>
              Log In
            </Button>
            <div style={{ height: 20 }} />

            <StyledFirebaseAuth
              uiConfig={authUiConfig}
              firebaseAuth={firebase.auth()}
            ></StyledFirebaseAuth>
            <Button variant="contained">Register</Button>
            {/* </header> */}
          </Grid>
        </div>
      </div>
    );
  }
};

export default Login;
