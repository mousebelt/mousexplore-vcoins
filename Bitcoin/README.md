# Install Bitcoin node
```
** Add repository and install bitcoind ** 

sudo apt-get install build-essential
sudo apt-get install libtool autotools-dev autoconf
sudo apt-get install libssl-dev
sudo apt-get install libboost-all-dev
sudo add-apt-repository ppa:bitcoin/bitcoin
sudo apt-get update
sudo apt-get install bitcoind
mkdir ~/.bitcoin/ && cd ~/.bitcoin/
nano bitcoind.conf


** Add config to bitcoin.conf file ** 

rpcuser=username
rpcpassword=password
testnet=1
rpcport=8332
rpcallowip=127.0.0.1
rpcallowip=195.154.11.93
server=1


** Start bitcoind ** 

bitcoind &


** If bitcoind is already started ** 

ps -e | grep bitcoin // returns pid
kill -9 <pid>
bitcoind &

** Test bitcoind is running and working **

bitcoin-cli getinfo
```

# TypeScript Express Server (TES)

This is a sample server using Express, TypeScript, MongoDB, and Mongoose.

### Getting Started

1. Execute `yarn install` in console.
2. Specifiy server port and frontend url in .env file
3. Install mongodb and run it
4. Execute `yarn server`


