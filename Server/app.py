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
def testGmail():

    if request.method == 'POST':

        question = request.get_json()

        email_question = chatGPT.askQuestion(question)

        formatted = {
            "is_phishing": "Yes/No",
            "evaluation": email_question
        }

        return(json.dumps(formatted),200)


if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run()