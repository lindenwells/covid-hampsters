import "./App.css";
import firebase, { authUiConfig } from "./firebase";
import React, { SetStateAction, useEffect, useState } from "react";
import { AppBar, Button, Toolbar, IconButton, Menu, Grid, Typography, Popover } from "@material-ui/core";
import Login from "./components/login";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router-dom';
import DataGrid from "./components/table/DataGrid";
import Home from "./components/home";
import About from "./components/about";
import { makeStyles } from '@material-ui/core/styles';

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

  const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));

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
          Popover
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
            <Typography className={classes.typography}>Many popover muc h wow !11!!!</Typography>
        </Popover>
      </div>
    )
  }

  const MenuBar = () => {
    return (
      <AppBar position="static">
        <Toolbar>
          <Grid container justifyContent="flex-end">
            <Grid item>
              {/* <Typography align="left">
                Title
              </Typography> */}
              <Button color="inherit">Login</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }

  const displayThis = () => {
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
      <MenuBar/>
      {LoginPopover()}
      {/* Displays the rest of the page */}
      <div className="App">{displayThis()}</div>
    </>
  );
}

export default App;
