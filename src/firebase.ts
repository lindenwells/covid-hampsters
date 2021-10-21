import firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDHq8-xs7yCPBu5gch6brUl1E9BldwyPvw",
  authDomain: "covid-hampster.firebaseapp.com",
  projectId: "covid-hampster",
  storageBucket: "covid-hampster.appspot.com",
  messagingSenderId: "715564925085",
  appId: "1:715564925085:web:23648d8d71528991869474",
  measurementId: "G-9X7QBS8CX1",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const auth = app.auth();
const auth = firebase.auth();
const db = app.firestore();

/** Google users login function */
const googleProvider = new firebase.auth.GoogleAuthProvider();

const catchErr = (error: any) => {
    let errMsg = "";
    if (error instanceof Error) {
        errMsg = error.message;
    }
    console.error(error);
    alert(errMsg);
}

const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user!.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user!.uid,
        name: user!.displayName,
        authProvider: "google",
        email: user!.email,
      });
    }
  } catch (err) {
    catchErr(err);
  }
};

/** Sign in with Email and password. */
const signInWithEmailAndPassword = async (email: any, password: any) => {
  auth.signInWithEmailAndPassword(email, password).then(user => {
    // Sign in successful
  }).catch(err => {
    catchErr(err);
  })
};

/** Register with email and password. */
const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password)
    .then((res) => {
        return res.user?.updateProfile({
            displayName: name
        })
    });
  } catch (err) {
    catchErr(err);
  }
  
};

/** Reset password and email. */
const sendPasswordResetEmail = async (email: any) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    catchErr(err);
  }
};

/** Logout */
const logout = () => {
    auth.signOut().then(() => {
        // sign out successful
    }).catch((error: any) => {
        // error
        console.log(error);
    })
}

/** check authentication */
const checkAuth = () => {
  const email = auth.currentUser?.email;
  const emailExp1 = /^\w+([-+.]\w+)*@uqconnect.edu.au$/;
  const emailExp2 = /^\w+([-+.]\w+)*@student.uq.edu.au$/;
  const emailExp3 = /^\w+([-+.]\w+)*@uq.net.edu.au$/;
  const emailExp4 = /^\w+([-+.]\w+)*@qld.gov.au$/;
  const emailExp5 = /^\w+([-+.]\w+)*@www.qld.gov.au$/;
  let valid = null;
  if (email) {
    valid = emailExp1.test(email) || emailExp2.test(email) || emailExp3.test(email) || emailExp4.test(email) || emailExp5.test(email);
  }

  return valid;
}

export {
  auth,
  db,
  signInWithEmailAndPassword,
  signInWithGoogle,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
  checkAuth
};

// export const authUiConfig = {
//     signInFlow: "popup",
//     signInOptions: [
//         firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         firebase.auth.GoogleAuthProvider.PROVIDER_ID
//     ],
//     callbacks: {
//         signInSuccessWithAuthResult: () => false,
//     }
// }

// firebase.initializeApp(firebaseConfig);

// export const db = firebase.firestore()

export default firebase
