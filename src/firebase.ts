require("dotenv").config();
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = JSON.parse(process.env.FIREBASE_FRONT);
// const firebaseConfig = {
//   apiKey: "AIzaSyAqmHOSDIcXwLFxGdnxVfnMqwq_3Kq0Ft4",
//   authDomain: "apx-dwf-m6-firebase-db003.firebaseapp.com",
//   databaseURL: "https://apx-dwf-m6-firebase-db003-default-rtdb.firebaseio.com",
//   projectId: "apx-dwf-m6-firebase-db003",
//   storageBucket: "apx-dwf-m6-firebase-db003.appspot.com",
//   messagingSenderId: "77871511541",
//   appId: "1:77871511541:web:62e40d1f09309c5c8a52bc",
//   measurementId: "G-ZTJMCGE0KM",
// };

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase();

export { firebaseConfig, app, rtdb };
