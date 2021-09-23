import firebase, { authUiConfig } from "../firebase";
import { Button } from "@material-ui/core";
import { StyledFirebaseAuth } from "react-firebaseui";

type loginProps = {
  loggedIn: boolean;
};

// TODO: Feel free to play around with the style and make it look nice :)
const Login = (props: loginProps) => {
  if (props.loggedIn) {
    return (
      <div className="App">
        {/* <header className="App-header"> */}
          <p>
            {" "}
            Welcome {firebase.auth()?.currentUser?.displayName}! You are now
            signed-in!
          </p>
          <Button onClick={() => firebase?.auth()?.signOut()}>Sign-out</Button>
        {/* </header> */}
      </div>
    );
  } else {
    return (
      <div className="App">
        {/* <header className="App-header"> */}
          <p>You're logged out</p>
          <StyledFirebaseAuth
            uiConfig={authUiConfig}
            firebaseAuth={firebase.auth()}
          ></StyledFirebaseAuth>
        {/* </header> */}
      </div>
    );
  }
};

export default Login;
