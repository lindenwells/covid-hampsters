import React from 'react';
import "./App.css";
import firebase from "./firebase";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import Login from "./components/login";
import Register from "./components/register";
import Reset from "./components/reset";
import UserPage from './components/userPage';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DataGrid from "./components/table/DataGrid";
import Map from "./components/map/Map";
import Home from "./components/home";
import About from "./components/about";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import { Populator } from "./assets/database_populater_script";
// import { db } from "./firebase";
import { makeStyles, createStyles, Theme, } from "@material-ui/core/styles";

/*
const useStyles = makeStyles((theme) =>
  createStyles({
    footer: {
      background: "#bdbdbd",
      minHeight: "40px",
    },
  })
);*/

const App = () => {
  //var classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  /** 
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setLoggedIn(!!user);
      });

    return () => unregisterAuthObserver();
  }, []); */

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

  const classes = useStyles();

  const displayThis = () => {
    return (
      <div>
        <div className={classes.root}>
          <AppBar position="sticky">
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                COVID Hampsters
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </div>
        <Router>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Home" component={Link} to="/" variant="contained" />
            <Tab label="About" component={Link} to="/about" variant="contained" />
            <Tab label="Login" component={Link} to="/login" variant="contained" />
          </Tabs>
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
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/reset">
                <Reset />
              </Route>
              <Route path='/userpage'>
                <UserPage />
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
      {/*<Login loggedIn={loggedIn} />*/}
      {/* Displays the rest of the page */}
      <div className="App">{displayThis()}</div>
    </>
  );
};

export default App;
