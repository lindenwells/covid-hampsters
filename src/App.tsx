import "./App.css";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase, { authUiConfig } from "./firebase";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setLoggedIn(!!user);
      });

    return () => unregisterAuthObserver();
  }, []);

  if (loggedIn) {
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
          <p>Youre logged out</p>
          <StyledFirebaseAuth
            uiConfig={authUiConfig}
            firebaseAuth={firebase.auth()}
          ></StyledFirebaseAuth>
        </header>
      </div>
    );
  }
}

export default App;
