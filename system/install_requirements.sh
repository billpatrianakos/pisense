#!/bin/bash

##
# Bash script to install all dependencies on your Pi
##

sudo apt-get update && sudo apt-get upgrade -y

echo "<<< SYSTEM UPDATED >>>"

sudo apt install postgresql postgresql-contrib -y

echo "<<< POSTGRES INSTALLED >>>"
# sudo apt-get install postgresql libpq-dev postgresql-client postgresql-client-common
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source .bashrc

echo "<<< INSTALLED NVM AND RELOADED .bashrc FILE >>>"

sudo apt-get install python3-pip -y
sudo python3 -m pip install --upgrade pip setuptools wheel 

echo "<<< INSTALLED pip3 AND UPGRADED setuptools & wheel >>>"

nvm install 10.16.0 
nvm use 10.16.0 

echo "<<< INSTALLED NODE 10.16.0 AND SWITCHED TO IT >>>"

npm install -g knex pm2 

echo "<<< INSTALLED REQUIRED GLOBAL NODE MODULES >>>"

sudo pip3 install twilio 
sudo pip3 install psycopg2

echo "<<< INSTALLED twilio AND psycopg2 PYTHON MODULES >>>"

sudo apt-get install git -y

echo "<<< INSTALLED GIT >>>"