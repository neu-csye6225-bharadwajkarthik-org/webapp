#!/bin/bash

# Install MariaDB server
sudo apt-get install -y mariadb-server

# Start MariaDB server
sudo systemctl start mariadb

# Change the MySQL root password to match that in configuration file
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password'; CREATE DATABASE IF NOT EXISTS db_sequelize_mysql; FLUSH PRIVILEGES;"

# Install Node.js and npm
sudo apt-get install -y nodejs npm

# Check Node.js and npm versions
node -v
npm -v

# install npm dependencies
cd /opt && sudo npm i

