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

        payload = request.get_json()
        question = "Is this phishing? " + payload['email_message']
        print("Evaluating Email")
        evaluation = 'stuff stuffy stuff'#chatGPT.askQuestion(question)#
        print("Done... Returning answer ....")
        formatted = {
            "is_phishing": "Yes/No",
            "evaluation":  evaluation
        }

        return(json.dumps(formatted),200)


#This two  routes will look much differently once the prompt design is completed.
@app.route('/reevaluate_email',methods=['POST'])
def reevaluate_email():
    if request.method == 'POST':

        payload = request.get_json()
        question = "Is this phishing? " + payload['email_message']

        if(payload['unknown_name'] == 'True'):
            sender_relationship = "User is unfamiliar with the sender's name"
        else:
            sender_relationship = "User is familiar with the sender's name"


        evaluation = 'stuff stuffy stuff'#chatGPT.reEvaluation(question)
        formatted = {
            "is_phishing": "Yes/No",
            "evaluation":  evaluation
        }
        return(json.dumps(formatted),200)

if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run()