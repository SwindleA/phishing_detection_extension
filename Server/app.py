# standard library imports
import os
import json
# third party imports
from flask import Flask, request, redirect, url_for, make_response
from flask_cors import CORS
import time

#gmail imports

#codebase imports
from AI.chatGPT import chatGPT

app = Flask(__name__, template_folder='extension')
CORS(app)



@app.route('/test/GPT/<question>', methods=['GET'])
def testGPT(question):

    if request.method =='GET':
        test_response = chatGPT.askQuestion(question)
        formatted = {
            "message": test_response
        }
        return(json.dumps(formatted),200)

@app.route('/evaluate_email',methods=['POST'])
def evaluate_email():
    if request.method == 'POST':
        data = request.get_json()
        sender_email = data['sender_email']
        recipient_email = data['recipient_email']
        subject = data['subject']
        body_message = data['email_message']


        phishing_query = (
            "You are trying to detect phishing emails.\n"
            "Here is the sender's email: " + sender_email + "\n"
            "Here is the recipient's email: " + recipient_email + "\n"
            "Here is the subject of the email: " + subject + "\n"
            "Is this email contents phishing: \n" + body_message + "\n\n"
            "Respond only yes or no."
        )


        is_phishing_response = chatGPT.askQuestion(phishing_query)
        is_phishing_response = is_phishing_response.strip().lower()
        print(is_phishing_response)

        if ("yes" not in is_phishing_response  and "no" not in is_phishing_response):
            print("Response Error")
            time.sleep(20)
            is_phishing_response = chatGPT.askQuestion(phishing_query)

            if ("yes" not in is_phishing_response  and "no" not in is_phishing_response):
                is_phishing_response = "Error"
                print("Response Error")


        explanation_query = (
            "The following information  " + ("is from a phishing email: " if "yes" in is_phishing_response  else "is not from a phishing email: ") + "\n"
            "Sender's email: " + sender_email + "\n"
            "Recipient's email: " + recipient_email + "\n"
            "Subject: " + subject + "\n"
            "Body: " + body_message + "\n"
            "Explain why this email is" + (" " if "yes" in is_phishing_response  else " not ") + "phishing."
        )

        print("\nexplanation query: \n",explanation_query)
        explanation_response = chatGPT.askQuestion(explanation_query)
        print("response 2:\n",explanation_response)
        formatted_response = {
            "is_phishing": is_phishing_response,
            "explanation": explanation_response

        }

        return(json.dumps(formatted_response), 200)


#This two  routes will look much differently once the prompt design is completed.
@app.route('/reevaluate_email',methods=['POST'])
def reevaluate_email():
    if request.method == 'POST':

        payload = request.get_json()
        sender_email = payload['sender_email']
        recipient_email = payload['recipient_email']
        subject = payload['subject']
        body_message = payload['email_message']
        sender_name = payload['sender_name']
        sender_email_domain = payload['sender_email_domain']






        if(payload['unknown_name'] == 'True'):
            sender_relationship = "User is unfamiliar with the sender's name: " + sender_name
        else:
            sender_relationship = "User is familiar with the sender's name: " + sender_name

        if(payload['unknown_email'] == 'True'):
            email_relationship = "User is unfamiliar with the sender's email: " + sender_email
        else:
            email_relationship = "User is familiar with the sender's email: " + sender_email
        if(payload['unknown_email_domain'] == 'True'):
            domain_relationship = "User is unfamiliar with the sender's email domain: " + sender_email_domain
        else:
            domain_relationship = "User is familiar with the sender's email domain: " + sender_email_domain
        if(payload['unreasonable_email']== 'True'):
            reasonablility = "This email is unreasonable for this user's currently life situation."
        else:
            reasonablility = "This email is reasonable for this user's currently life situation."

        initial_info = (
                "You are trying to detect phishing emails.\n"+
                sender_relationship+'\n'+
                email_relationship + '\n'+
                domain_relationship+'\n'+
                reasonablility+'\n'+
                 "Here is the subject of the email: " + subject + "\n"

        )

        email =("Is this email contents phishing: " + body_message + "\n\n"+
                "Respond only yes or no.")

        print("initial info : \n", initial_info)
        print("email: \n", email)

        is_phishing_response = chatGPT.reEvaluation(initial_info,email)
        is_phishing_response = is_phishing_response.strip().lower()

        if (("yes" not in is_phishing_response  and "no" not in is_phishing_response) or len(is_phishing_response) > 5):

            print("Response Error")
            time.sleep(10)
            is_phishing_response = chatGPT.reEvaluation(initial_info,email)

            if (("yes" not in is_phishing_response  and "no" not in is_phishing_response) or len(is_phishing_response) > 5):
                is_phishing_response = "no"
                print("Response Error")

        print(is_phishing_response)

        initial_info2 = (
                "The following information  " + ("is from a phishing email: " if "yes" in is_phishing_response  else "is not from a phishing email: ") + "\n"+
                sender_relationship+'\n'+
                email_relationship + '\n'+
                domain_relationship+'\n'+
                reasonablility+'\n'+
                "Here is the subject of the email: " + subject + "\n"


        )
        email2 =("Body of the message: "+body_message+"\n\n\nExplain why this email is" + (" " if "yes" in is_phishing_response   else " not ") + "phishing.")


        print("initial info2 : \n", initial_info2)
        print("email2: \n", email2)
        time.sleep(10)
        explanation_response = chatGPT.reEvaluation(initial_info2,email2)

        formatted_response = {
            "is_phishing": is_phishing_response,
            "explanation": explanation_response

        }
        return(json.dumps(formatted_response),200)

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run()