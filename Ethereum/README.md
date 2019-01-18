# MouseXplore Vcoins Ethereum
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Vcoins Ethereum.


# Environment
* install node
* install mongodb
* npm install
* setup local geth or alchemy provider
* update config

# Install Ethereum node
https://medium.com/pactum/geth-node-via-ubuntu-quick-start-90e6cfea7a62

## testnet
screen
>geth --testnet --networkid=3 –-syncmode=fast –-cache=1024 console --rpcapi eth,web3,personal,net,db
>
>ctrl+a and d will detach from new console.

## run as service
 
* using systemctl
 
>cp ./geth.service /etc/systemd/system/geth.service  
>systemctl daemon-reload  
>systemctl enable geth.service  
>systemctl start geth  
 
* check the status
>service geth status
***
 
* attach
>geth attach http://localhost:8545

# Run Vcoins

1. Run geth daemon
1. Run mongod
1. Update config
    ```
    cd config
    cp mainnet.js.example mainnet.js
    cp ropsten.js.example ropsten.js
    cp rinkeby.js.example rinkeby.js
    ```
    Update config variables in the above file.
1. Run project
    - Start the server in mainnet mode:
    `pm2 start --env mainnet pm2.json`
    - Start the server in rinkeby-testnet mode:
    `pm2 start --env rinkeby pm2.json`
    - Start the server in ropsten-testnet mode:
    `pm2 start --env ropsten pm2.json`
    - To restart the server, run:
    `pm2 restart ethereum-vcoins`
