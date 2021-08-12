import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from 'firebase/app';

// Add the Firebase products that you want to use
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHq8-xs7yCPBu5gch6brUl1E9BldwyPvw",
  authDomain: "covid-hampster.firebaseapp.com",
  projectId: "covid-hampster",
  storageBucket: "covid-hampster.appspot.com",
  messagingSenderId: "715564925085",
  appId: "1:715564925085:web:23648d8d71528991869474",
  measurementId: "G-9X7QBS8CX1"
};

const firebaseApp = initializeApp(firebaseConfig);


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
