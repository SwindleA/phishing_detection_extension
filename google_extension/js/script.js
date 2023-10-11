import { Request } from "./request.js";
import { Button } from "./Button.js";

class App{

    constructor(){
        
        
        this.request = new Request();
        
        this.myButton = this.askGPT();
        
        const element = document.getElementById("myButton");

      }
      askGPT(){
        const button = new Button('#myButton', ()=>{
            console.log("Hela");
            this.request.post("Hello");
        });
        button.render();
    }

}

const MyApp = new App();