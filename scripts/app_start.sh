#!/bin/bash
cd /home/ubuntu/backendali
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt-get install -y nodejs
npm install
npm start
echo "Server Started"