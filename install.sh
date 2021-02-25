#!/bin/bash

#apt command to update OS 
sudo apt -y update

#apt command to upgrade OS
sudo apt -y upgrade

#apt command to install Mongodb
sudo apt install -y mongodb

#apt command to install git
sudo apt install -y git

#apt command to install pip3
sudo apt install -y python3-pip

#apt command to install required python packages
pip3 install -r requirements.txt
