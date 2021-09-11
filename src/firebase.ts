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

export const db = firebase.firestore()

export default firebase