import { Router } from "@vaadin/router";
import { state } from "../state";

class Home extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = this.querySelector(".formulario");
    const selectEl = this.querySelector("#room-sel");
    const roomSelector = this.querySelector("#room-opt");
    const title = this.querySelector(".title");

    selectEl.addEventListener("change", (event) => {
      if ((event.target as any).value === "existing") {
        (roomSelector as any).style.display = "inherit";
      } else if ((event.target as any).value === "new" || "default") {
        (roomSelector as any).style.display = "none";
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const emailUser = target.email.value;
      const nombreUser = target.nombre.value;
      const dropdownUser = target.dropdown.value;
      const roomnumUser = target.roomnum.value;
      if (dropdownUser === "none") {
        window.alert("seleccioná Room nuevo o existente");
      } else {
        state.setEmailAndFullname(emailUser, nombreUser, (err) => {
          if (err) console.error("hubo un problema en el signup");
          state.signIn((err) => {
            if (err) {
              console.error("hubo un error en el Auth");
            }
            if (dropdownUser === "new") {
              state.askNewRoom(() => {
                state.accessToRoom((err) => {
                  if (err) console.error("hubo un error en el accessRoom");
                });
              });
            } else if (dropdownUser === "existing") {
              state.accessToRoom((err) => {
                if (err) console.error("hubo un error en el accessRoom");
              }, roomnumUser);
            }
          });
        });
        let count = 3;
        function countDown(div, count) {
          var int = setInterval(() => {
            div.innerHTML = `
            Ingresando al room en ${count}
            `;
            count--;
            if (count < 0) {
              clearInterval(int);
              setTimeout(() => {
                Router.go("/chat");
              }, 800);
            }
          }, 1000);
        }
        countDown(title, count);
      }
    });
  }
  render() {
    this.innerHTML = `
    
    <div class="columns">
    <div class="column"></div>
    <div class="column is-two-thirds">
      <div class="container">
        <h1 class="title is-1">Bienvenido</h1>
      </div>
    </div>
    <div class="column"></div>
  </div>
  
  <div class="columns">
    <div class="column"></div>
      <div class="column is-two-thirds">
      <form class="formulario">
        <div class="box">
          <div class="form">
            <div class="field">
              <label class="label">Nombre</label>
              <div class="control has-icons-left has-icons-right">
                <input class="input" type="text" placeholder="Tu nombre" name="nombre" required />
                <span class="icon is-small is-left">
                  <i class="fas fa-user-astronaut"></i>
                </span>
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control has-icons-left has-icons-right">
                <input class="input" type="email" placeholder="tunombre@ejemplo.com" name="email" required />
                <span class="icon is-small is-left">
                  <i class="fas fa-envelope"></i>
                </span>
              </div>
            </div>
  
            <div class="field">
              <label class="label">Room</label>
              <div class="control">
                <div class="select">
                  <select id="room-sel" name="dropdown" required>
                    <option value="none" selected="true" disabled="disabled">Seleccionar</option>
                    <option value="new">Nuevo Room</option>
                    <option value="existing">Room Existente</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field" id="room-opt">
              <label class="label">ID del Room</label>
              <div class="control">
                <input class="input" type="text" placeholder="1111" name="roomnum"/>
              </div>
            </div>
  
            <div class="field is-grouped">
              <div class="control">
                <button class="button is-success">Comenzar</button>
              </div>
            </div>
          </div>
        </div>
        </form>
      </div>
    <div class="column"></div>
  </div>
  
      `;
    const style = document.createElement("style");
    style.innerHTML = `
    :root{
      background-color: #1C1917
    }
    #room-opt{
      display: none;
    }
    .input::placeholder {
      color: #A8A29E;
      opacity: 0.75;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
    }
    .columns{
      margin-top: 10px;
    }
    .box{
      background-color: #164E63
    }
    .label, .input, #room-sel{
      color: white
    }
    .input, #room-sel{
      background-color: #155E75
    }
    .title{
      text-align: center;
      color: #06B6D4
    }
    .field{
      margin-top:1.5em;
      margin-bottom:1.5em;
    }
    @media (max-width: 769px) {
      .formulario{
        width: 70%;
        margin: 0 auto;
      }
    }
    `;
    this.appendChild(style);
  }
}
customElements.define("home-page", Home);
