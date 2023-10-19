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

# Loading the extension to Chrome


1. Go to the Extensions page by entering chrome://extensions in a new tab. (By design chrome:// URLs are not linkable.)

* Alternatively, click on the Extensions menu puzzle button and select Manage Extensions at the bottom of the menu.
* Or, click the Chrome menu, hover over More Tools, then select Extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.

3. Click the Load unpacked button and select the extension directory.

4. The extension should now appear with the other active Chrome Extensions in the Chrome Browser.

# [Optional] First Time Deploying to Google Cloud

1. [Install and setup Google Cloud CLI](https://cloud.google.com/sdk/docs/install-sdk)
2. Create a [Google Cloud project]('https://cloud.google.com/resource-manager/docs/creating-managing-projects')
3. [Build and push a Docker image]('https://cloud.google.com/build/docs/build-push-docker-image')
   1. Upon completion, there should be two new files unique to your project, Dockerfile and cloudbuild.yaml.
4. Deploying image
   1. In your Google Cloud project, go to Cloud Run.
   2. Click the "Create Service" button and use the image you pushed to the Artifact Registry.
   3. Once the service has been created, go into the services page and make note of the url next to the service name.

# [Optional] Deploying Revisions to Google Cloud

1. Submit the build
   1. Open the Google Cloud SDK Shell in the same directoy as the project
   * Run `gcloud builds submit --region=`[your region] `--config cloudbuild.yaml`
   * This sends the build to the [Artifact Registry](https://console.cloud.google.com/artifacts)

2. Deploy the revision
   1. Go to the Cloud Run into the service running your application
   2. Click "Edit & Deploy New Revision"
      1. Click "Deploy"
   3. Verify Deployment
      1. Look at the revisions page of your service and see your revision and the time you deployed it.
