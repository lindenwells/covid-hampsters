import "./App.css";
import firebase, { authUiConfig } from "./firebase";
import React, { SetStateAction, useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  IconButton,
  Grid,
  Typography,
  Popover,
  Box,
} from "@material-ui/core";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import DataGrid from "./components/table/DataGrid";
import Map from "./components/map/Map";
import Home from "./components/home";
import About from "./components/about";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { StyledFirebaseAuth } from "react-firebaseui";
import icon from "./COVID-19_Hampsters_2.png";

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
    tabsFlexContainer: {
      alignContent: "center",
    },
    tabButtonsAlign: {
      marginTop: "auto",
      marginBottom: "auto",
      marginLeft: "auto",
      marginRight: "20px",
    },
    login: {
      // TODO: Feel free to play around with the login button styling
      padding: theme.spacing(2),
      minWidth: "200px",
    },
    icon: {
      maxHeight: "50px",
      minWidth: "50px",
      marginLeft: "30px",
      marginRight: "30px",
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

  type loginProps = {
    loggedIn: boolean;
  };

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
    const id = open ? "simple-popover" : undefined;

    return (
      <React.Fragment>
        <Button
          aria-describedby={id}
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Login
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography className={classes.login}>
            <Login loggedIn={loggedIn} />
          </Typography>
        </Popover>
      </React.Fragment>
    );
  };

  const displayThis = () => {
    return (
      <div className="box">
        <Router>
          <div className="header">
            <Tabs
              classes={{
                root: classes.tabs,
                indicator: classes.tabsIndicatorColor,
                flexContainer: classes.tabsFlexContainer,
              }}
              value={selectedTab}
              onChange={handleChange}
              aria-label="tabs"
            >
              <img src={icon} className={classes.icon} alt="bedlam" />
              <Tab
                value={0}
                label="Home"
                component={Link}
                to="/"
                variant="contained"
              />
              <Tab
                value={1}
                label="About"
                component={Link}
                to="/about"
                variant="contained"
              />
              <div className={classes.tabButtonsAlign}>
                <LoginPopover />
              </div>
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
              <Route path="/detail/:area">
                <DataGrid />
              </Route>
            </Switch>
          </div>
          <div className="footer">Team '); DROP_TABLE</div>
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
