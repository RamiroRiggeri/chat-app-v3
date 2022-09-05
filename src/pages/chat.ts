import { state } from "../state";

type Message = {
  from: string;
  message: string;
};

class Chat extends HTMLElement {
  connectedCallback() {
    state.subscribe(() => {
      const currState = state.getState();
      this.roomId = currState.roomId;
      if (currState.messages !== undefined) {
        this.messages = currState.messages;
        this.render();
      }
    });
    this.render();
  }
  addListeners() {
    const form = this.querySelector(".submit-message");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      state.pushMessage(target[0].value);
    });
  }
  roomId: string;
  messages: Message[] = [];
  render() {
    const currState = state.getState();

    this.innerHTML = `
  <div class="columns is-mobile">
    <div class="column"></div>
    <div class="column is-two-thirds">
        <div class="container">
          <h1 class="title is-3">Chat Page</h1>
          <h4 class="roomid">Room ID es ${currState.roomId}</h1>
          </div>
          </div>
          <div class="column"></div>
          </div>
          
          
          <div class="columns is-mobile">
          <div class="column"></div>
            <div class="column is-11">
              <div class="content">
                <div class="subt">Mensajes</div>
                <div class="containerrr">
                  <div class="messages">
                    ${this.messages
                      .map((msg) => {
                        if (msg.from !== undefined) {
                          if (msg.from === currState.fullName) {
                            return `<div class="msg-container mens-mio">
                              <div class="messagefrom">${msg.from}</div>
                              <div class="messagecontent">${msg.message}</div>
                              </div>`;
                          } else if (msg.from !== currState.fullName) {
                            return `<div class="msg-container mens-suyo">
                              <div class="messagefrom">${msg.from}</div>
                              <div class="messagecontent">${msg.message}</div>
                              </div>`;
                          }
                        }
                      })
                      .join("")}
                  </div>
                </div>
              </div>
     <form class="submit-message">
         <input type="text" name="new-message" class="input" placeholder="Tu Mensaje">
         <button class="button is-success">Enviar</button>
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
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
    }
    .content{
      height: 50vh;
      width: 90%;
      overflow: hidden;
      padding: 0;
    }
    .submit-message{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      gap: 10px;
      width: 90%;
    }
    .containerrr{
      height: 40vh;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow: hidden;
    }
    .columns{
      margin-top: 10px;
    }
    .content{
      background-color: #164E63;
      padding: 20px;
      border-radius: 0.5em;
      border: 1px white solid;
    }
    .title, .subt, .roomid{
      text-align: center;
      color: #06B6D4;
    }
    .subt{
      margin-bottom: 20px;
    }
    .input{
      background-color: #155E75;
      color: white;
    }
    .input::placeholder {
      color: #A8A29E;
      opacity: 0.75;
    }
    .messages{
      overflow-y: scroll;
    }
    .messages, .msg-container{
      display: flex;
      flex-direction: column;
    }
    .messagefrom {
      background-color: rgba(56, 189, 248, 0.7);
      color: rgb(240, 249, 255);
      margin: 1.5em 0.5em 0 0.5em;
      text-align: center;
      border-radius: 0.5em;
      padding: 0.7em;
    }
    .messagecontent{
      background-color: transparent;
      color: white;
      margin: 0.3em 20px 20px 20px;
    }
    .mens-mio{
      align-self: flex-end;
    }
    .mens-suyo{
      align-self: flex-start;
    }
    `;
    this.appendChild(style);
    this.addListeners();
    var objDiv = this.querySelector(".messages");
    objDiv.scrollTop = objDiv.scrollHeight;
  }
}
customElements.define("chat-page", Chat);
