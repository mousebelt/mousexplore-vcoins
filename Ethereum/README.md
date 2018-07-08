# MouseXplore Vcoins Ethereum
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Vcoins Ethereum.


# Environment
* install node
* install mongod
* npm install

# Install Ethereum node
## testnet
screen
>geth --testnet --networkid=3 –-syncmode=fast –-cache=1024 console --rpcapi eth,web3,personal,net,db
>
>ctrl+a and d will detach from new console.

## run as service

https://medium.com/pactum/geth-node-via-ubuntu-quick-start-90e6cfea7a62

# Public Rest API for Ethereum Node
 
* using systemctl
 
>cp ./geth.service /etc/systemd/system/geth.service  
>systemctl daemon-reload  
>systemctl enable geth.service  
>systemctl start geth  
 
* check the status
>service geth status
***
 
* attach
>geth attach ipc:/root/.ethereum/testnet/geth.ipc

# Run Vcoins

## Run geth daemon
## Run mongod
## Run project
- configure project (config/index.js)  
- npm install  
- pm2 start index.js  
