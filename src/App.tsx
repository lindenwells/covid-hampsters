import "./App.css";
import firebase from "./firebase";
import React, { useEffect, useState } from "react";
import { Button, Tab, Tabs, Typography, Popover } from "@material-ui/core";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import DataGrid from "./components/table/DataGrid";
import Map from "./components/map/Map";
import About from "./components/about";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import icon from "./COVID-19_Hampsters_2.png";

/*
 * Describes our general app structure.
 * Primary colour palette inspired from:
 *
 * REFERENCE:
 * Golo. "Banking App Dashboard Dark." dribbble.
 * https://dribbble.com/shots/14671619-Banking-App-Dashboard-Dark (accessed Sep. 12, 2021).
 */

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
    bar: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      background: "#1E1D2B",
      boxShadow: "inset 0 -2px 0 0 #252736",
    },
    tabs: {
      background: "#1E1D2B",
      color: "#ffffff",
      indicatorColor: "#0177FB",
      boxShadow: "inset 0 -2px 0 0 #252736",
      width: "100%",
    },
    tabsIndicatorColor: {
      backgroundColor: "#0177FB",
    },
    tabsFlexContainer: {
      alignContent: "center",
    },
    tabButtonsAlign: {
      height: "100%",
      marginRight: "20px",
      background: "#1E1D2B",
      boxShadow: "inset 0 -2px 0 0 #252736",
    },
    login: {
      padding: theme.spacing(2),
      minWidth: "200px",
      backgroundColor: "#252736",
      color: "#ffffff",
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
            <div className={classes.bar}>
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
                <Link
                  to="/"
                  onClick={() => {
                    setSelectedTab(0);
                  }}
                >
                  <img src={icon} className={classes.icon} alt="bedlam" />
                </Link>
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
              </Tabs>
              <div className={classes.tabButtonsAlign}>
                <LoginPopover />
              </div>
            </div>
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
          <div className="footer">Team '); DROP_TABLE Students</div>
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
