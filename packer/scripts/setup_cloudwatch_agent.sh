#!/bin/bash

# Download cloudwatch agent
wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb

# Install cloudwatch agent
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Delete the installer
sudo rm ./amazon-cloudwatch-agent.deb

# Move the cloudwatch config file to user's webapp folder with sudo
sudo mv /tmp/cloudwatch-config.json /opt/csye6225/webapp/cloudwatch-config.json

# Change ownership of the config file
sudo chown csye6225:csye6225 /opt/csye6225/webapp/cloudwatch-config.json
