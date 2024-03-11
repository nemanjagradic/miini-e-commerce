import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCE5Bjfr8MtEjCn1c0h7ir7DLT8vDpkYZE",
  authDomain: "miini-e-commerce.firebaseapp.com",
  databaseURL:
    "https://miini-e-commerce-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "miini-e-commerce",
  storageBucket: "miini-e-commerce.appspot.com",
  messagingSenderId: "875418601194",
  appId: "1:875418601194:web:858076b30de19ffde3f993",
  measurementId: "G-F3C2FGHDY2",
};

const app = initializeApp(firebaseConfig);
