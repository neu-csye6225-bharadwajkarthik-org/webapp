#!/bin/bash

# move the systemd service from /tmp/webapp.service to /etc/systemd/system/webapp.service using sudo
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

# Set ownership (chown) to csye6225:csye6225
sudo chown csye6225:csye6225 /etc/systemd/system/webapp.service

# reload, enable and start the webapp.service daemon
sudo systemctl daemon-reload
sudo systemctl enable webapp.service
