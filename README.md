browswer extension to help detect phishing emails. could also be a plug-in to outlook. The goal of the code is to have a back-end that handles requests from any front-end and determine if email is phishing or not. 


// TODO: Outline how to run extension and backend. 


# Initial Setup


### 1. Install dependencies (only one time)
The instructions below assume that python3 and pip3 refer to Python 3.x and Pip 3.x.

1. Create a virtual environment: `python -m venv phishenv`
2. Activate virtual environment:
    * Mac or Linux: `source phishenv/bin/activate`
    * Windows: `cd .\phishenv\Scripts` then `.\Activate.ps1`
3. Install dependencies: `pip3 install -r requirements.txt`

# Running the App

## Locally:

1. Activate virtual environment with the following commands:
   * Mac or Linux: `source phishenv/bin/activate`
   * Windows: `cd .\phishenv\Scripts` then `.\Activate.ps1`



2. Run the Flask server
   1. Python path:
      * Mac or Linux: export python path with `export PYTHONPATH=$(pwd)`
      * Windows: Add python to your Environment Variables
   2. then enter `python3 app.py`

The terminal will give this response if everything is ran correctly
<pre><code>
Serving Flask app 'flask_main'
Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 Running on http://127.0.0.1:5000
Press CTRL+C to quit
</code></pre>