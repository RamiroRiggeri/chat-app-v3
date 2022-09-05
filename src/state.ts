import { firebaseConfig, app, rtdb } from "./firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import * as _ from "lodash";
const API_BASE_URL = process.env.PORT || "http://localhost:3099";

type Message = {
  from: string;
  message: string;
};

const state = {
  data: {
    email: "",
    fullName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    messages: [],
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("nuevo state", this.data);
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  init() {
    // const recoverStateFromLocalSt = JSON.parse(localStorage.getItem("state"));
    // this.setState(recoverStateFromLocalSt);
    // this.accessToRoom(() => {}, recoverStateFromLocalSt.roomId);
  },

  // funciones del proyecto
  setEmailAndFullname(email: string, fullName: string, callback?) {
    const cs = this.getState();
    cs.fullName = fullName;
    cs.email = email;

    const urlToFetch = "https://chat-app-v3.onrender.com/signup";

    fetch(urlToFetch, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: cs.email, nombre: cs.fullName }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.userId = data.id;
        this.setState(cs);
        callback();
      });
    this.setState(cs);
  },

  signIn(callback) {
    const urlToFetch = "https://chat-app-v3.onrender.com/auth";
    const cs = this.getState();
    if (cs.email) {
      fetch(urlToFetch, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: cs.email, nombre: cs.fullName }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      callback(true);
    }
  },

  askNewRoom(callback?) {
    const cs = this.getState();
    const urlToFetch = "https://chat-app-v3.onrender.com/rooms";

    if (cs.userId) {
      fetch(urlToFetch, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay user ID");
    }
  },

  accessToRoom(callback, userRoomId?) {
    const cs = this.getState();
    let roomId;
    if (!cs.roomId) {
      roomId = userRoomId;
      cs.roomId = userRoomId;
    } else if (cs.roomId) {
      roomId = cs.roomId;
    }
    const urlToFetch = "https://chat-app-v3.onrender.com/rooms/" + roomId + "?userId=" + cs.userId;

    console.log(urlToFetch);

    fetch(urlToFetch)
      .then((res) => {
        return res.json();
      })
      .catch((err) => alert(err))
      .then((data) => {
        cs.rtdbRoomId = data.rtdbshortRoomId;
        this.setState(cs);
        this.listenRoom();
        callback();
      });
  },

  listenRoom(callback?) {
    const cs = this.getState();
    const chatRoomRef = ref(rtdb, "/rooms/" + cs.rtdbRoomId);
    onValue(chatRoomRef, (snapshot) => {
      const cs = this.getState();
      const messagesFromServer = snapshot.val();
      const messagesList = _.map(messagesFromServer);
      cs.messages = messagesList;
      this.setState(cs);
    });
  },

  pushMessage(message: string) {
    const urlToFetch = "https://chat-app-v3.onrender.com/messages";

    const cs = this.getState();
    fetch(urlToFetch, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: cs.fullName,
        message: message,
        roomId: cs.rtdbRoomId,
      }),
    });
  },
};

export { state };
