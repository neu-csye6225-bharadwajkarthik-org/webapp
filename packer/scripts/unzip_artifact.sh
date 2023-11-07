#!/bin/bash

# Install 'unzip' with sudo
sudo apt-get install -y unzip

# unzip artifact to /opt/csye6225/forkedWebappRepo
sudo -u csye6225 unzip -d /opt/csye6225/webapp ~/webapp.zip

# move the user.csv file to /opt
sudo mv /opt/csye6225/webapp/user.csv /opt/user.csv

# Delete the zip file
sudo rm ~/webapp.zip