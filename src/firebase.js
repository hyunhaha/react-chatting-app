import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
var firebaseConfig = {
  apiKey: "AIzaSyBhrHJLGb_yBTttGRCRtkRszWPLGB8UwEk",
  authDomain: "chatting-app-381b1.firebaseapp.com",
  projectId: "chatting-app-381b1",
  storageBucket: "chatting-app-381b1.appspot.com",
  messagingSenderId: "452624205649",
  appId: "1:452624205649:web:f8315ad9a460a73b67b570",
  measurementId: "G-RXEY0R7S3Y"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();