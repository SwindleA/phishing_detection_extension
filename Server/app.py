# standard library imports
import os
import json
# third party imports
from flask import Flask, request, redirect, url_for, make_response
from flask_cors import CORS

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
        body_message = data['body_message']

        phishing_query = (
            "You are trying to detect phishing emails. "
            "Here is the sender's email: " + sender_email + " "
            "Here is the recipient's email: " + recipient_email + " "
            "Here is the subject of the email: " + subject + " "
            "Is this email contents phishing: " + body_message
        )
        is_phishing_response = chatGPT.askQuestion(phishing_query)

        explanation_query = (
            "The following information is from " + ("a phishing email: " if is_phishing_response.strip().lower() == "yes" else "not a phishing email: ") +
            "Sender's email: " + sender_email + " "
            "Recipient's email: " + recipient_email + " "
            "Subject: " + subject + " "
            "Body: " + body_message + " "
            "Explain why this email is" + (" " if is_phishing_response.strip().lower() == "yes" else " not ") + "phishing."
        )
        explanation_response = chatGPT.askQuestion(explanation_query)

        formatted_response = {
            "is_phishing": is_phishing_response.strip(),
            "explanation": explanation_response
        }

        return(json.dumps(formatted_response), 200)


if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run()