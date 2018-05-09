# Install Bitcoin node
```
add-apt-repository ppa:bitcoin/bitcoin
apt-get update
apt-get install libboost-all-dev libdb4.8-dev libdb4.8++-dev
ln -s /usr/local/bin/bitcoind /usr/bin/bitcoind
```
## configuration
```
cd ~/
mkdir .bitcoin
cd .bitcoin
vim bitcoin.conf
```
Add the following to bitcoin.conf:
```
server=1
daemon=1
testnet=1
rpcuser=UNIQUE_RPC_USERNAME
rpcpassword=UNIQUE_RPC_PASSWORD
```
## start bitcoind
>bitcoind
>bitcoind getinfo
>bitcoind help

# TypeScript Express Server (TES)

This is a sample server using Express, TypeScript, MongoDB, and Mongoose.

### Getting Started

1. Execute `yarn install` in console.
2. Specifiy server port and frontend url in .env file
3. Install mongodb and run it
4. Execute `yarn server`


