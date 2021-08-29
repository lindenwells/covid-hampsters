import "./App.css";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase, { authUiConfig } from "./firebase";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import DataGrid from "./DataGrid";

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

  function isLoggedIn() {
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
            <p>You're logged out</p>
            <StyledFirebaseAuth
              uiConfig={authUiConfig}
              firebaseAuth={firebase.auth()}
            ></StyledFirebaseAuth>
          </header>
        </div>
      );
    }
  }

  function displayThis() {
    return (
      <>
        <h4>Routing example</h4>
        <div>
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Button component={Link} to="/detail" variant="contained">
                      Area Link (From Map)
                    </Button>
                  </li>
                </ul>
              </nav>

              <button onClick={test}>
                test
              </button>
  
              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/detail">
                  <DataGrid area="Brisbane"/>
                </Route>
              </Switch>
            </div>
          </Router>

        </div>
      </>
    )
  }

  const Home = () => (
    <h2>I'm home baby</h2>
  )
  const About = () => (
    <h2>About</h2>
  )
  const test = () => (
    alert('yeet')
  )
  /* can also write this:
    function Home() {
      return <h2>I'm home baby</h2>;
    }
    It does the same thing, but apparently 
    using const etc. is best practice :shrug:
  */

  const logdIn = isLoggedIn();
  return (
    <>
      {/* For determining if logged in or not in banner */}
      {logdIn}
      {/* Displays the rest of the page */}
      <div className="App">
        {displayThis()}
      </div>
    </>
  );
}

export default App;
