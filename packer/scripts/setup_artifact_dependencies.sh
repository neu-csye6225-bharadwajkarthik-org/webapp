#!/bin/bash

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check Node.js and npm versions
node -v
npm -v

# install npm dependencies
cd /opt/csye6225/webapp && sudo -u csye6225 npm i

# Make the logs directory
sudo mkdir /opt/csye6225/webapp/logs

# create file to collect log data
sudo touch /opt/csye6225/webapp/logs/webapp.log

# Give write permission to others so that logging library can write to file
sudo chmod 766 /opt/csye6225/webapp/logs/webapp.log

# Change user and group to csye6225
sudo chown -R csye6225:csye6225 /opt/csye6225/webapp/logs
