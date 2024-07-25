// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLnbHhZdLXnVewJs_Dxe5EcMI5Oy8jCUg",
  authDomain: "first-effc6.firebaseapp.com",
  projectId: "first-effc6",
  storageBucket: "first-effc6.appspot.com",
  messagingSenderId: "413104793552",
  appId: "1:413104793552:web:1f59297ab250e49c267bd5",
  measurementId: "G-KX18SV64N5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app)
export const auth = getAuth();
export default app;