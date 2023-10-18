#This is used for deploying to the Artifacts Registry in the Google Cloud
#https://console.cloud.google.com/artifacts?project=wwsc-2023

# Use the official Python image.
# https://hub.docker.com/_/python
FROM python:3.10

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . .

# Install production dependencies.
RUN pip install Flask gunicorn
RUN pip install -r requirements.txt

CMD exec gunicorn --workers 1 --threads 8 --timeout 0 app:app
