# MouseXplore Vcoins Bitcoin
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Vcoins Bitcoin.


# Install Bitcoin node
https://degreesofzero.com/article/building-bitcoind-from-source-on-ubuntu.html  
https://github.com/mmgen/mmgen/wiki/Install-Bitcoind-from-Source-on-Debian-or-Ubuntu-Linux  
https://degreesofzero.com/article/installing-bitcoind-on-ubuntu.html

## bitcoin.conf
```
rpcuser=rpcuser
rpcpassword=pwd
rpcport=18332
server=1
daemon=1
#regtest=1
#testnet=1
txindex=1
#dbcache=1024
#prune=1000
#walletnotify=/var/www/cron/receive.sh %s
#keypool=1000000
```

## run
>bitcoind

## checking rpc
>bitcoin-cli getnetworkinfo

# Run Vcoins

1. Run bitcoin daemon
1. Run mongod
1. Configure project
    - configure project (config/index.js)  
1. Run project
    - Start the server in mainnet mode:
    `pm2 start pm2.json`
    - Start the server in testnet mode:
    `pm2 start --env testnet pm2.json`
