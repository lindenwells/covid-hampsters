import { Button } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Home = () => (
    <>
        <h2>Home [map todo]</h2>
        <nav>
          <Button style={{margin: 10}} component={Link} to="/detail" variant="contained">
            View Data
          </Button>
        </nav>
    </>
);

export default Home;