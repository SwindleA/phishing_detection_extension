import { Request } from "./request.js";
import { Button } from "./Button.js";


class App{

    constructor(){
        
        
        this.request = new Request();

        this.myButton = this.askGPT();

        this.login = this.login();

        this.testgmail = this.testGmail();
        const element = document.getElementById("myButton");

    }
      askGPT(){
        const button = new Button('#myButton', ()=>{
            console.log("Hela");
            this.request.get("/test/GPT/Hello").then((response)=> {
                console.log(response)
            });
        });
        button.render();
      }


      login(){
        const button = new Button('#loginButton', ()=>{
            console.log("Login Button");
            chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
                console.log(token);

            });

        });
        button.render();

      }

      testGmail(){
          const button = new Button('#testGmail', ()=>{
              console.log("test gmail button");

              const url = "/test/gmailapi"
             /*chrome.identity.getAuthToken().then((token) => {
                 console.log(token);
                 this.request.post(url,token).then((response) =>{
                     console.log("response: ", response);
                 })

             });*/



              chrome.identity.getAuthToken({interactive: true}, function(token) {

                  console.log("auth token: ", token);

                  // the example below shows how to use a retrieved access token with an appropriate scope
                  // to call the Google People API contactGroups.get endpoint


                  chrome.identity.getProfileUserInfo(function(accounts){
                      console.log("accuont id: ",accounts.id);

                      fetch(
                          'https://gmail.googleapis.com/gmail/v1/users/'+accounts.id+'/labels?key=[APIKEY]',
                          {headers: new Headers({
                                  'Authorization': 'Bearer '+token,
                                  'Accept': 'application/json','content-type': 'application/json'}),
                                compressed : true,} )
                          .then((response)=> {
                              console.log(response.json())
                          });


                  });




              });
              
          });
          button.render();
      }



}

const MyApp = new App();