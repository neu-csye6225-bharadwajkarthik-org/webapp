#!/bin/bash

# add a new group = 'csye6225'
sudo groupadd csye6225

# add a new user = 'csye6225', belonging to group 'csye6225', with no login shell, and a home dir = /opt/csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

