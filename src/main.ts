import "./pages/home";
import "./pages/chat";
import "./router";
import { state } from "./state";
import { Router } from "@vaadin/router";

(function main() {
  const app = document.getElementById("app");
  console.log(process.env);

  // if (localStorage.getItem("state") !== null) {
  //   state.init();
  //   setTimeout(() => {
  //     Router.go("/chat");
  //   }, 1000);
  // }
})();
