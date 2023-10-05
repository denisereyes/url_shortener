import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//added below imports 
import { BrowserRouter } from "react-router-dom";
import {initializeApp} from "firebase/app"; 

//copied from firebase 
const firebaseConfig = {
  apiKey: "AIzaSyBX_1_-nFTdeKo5xP9WMLpbj4FdcrITpLo",
  authDomain: "url-shortener-faee4.firebaseapp.com",
  projectId: "url-shortener-faee4",
  storageBucket: "url-shortener-faee4.appspot.com",
  messagingSenderId: "837118592512",
  appId: "1:837118592512:web:defa1c6d45c4e831c5fae5",
  measurementId: "G-P28YESTN8G"
};

//initializing 
initializeApp(firebaseConfig);

//changed to browser router 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
