import "./App.css";
import firebase, { authUiConfig } from "./firebase";
import React, { SetStateAction, useEffect, useState } from "react";
import { AppBar, Button, Tab, Tabs, Toolbar, IconButton, Grid, Typography, Popover } from "@material-ui/core";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import DataGrid from "./components/table/DataGrid";
import Map from "./components/map/Map";
import Home from "./components/home";
import About from "./components/about";
import MenuIcon from '@material-ui/icons/Menu';
// import { Populator } from "./assets/database_populater_script";
// import { db } from "./firebase";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    tabs: {
      background: "#1E1D2B",
      color: "#ffffff",
      indicatorColor: "#0177FB",
      boxShadow: "inset 0 -2px 0 0 #252736",
    },
    tabsIndicatorColor: {
      backgroundColor: "#0177FB",
    },
    login: {
      padding: theme.spacing(2),
    },
  })
);

const App = () => {
  const classes = useStyles();
  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setLoggedIn(!!user);
      });

    return () => unregisterAuthObserver();
  }, []);

  const LoginPopover = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
      <div>
        <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
          Login
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          >
            <Typography className={classes.login}>
              {/* TODO: need to figure out a better way then copy pasting
                  this Router pattern every time we want a link */}
              <Router>
                <Link to="/login" variant="contained">
                  Login
                </Link>
                <Switch>
                  <Route path="/login">
                    <Login loggedIn={loggedIn} />
                  </Route>
                </Switch>
              </Router>
            </Typography>
        </Popover>
      </div>
    )
  }

  const displayThis = () => {
    return (
      <div className="box">
        <Router>
          <div className="header">
            <AppBar position="sticky">
              <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  COVID Hampsters
                </Typography>
                <LoginPopover />
              </Toolbar>
            </AppBar>
            <Tabs classes={{root: classes.tabs, indicator: classes.tabsIndicatorColor}} value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Home" component={Link} to="/" variant="contained" />
              <Tab label="About" component={Link} to="/about" variant="contained" />
              {/* <Tab label="Login" component={Link} to="/login" variant="contained" /> */}
            </Tabs>
          </div>
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Map />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              {/* <Route path="/login">
                <Login loggedIn={loggedIn} />
              </Route> */}
              <Route path="/detail/:area">
                <DataGrid />
              </Route>
            </Switch>
          </div>
          <div className="footer">
            Team '); DROP_TABLE
          </div>
        </Router>
      </div>
    );
  };

  return (
    <>
      {/* Displays the rest of the page */}
      <div className="App">{displayThis()}</div>
    </>
  );
};

export default App;
