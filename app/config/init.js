import * as firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyA6RBx6TX2MgYAVw7MI5uWpxTyRWAP7pAM",
  authDomain: "chatfly-e6f78.firebaseapp.com",
  databaseURL: "https://chatfly-e6f78.firebaseio.com",
  projectId: "chatfly-e6f78",
  storageBucket: "chatfly-e6f78.appspot.com",
  messagingSenderId: "945040868670",
  appId: "1:945040868670:web:ea05f92a833d77ebdf186f",
};
// Initialize Firebase

export default !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
