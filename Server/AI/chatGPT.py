import os

import openai
from AI.key import OPENAI_API_KEY
import time

openai.api_key = OPENAI_API_KEY

class chatGPT:

    def askQuestion(question):

        while True:

            try:

                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content" : question}],
                    temperature=0.7,
                    max_tokens=2048,
                    top_p=1.0,
                    frequency_penalty=0.0,
                    presence_penalty=0.0
                )
                break
            except openai.error.ServiceUnavailableError as e:
                print("API error:", e)
                print("Retrying in 10 seconds...")
                time.sleep(10)
            except Exception as ex:
                print("API exception:", ex)
                print("Retrying in 10 seconds...")
                time.sleep(10)



        return response['choices'][0]['message']['content']


    def reEvaluation(initial_info,prompt):

        while True:

            try:

                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "system", "content" : initial_info}, {"role": "user", "content" : prompt}],
                    temperature=0.7,
                    max_tokens=2048,
                    top_p=1.0,
                    frequency_penalty=0.0,
                    presence_penalty=0.0
                )
                break
            except openai.error.ServiceUnavailableError as e:
                print("API error:", e)
                print("Retrying in 10 seconds...")
                time.sleep(10)
            except Exception as ex:
                print("API exception:", ex)
                print("Retrying in 10 seconds...")
                time.sleep(10)
        return response['choices'][0]['message']['content']

## for testing

#print(reEvaluation("respond only yes or no","Is 3 greater than 2"))
