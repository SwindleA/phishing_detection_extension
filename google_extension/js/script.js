import { Request } from "./request.js";
import { Button } from "./Button.js";

class App{

    constructor(){
        
        
        this.request = new Request();
        
        this.loginBtn = this.askGPT();
        
        const element = document.getElementById("loginBtn");

      }
      askGPT(){
        const login = new Button('#myButton', ()=>{
            console.log("Hela");
            this.request.post("Hello");
        });
        login.render();
    }

}

const MyApp = new App();