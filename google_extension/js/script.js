import { Request } from "./request.js";
import { Button } from "./Button.js";

const API_KEY = 'AIzaSyDGyvU7VWNHH9U-9lhb_GVP2YE-gN1OH4s'
class App{

    constructor(){
        
        
        this.requestor = new Request();


        this.login = this.login();

        this.evaluate_email = this.evaluateEmail();

        this.Reevaluate_email = this.ReevaluateEmail();

        this.submitChecklist = this.submitChecklist();


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

            document.getElementById('main_screen').style.display = "none";

            document.getElementById('checklist').style.display = "block";
        });
        button.render();
       }

        submitChecklist(){
            const button = new Button('#submit',()=>{
                let checkboxes = document.querySelectorAll('input:checked');

                let checkedItems = Array.from(checkboxes).map(checkbox => checkbox.name);
                console.log(checkedItems);

            });

            button.render();

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
                  //takes the array if parts in as the parameter, this is for extracting the message from an email
                  function getMessage(part) {
                      console.log("part: ", part);
                      let total=''
                    for(let p=0;p<part.length;p++){
                        console.log("p: ", part[p]);
                        if(part[p].mimeType === 'multipart/alternative'){
                            console.log("here");
                            total += getMessage(part[p].parts);
                        }else if(part[p].mimeType === 'text/plain'){
                            total += part[p].body.data;
                        }
                    }

                    return total;
                  };

                  chrome.scripting.executeScript({
                      target: { tabId: tab.id },
                      func: getMessageId,
                      }).then((rep) => {

                      const message_id = rep[0]['result'];
                      // console.log("message_id: ", message_id)

                      if(message_id == null){console.error("Message Id not found.");}
                      else {
                          chrome.identity.getAuthToken({interactive: true}, function (token) {

                              //console.log("auth token: ", token);
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

                                              //parts are the elements of the readable message, includes images,html stuff, etc...
                                              console.log(element.payload.parts);
                                              //get the plaintext parts of the email

                                              let encoded = getMessage(element.payload.parts);
                                                // base64 does not support '-' and '_'
                                              // use '-' => '+' and '_'=>'/'
                                              let encoded2 = encoded.replace('-','+');
                                              let encoded3 = encoded2.replace('_','/');
                                              console.log("encoded:  ",encoded3);

                                                //convert from base64 to plaintext
                                              let decoded = window.atob(encoded3);
                                              console.log("decoded: ", decoded);

                                              const sender_email = element.payload.headers[7]['value'];
                                              console.log(sender_email);

                                              //split the email by the @ sign, then split by the '>' to remove it from the end. Emails here start with '<' and end with '>', removing the arrows for clarity.
                                              let email_domain = '@'+sender_email.split("@")[1].split('>')[0];
                                              //add sender email to the checklist
                                              const checklist_sender = document.getElementById('domain');
                                                if (checklist_sender){
                                                    checklist_sender.innerText  = email_domain;
                                                }

                                              const recipient_email = element.payload.headers[0]['value'];
                                              console.log(recipient_email);

                                              const subject = element.payload.headers[19]['value'];
                                              console.log(subject);



                                              const payload = {
                                                  'sender_email': sender_email,
                                                  'recipient_email': recipient_email,
                                                  'subject': subject,
                                                  'email_message' : decoded
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
                                                      document.getElementById('reevaluate').style.display = "block";


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
