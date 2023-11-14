import { Request } from "./request.js";
import { Button } from "./Button.js";

const API_KEY = ''
class App{

    constructor(){
        
        
        this.requestor = new Request();

        this.myButton = this.askGPT();

        this.login = this.login();

        this.testgmail = this.testGmail();
        const element = document.getElementById("myButton");

    }
      askGPT(){
        const button = new Button('#myButton', ()=>{
            console.log("Hela");
            this.requestor.get("/test/GPT/Hello").then((response)=> {
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



              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                  const tab = tabs[0];

                  function printTitle() {
                      //console.log("inside printTitle func");
                      const title = document.title;
                      const resultStr = document.querySelector('[data-message-id]').getAttribute('data-legacy-message-id');
                      console.log(resultStr);



                      return resultStr;
                  };

                  chrome.scripting.executeScript({
                      target: { tabId: tab.id },
                      func: printTitle,
                      }).then((rep) => {

                      const message_id = rep[0]['result'];
                      console.log("message_id: ", message_id)

                     chrome.identity.getAuthToken({interactive: true}, function(token) {

                          console.log("auth token: ", token);

                          chrome.identity.getProfileUserInfo(function(accounts){
                              console.log("accuont id: ",accounts.id);
                              console.log("url: "+'https://gmail.googleapis.com/gmail/v1/users/'+accounts.id+'/messages/'+message_id+'?key='+API_KEY)
                              fetch(
                                  'https://gmail.googleapis.com/gmail/v1/users/'+accounts.id+'/messages/'+message_id+'?key='+API_KEY,
                                  {headers: new Headers({
                                          'Authorization': 'Bearer '+token,
                                          'Accept': 'application/json','content-type': 'application/json'}),
                                      compressed : true,} )
                                  .then((response)=> {
                                      response.json().then((element) => {

                                          const email_message = element.snippet;
                                          console.log(email_message);
                                          const payload = "Is this a phishing email? \n\n"+email_message;
                                          console.log(payload);

                                          const url = "/test/gmailapi";


                                          fetch("http://127.0.0.1:5000/" + url, {
                                              method: 'POST',
                                              headers: new Headers({'content-type': 'application/json'}),
                                              mode: 'cors',
                                              body: JSON.stringify(payload),
                                          }).then((response) =>{
                                              response.json().then((element)=>{
                                                  console.log(element.message);
                                              })
                                          });

                                      });

                                  });


                          });

                      });


                  });
              });



          });
          button.render();
      }



}

const MyApp = new App();