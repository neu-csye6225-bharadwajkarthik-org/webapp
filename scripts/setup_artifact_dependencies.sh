#!/bin/bash

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check Node.js and npm versions
node -v
npm -v

# install npm dependencies
cd /opt/csye6225/webapp && sudo -u csye6225 npm i

