import * as express from "express";
import { firestore, firebase } from "./db";
import { v4 as uuidv4 } from "uuid";
import * as cors from "cors";
const app = express();
const port = process.env.PORT || 3099;
app.use(express.json());
app.use(cors());
const userCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

app.post("/signup", (req, res) => {
  console.log("llegó al signup");

  const email = req.body.email;
  const nombre = req.body.nombre;
  userCollection
    .where("email", "==", email)
    .get()
    .then((queryResp) => {
      if (queryResp.empty) {
        userCollection.add({ email, nombre }).then((newUserRef) => {
          res.json({ id: newUserRef.id, new: true });
        });
      } else {
        res.status(202).json({
          id: queryResp.docs[0].id,
          message: "Usuario ya existente",
        });
      }
    });
});

app.post("/auth", (request, response) => {
  console.log("llegó al auth");

  const { email } = request.body;
  userCollection
    .where("email", "==", email)
    .get()
    .then((queryResp) => {
      if (queryResp.empty) {
        response.status(404).json({ message: "User Not found - Auth Failed" });
      } else {
        response.json({
          id: queryResp.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  userCollection
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = firebase.ref("/rooms/" + uuidv4());
        roomRef.set({ messages: [], owner: userId }).then(() => {
          const roomLongId = roomRef.key;
          const shortRoomId = 1000 + Math.floor(Math.random() * 999);
          const shortRoomIdStr = shortRoomId.toString();
          roomCollection
            .doc(shortRoomIdStr)
            .set({
              rtdbshortRoomId: roomLongId,
            })
            .then(() => {
              res.json({ id: shortRoomIdStr });
            });
        });
      } else {
        res.status(401).json({
          message: "Unauthorized, Usuario no existe o no está autentificado",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  userCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomCollection
          .doc(roomId.toString())
          .get()
          .then((docSnap) => {
            const data = docSnap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "Unauthorized, Usuario no existe o no está autentificado",
        });
      }
    });
});

app.post("/messages", function (req, res) {
  const chatroomRef = firebase.ref("/rooms/" + req.body.roomId);
  chatroomRef.push(
    {
      from: req.body.from,
      message: req.body.message,
    },
    () => {
      res.json("ok");
    }
  );
});

app.get("/env", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
  });
});

app.use(express.static("dist"));
//sirve para servir una carpeta entera, entonces Express sabe que si
//se pide un archivo real de esa carpeta lo sirve

app.get("*", (req, res) => {
  console.log("entró por el catchall");
  res.sendFile(__dirname + "/dist/index.html");
});
//esto lo que hace es darle un catch all, una red que si entra algún
//request a una ruta que no exista, se lo redirija a la home

app.listen(port, () => {
  console.log(`escuchando puerto ${port}`);
});
