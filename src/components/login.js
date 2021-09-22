import firebase from "../firebase";
import { Button } from "@material-ui/core";
import { StyledFirebaseAuth } from "react-firebaseui";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.css"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const history = useHistory();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return (
      <div>
          <h1>Loading...</h1>
      </div>);
    }
    {/*if (user) history.replace("/");*/}
    if (user) {
      return (<div><h1>Hello, already login</h1></div>);
    }
  }, [user, loading]);
  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;

{/*
type loginProps = {
  loggedIn: boolean;
};
const Login = (props: loginProps) => {
  if (props.loggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {" "}
            Welcome {firebase.auth()?.currentUser?.displayName}! You are now
            signed-in!
          </p>
          <Button onClick={() => firebase?.auth()?.signOut()}>Sign-out</Button>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <p>You're logged out</p>
          <StyledFirebaseAuth
            uiConfig={authUiConfig}
            firebaseAuth={firebase.auth()}
          ></StyledFirebaseAuth>
        </header>
      </div>
    );
  }
};*/}