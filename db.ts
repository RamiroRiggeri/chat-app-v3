import * as admin from "firebase-admin";
require("dotenv").config();
const serviceAccount = JSON.parse(process.env.FIREBASE);
console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://apx-dwf-m6-firebase-db003-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
//base de datos NoSQL

const firebase = admin.database();
//base de datos Realtime

export { firestore, firebase };
