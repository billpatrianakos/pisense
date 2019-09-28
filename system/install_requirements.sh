#!/bin/bash

##
# Bash script to install all dependencies on your Pi
##

sudo apt-get update && sudo apt-get upgrade -y

echo "<<< SYSTEM UPDATED >>>"

sudo apt install postgresql postgresql-contrib -y

echo "<<< POSTGRES INSTALLED >>>"

sudo apt install redis-server -y

echo "<<< INSTALLED REDIS >>>"
echo "!!! Please configure your redis.conf file. See https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04 for more details !!!"

sudo apt-get install nginx -y

echo "<<< INSTALLED nginx >>>"

sudo mkdir -p /var/www/CHANGE_ME/current/server/public

echo "<<< CREATED FOLDER /var/www/CHANGE_ME/current/server/public >>>"
echo "!!! You should change the CHANGE_ME folder's name to match what's in your config/pisense.conf file !!!"

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
sudo pip3 install Adafruit_DHT

echo "<<< INSTALLED twilio, psycopg2, AND Adafruit_DHT PYTHON MODULES >>>"

sudo apt-get install git -y

echo "<<< INSTALLED GIT >>>"

mkdir git && cd $_
mkdir pisense.git && cd $_
git init --bare

echo "<<< CREATED GIT REPOSITORY IN $(pwd) >>>"

cd ~

echo "Your IP address is likely the first line of output below:"

ifconfig wlan0 | grep inet

echo "<<< FINISHED INSTALLATION >>>"
echo "Please review this script's output and update any configuration files that need to be changed for PiSense to run properly"
