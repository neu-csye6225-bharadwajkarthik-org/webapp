#!/bin/bash

# move the systemd service from /tmp/webapp.service to /etc/systemd/system/webapp.service using sudo
sudo mv /tmp/webapp.service /etc/systemd/system/webapp.service

# reload, enable and start the webapp.service daemon
sudo systemctl daemon-reload
sudo systemctl start webapp.service
sudo systemctl enable webapp.service
