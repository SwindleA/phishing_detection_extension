# standard library imports
import os
import json
# third party imports
from flask import Flask, request, redirect, url_for, make_response
from flask_cors import CORS

#gmail imports


from googleapiclient.errors import HttpError


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

@app.route('/test/gmailapi',methods=['POST'])
def testGmail():

    if request.method == 'POST':

        print("here")

        question = request.get_json()

        print("json: ", question)

        email_question = chatGPT.askQuestion(question)

        print("email question: ", email_question)

        formatted = {
            "message": email_question
        }



        return(json.dumps(formatted),200)



# @app.route('/test/setcred/<creds>',methods=['POST'])
# def setCredentials(creds):
#     if request.method == 'POST':
#         credentials = creds
#         return('', 200)
if __name__ == '__main__':
    app.secret_key = os.urandom(24)
    app.run()