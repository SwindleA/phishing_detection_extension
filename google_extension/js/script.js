import { Request } from "./request.js";
import { Button } from "./Button.js";

const API_KEY = 
class App{

    constructor(){
        
        
        this.requestor = new Request();


        this.login = this.login();

        this.evaluate_email = this.evaluateEmail();

        this.Reevaluate_email = this.ReevaluateEmail();
        const element = document.getElementById("myButton");

    }


    // not sure this is needed.
      login(){
        const button = new Button('#loginButton', ()=>{
            console.log("Login Button");
            chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
                console.log(token);

            });

        });
        button.render();

      }


    ReevaluateEmail(){
        const button = new Button('#reevaluate', ()=>{
            console.log("ReevaluateButton");


        });
    }


      evaluateEmail(){
          const button = new Button('#evaluateEmail', ()=>{
              console.log("EvaluateButton");


              document.getElementById('loader').style.display = "block";

              chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                  const tab = tabs[0];

                  function getMessageId() {
                      //console.log("inside printTitle func");

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

                                              const sender_email = element.payload.headers[7]['value'];
                                              console.log(sender_email);

                                              const recipient_email = element.payload.headers[0]['value'];
                                              console.log(recipient_email);

                                              const subject = element.payload.headers[19]['value'];
                                              console.log(subject);

                                              const email_message = element.snippet;
                                              console.log(email_message);

                                              const payload = {
                                                  'sender_email': sender_email,
                                                  'recipient_email': recipient_email,
                                                  'subject': subject,
                                                  'email_message' : email_message
                                              }
                                              console.log(payload);

                                              const url = "evaluate_email";





                                              fetch("http://127.0.0.1:5000/" + url, {
                                                  method: 'POST',
                                                  headers: new Headers({'content-type': 'application/json'}),
                                                  mode: 'cors',
                                                  body: JSON.stringify(payload),
                                              }).then((response) => {
                                                  response.json().then((element) => {
                                                      console.log("yes no: ", element.is_phishing);

                                                        document.getElementById('loader').style.display = "none";
                                                      const elm = document.getElementById('phishing-text-box');
                                                      if (elm) {
                                                          elm.innerHTML += element.is_phishing;
                                                      }

                                                      const elm2 = document.getElementById('explanation-text-box');
                                                      if (elm2) {
                                                          elm2.innerHTML = element.evaluation;
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