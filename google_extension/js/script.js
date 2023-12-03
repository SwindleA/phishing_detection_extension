import { Request } from "./request.js";
import { Button } from "./Button.js";

const API_KEY = ''
class App{

    constructor(){
        
        
        this.requestor = new Request();


        //this.login = this.login();

        this.evaluate_email = this.evaluateEmail();

        this.Reevaluate_email = this.ReevaluateEmail();

        this.submitChecklist = this.submitChecklist();

        let big_payload = {};


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
                /*for(let i = 0; i<checkedItems.length;i++){
                    console.log
                    if(checkedItems[i] === 'unknown_name'){
                        console.log("here");
                        this.big_payload['unknown_name'] = "True"
                    }else if(checkedItems[i] === 'unknown_email'){
                        this.big_payload["unknown_email"] = "True";
                    }else if(checkedItems[i] === 'unknown_email_domain'){
                        this.big_payload["unknown_email_domain"] = "True";
                    }else if(checkedItems[i] === 'unreasonable_email'){
                        this.big_payload["unreasonable_email"] = "True";
                    }
                }*/

                console.log("Big paylaoad: ",big_payload);
                this.requestor.post('reevaluate_email',big_payload).then((response) =>{
                    response.json().then((element) =>{
                        console.log(element);

                        document.getElementById('main_screen').style.display = "block";

                        document.getElementById('checklist').style.display = "none";

                        console.log("yes no: ", element.is_phishing);

                        document.getElementById('loader').style.display = "none";
                        const elm = document.getElementById('phishing-text-box');
                        if (elm) {
                            elm.innerHTML = element.is_phishing;
                        }

                        const elm2 = document.getElementById('explanation-text-box');
                        if (elm2) {

                            elm2.innerHTML = element.evaluation;
                        }

                    })
                });



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
                  //takes the array of parts in as the parameter, this is for extracting the message from an email
                  function getMessage(part) {

                      let total=''
                    for(let p=0;p<part.length;p++){

                        if(part[p].mimeType === 'multipart/alternative'){

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
                                              console.log(element.payload);
                                              //get the plaintext parts of the email

                                              let encoded = getMessage(element.payload.parts);
                                                // base64 does not support '-' and '_'
                                              // use '-' => '+' and '_'=>'/'
                                              let encoded2 = encoded.replace('-','+');
                                              let encoded3 = encoded2.replace('_','/');

                                       //convert from base64 to plaintext

                                              let decoded = '';
                                              //if there is an error encodeing, it is probably due to the message being too long, supply the AI with a snippet of the message that is provided by the api.
                                              let truncate_message = '';
                                              try{
                                                  decoded=  window.atob(encoded3);
                                                  truncate_message = 'F';
                                              }catch(e){
                                                  console.error(e);
                                                  decoded = "{The following message is truncated} " + element.snippet;
                                                  truncate_message = 'T';
                                              }
                                              //console.log("decoded: ", decoded);

                                              const sender_email = element.payload.headers[7]['value'];
                                              console.log(sender_email);
                                              //display sender email
                                              const checklist_senderemail = document.getElementById('sender_email');
                                              if (checklist_senderemail){
                                                  checklist_senderemail.innerText  = sender_email;
                                              }



                                              //split the email by the @ sign, then split by the '>' to remove it from the end. Emails here start with '<' and end with '>', removing the arrows for clarity.
                                              let email_domain = '@'+sender_email.split("@")[1].split('>')[0];
                                              //add sender email to the checklist
                                              const checklist_sender = document.getElementById('domain');
                                                if (checklist_sender){
                                                    checklist_sender.innerText  = email_domain;
                                                }
                                                // get sender name:
                                              let sender_name = element.payload.headers[17]['value'].split('"')[1];
                                                console.log("sender name: ", sender_name);
                                              const checklist_sendername = document.getElementById('send_name');
                                              if (checklist_sendername){
                                                  checklist_sendername.innerText  = sender_name;
                                              }
                                              const recipient_email = element.payload.headers[0]['value'];
                                              console.log(recipient_email);

                                              const subject = element.payload.headers[19]['value'];
                                              console.log(subject);



                                              this.big_payload = {
                                                  'sender_email': sender_email,
                                                  'sender_email_domain' : email_domain,
                                                  'sender_name': sender_name,
                                                  'recipient_email': recipient_email,
                                                  'subject': subject,
                                                  'email_message' : decoded
                                              }
                                              console.log(big_payload);

                                              const url = "evaluate_email";





                                              fetch("http://127.0.0.1:5000/" + url, {
                                                  method: 'POST',
                                                  headers: new Headers({'content-type': 'application/json'}),
                                                  mode: 'cors',
                                                  body: JSON.stringify(big_payload),
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
                                                          if(truncate_message == 'T'){
                                                              elm2.innerHTML += "The email is too long. The following evaluation is based on the first sentence or two of the email: "
                                                          }
                                                          elm2.innerHTML += element.evaluation;
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
