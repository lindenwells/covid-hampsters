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

              <button onClick={() => alert("test")}>test</button>

              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route exact path="/">
                  <Home />
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
      {/* For determining if logged in or not in banner */}
      <Login loggedIn={loggedIn} />
      {/* Displays the rest of the page */}
      <div className="App">{displayThis()}</div>
    </>
  );
}

export default App;
