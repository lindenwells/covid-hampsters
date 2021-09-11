import "./App.css";
import firebase, { authUiConfig } from "./firebase";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DataGrid from "./components/table/DataGrid";
import Home from "./components/home";
import About from "./components/about";

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

  function displayThis() {
    return (
      <>
        <div>
          <Router>
            <nav className="headerMenu">
              <li>
                <Button component={Link} to="/" variant="contained">
                  Home
                </Button>
              </li>
              <li>
                <Button component={Link} to="/about" variant="contained">
                  About
                </Button>
              </li>
              <li>
                <Button component={Link} to="/login" variant="contained">
                  Login
                </Button>
              </li> 
            </nav>

            <div>
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/login">
                  <Login loggedIn={loggedIn} />
                </Route>
                <Route path="/detail">
                  <DataGrid area="Brisbane" />
                </Route>
              </Switch>
            </div>
        </Router>
        </div>
      </>
    );
  }

  /* can also write this:
    function Home() {
      return <h2>I'm home baby</h2>;
    }
    It does the same thing, but apparently 
    using const etc. is best practice :shrug:
  */

  return (
    <>
      {/* Displays the rest of the page */}
      <div className="App">{displayThis()}</div>
    </>
  );
}

export default App;
