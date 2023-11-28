import { Request } from "./request.js";
import { Button } from "./Button.js";

const API_KEY = ''
class App{

    constructor(){
        
        
        this.requestor = new Request();

        //this.myButton = this.askGPT();

        this.login = this.login();

        this.evaluate_email = this.evaluateEmail();
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

      evaluateEmail(){
          const button = new Button('#evaluateEmail', ()=>{
              console.log("EvaluateButton");



              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                  const tab = tabs[0];

                  function getMessageId() {
                      //console.log("inside printTitle func");
                      const title = document.title;
                      const resultStr = document.querySelector('[data-message-id]').getAttribute('data-legacy-message-id');
                      console.log(resultStr);



                      return resultStr;
                  };

                  chrome.scripting.executeScript({
                      target: { tabId: tab.id },
                      func: getMessageId,
                      }).then((rep) => {

                      const message_id = rep[0]['result'];
                      console.log("message_id: ", message_id)

                      if(message_id == null){console.error("Message Id not found.");}
                      else {
                          chrome.identity.getAuthToken({interactive: true}, function (token) {

                              console.log("auth token: ", token);
                              if(token == null){console.error("Authorization token null");}
                              else{
                                    chrome.identity.getProfileUserInfo(function (accounts) {
                                  //console.log("accuont id: ",accounts.id);
                                  //console.log("url: "+'https://gmail.googleapis.com/gmail/v1/users/'+accounts.id+'/messages/'+message_id+'?key='+API_KEY)
                                  fetch(
                                      'https://gmail.googleapis.com/gmail/v1/users/' + accounts.id + '/messages/' + message_id + '?key=' + API_KEY,
                                      {
                                          headers: new Headers({
                                              'Authorization': 'Bearer ' + token,
                                              'Accept': 'application/json', 'content-type': 'application/json'
                                          }),
                                          compressed: true,
                                      })
                                      .then((response) => {
                                          response.json().then((element) => {

                                              const email_message = element.snippet;
                                              console.log(email_message);
                                              const payload = "Is this a phishing email? \n\n" + email_message;
                                              console.log(payload);

                                              const url = "evaluate_email";


                                              fetch("http://127.0.0.1:5000/" + url, {
                                                  method: 'POST',
                                                  headers: new Headers({'content-type': 'application/json'}),
                                                  mode: 'cors',
                                                  body: JSON.stringify(payload),
                                              }).then((response) => {
                                                  response.json().then((element) => {
                                                      console.log(element.is_phishing);


                                                      const elm = document.getElementById('phishing-text-box');
                                                      if (elm) {
                                                          elm.innerHTML += element.is_phishing;
                                                      }

                                                      const elm2 = document.getElementById('explanation-text-box');
                                                      if (elm2) {
                                                          elm2.innerHTML += element.evaluation;
                                                      }
                                                      //console.log(elm.innerHTML); //+= element.is_phishing;

                                                      //add phishing label to the email
                                                      // label id is hard coded to be the label id for Adrian's phishing label, this will need to be changed for other accounts.
                                              //This If statement will need to be modified to follow what the actualy yes/no response will look like.
                                                      if(element.is_phishing === 'Yes'){
                                                          console.log("Adding phishing label")
                                                          let label_payload = {
                                                              "addLabelIds": [
                                                                  "Label_3214162170429020544"
                                                              ]}
                                                          fetch(
                                                              'https://gmail.googleapis.com/gmail/v1/users/' + accounts.id + '/messages/' + message_id+'/modify' + '?key=' + API_KEY,
                                                              {
                                                                  method: 'POST',
                                                                  headers: new Headers({
                                                                      'Authorization': 'Bearer ' + token,
                                                                      'Accept': 'application/json', 'content-type': 'application/json'
                                                                  }),
                                                                  compressed: true,
                                                                  body:JSON.stringify(label_payload)
                                                              }).then((response) => {
                                                                  console.log(response);
                                                          });
                                                      }


                                                  })
                                              });

                                          });

                                      });


                              });
                                }
                          });
                      }

                  });
              });



          });
          button.render();
      }



}

const MyApp = new App();
