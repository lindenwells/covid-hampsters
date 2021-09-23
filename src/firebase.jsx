import firebase from "firebase"
import "firebase/auth"
import "firebase/firestore"

{/*
const firebaseConfig = {
  apiKey: "AIzaSyDHq8-xs7yCPBu5gch6brUl1E9BldwyPvw",
  authDomain: "covid-hampster.firebaseapp.com",
  projectId: "covid-hampster",
  storageBucket: "covid-hampster.appspot.com",
  messagingSenderId: "715564925085",
  appId: "1:715564925085:web:23648d8d71528991869474",
  measurementId: "G-9X7QBS8CX1",
};

export const authUiConfig = {
    signInFlow: "popup",
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false,
    }
}

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore()*/}




// Import the functions you need from the SDKs you need

//import { initializeApp } from "firebase/app";

//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCgGMbnKW2QFOGRQz98C_IEgO3AnmvT3Kk",
  authDomain: "covidhampsters.firebaseapp.com",
  projectId: "covidhampsters",
  storageBucket: "covidhampsters.appspot.com",
  messagingSenderId: "939878005298",
  appId: "1:939878005298:web:53c6d05b8925d71e201a2b",
  measurementId: "G-QQEMBJ98EF"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();

/** Google users login function */
const googleProvider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/** Sign in with Email and password. */
const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/** Register with email and password. */
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await auth.createUserWithEmailAndPassword(email, password);
    const user = res.user;
    await db.collection("users").add({
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/** Reset password and email. */
const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/** Logout */
const logout = () => {
  auth.signOut();
}

export {
  auth,
  db,
  signInWithEmailAndPassword,
  signInWithGoogle,
  registerWithEmailAndPassword,
  sendPasswordResetEmail,
  logout,
};