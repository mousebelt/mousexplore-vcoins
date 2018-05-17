# Install Bitcoin node
https://degreesofzero.com/article/building-bitcoind-from-source-on-ubuntu.html  
https://github.com/mmgen/mmgen/wiki/Install-Bitcoind-from-Source-on-Debian-or-Ubuntu-Linux  
https://degreesofzero.com/article/installing-bitcoind-on-ubuntu.html

## bitcoin.conf
```
server=1
daemon=1
testnet=1
rpcuser=rpcuser
rpcpassword=pwd
rpcport=18332
```

## run
>bitcoind

## checking rpc
>bitcoin-cli getnetworkinfo
