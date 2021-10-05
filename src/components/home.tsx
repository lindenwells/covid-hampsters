import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Home = () => (
    <>
        <h2></h2>
        <nav>
          <Button style={{margin: 10}} component={Link} to="/detail/Brisbane" variant="contained">
            View Data (Brisbane)
          </Button>
        </nav>
    </>
);

export default Home;
