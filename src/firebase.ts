require("dotenv").config();
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = JSON.parse(process.env.FIREBASE_FRONT);

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase();

export { firebaseConfig, app, rtdb };
