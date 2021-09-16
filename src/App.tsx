import "./App.css";
import firebase from "./firebase";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DataGrid from "./components/table/DataGrid";
import Map from "./components/map/Map";
import Home from "./components/home";
import About from "./components/about";
// import { Populator } from "./assets/database_populater_script";
// import { db } from "./firebase";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      background: "#bdbdbd",
      minHeight: "40px",
    },
  })
);

const App = () => {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setLoggedIn(!!user);
      });

    return () => unregisterAuthObserver();
  }, []);

  const displayThis = () => {
    return (
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
                <Map />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/detail">
                <DataGrid area="Brisbane" />
              </Route>
            </Switch>
          </div>
          <div className={classes.footer}>
          </div>
        </Router>
      </div>
    );
  };

  return (
    <>
      {/* For determining if logged in or not in banner */}
      <Login loggedIn={loggedIn} />
      {/* Displays the rest of the page */}
      <div className="App">{displayThis()}</div>
    </>
  );
};

export default App;
