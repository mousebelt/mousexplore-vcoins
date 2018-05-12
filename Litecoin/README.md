# Install Litecoin node
https://github.com/mmgen/mmgen/wiki/Install-Bitcoind-from-Source-on-Debian-or-Ubuntu-Linux  

## litecoin.conf
```
server=1
daemon=1
testnet=1
rpcuser=rpcuser
rpcpassword=pwd
rpcport=19332
```

## test
>curl --user rpcuser --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getblock", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:19332/

# TypeScript Express Server (TES)

This is a sample server using Express, TypeScript, MongoDB, and Mongoose.

### Getting Started

1. Execute `yarn install` in console.
2. Specifiy server port and frontend url in .env file
3. Install mongodb and run it
4. Execute `yarn server`


