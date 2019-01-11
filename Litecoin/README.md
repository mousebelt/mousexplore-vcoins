# MouseXplore Vcoins Litecoin
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Vcoins Litecoin.


# Install Litecoin node
https://github.com/mmgen/mmgen/wiki/Install-Bitcoind-from-Source-on-Debian-or-Ubuntu-Linux  

## litecoin.conf
```
server=1
daemon=1
testnet=1
rpcuser=rpcuser
rpcpassword=pwd
rpcport=28332
```

## test
>litecoin-cli getnetworkinfo


# Run Vcoins

1. Run litecoin daemon
1. Run mongod
1. Configure project
    - configure project (config/index.js)  
1. Run project
    - Start the server in mainnet mode:
    `pm2 start pm2.json`
    - Start the server in testnet mode:
    `pm2 start --env testnet pm2.json`
