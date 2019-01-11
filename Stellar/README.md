# MouseXplore Vcoins Stellar
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Vcoins Stellar.


# Stellar node
## Compute requirements
CPU, RAM, Disk and network depends on network activity.

As of early 2018, stellar-core with PostgreSQL running on the same machine has no problem running on a m5.large in AWS (dual core 2.5 GHz Intel Xeon, 8 GB RAM).

Storage wise, 20 GB seems to be an excellent working set as it leaves plenty of room for growth.

## Network access
### Interaction with the peer to peer network
* inbound: stellar-core needs to allow all ips to connect to its PEER_PORT (default 11625) over TCP.
* outbound: stellar-core needs access to connect to other peers on the internet on PEER_PORT (most use the default as well) over TCP.

### Interaction with other internal systems
* outbound:
stellar-core needs access to a database (postgresql for example), which may reside on a different machine on the network
other connections can safely be blocked
* inbound: stellar-core exposes an unauthenticated HTTP endpoint on port HTTP_PORT (default 11626)
it is used by other systems (such as Horizon) to submit transactions (so may have to be exposed to the rest of your internal ips)
query information (info, metrics, …) for humans and automation perform administrative commands (schedule upgrades, change log levels, …)


# Environment
* install node
* install mongod
* npm install

set environment variable RUN_TYPE as "test" if want to run StellarSdk.Network.useTestNetwork

# Install node
## installation of horizon and stella-core

* install Go  
https://golang.org/doc/install  
https://medium.com/@patdhlk/how-to-install-go-1-9-1-on-ubuntu-16-04-ee64c073cd79  

>sudo curl -O https://storage.googleapis.com/golang/go1.10.2.linux-amd64.tar.gz  
>sudo tar -xvf go1.9.1.linux-amd64.tar.gz  
>sudo mv go /usr/local  


* install horizon  
https://github.com/stellar/go/tree/master/services/horizon

>sudo wget https://github.com/stellar/go/releases/download/horizon-v0.13.0/horizon-v0.13.0-linux-amd64.tar.gz  
>sudo tar -xvf horizon-v0.13.0-linux-amd64.tar.gz  
>sudo cp ./horizon-v0.13.0-linux-amd64/horizon /usr/bin/horizon  

* install pandoc  
https://github.com/jgm/pandoc/releases/tag/2.2

>sudo wget https://github.com/jgm/pandoc/releases/download/2.2/pandoc-2.2-1-amd64.deb  
>sudo dpkg -i pandoc-2.2-1-amd64.deb  

* install stella-core  
https://github.com/stellar/stellar-core/blob/master/INSTALL.md

>sudo add-apt-repository ppa:ubuntu-toolchain-r/test  
>sudo apt-get update  
>sudo apt-get install git build-essential pkg-config autoconf automake libtool bison flex libpq-dev clang++-4.9 gcc-4.9 g++-4.9 cpp-4.9  

>git clone --single-branch --branch prod https://github.com/stellar/stellar-core.git

```
git submodule init  
git submodule update  
./autogen.sh.  
./configure (If configure complains about compiler versions, try CXX=clang-3.5 ./configure or CXX=g++-4.9 ./configure or similar, depending on your compiler.)  
Type make or make -j (for aggressive parallel build)  
Type make check to run tests.  
Type make install to install.  
```

## install environment
https://www.stellar.org/developers/horizon/reference/admin.html  
https://github.com/stellar/stellar-core/blob/master/docs/software/admin.md

### install postgresql

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04

>sudo apt-get update  
>sudo apt-get install postgresql postgresql-contrib

### create role of current system user

>sudo -u postgres createuser --interactive  
>Enter name of role to add: ubuntu  
>Shall the new role be a superuser? (y/n) y  

enter postgres console and set password to user  
>sudo -u postgres psql  
>postgres=# ALTER USER ubuntu PASSWORD 'a';

### stellar-core config
https://github.com/stellar/stellar-core/blob/master/docs/software/testnet.md

* Need to add db  
>createdb stellar

>sudo cp config/stellar-core_public.cfg /usr/local/bin/stellar-core.cfg

here do this if get error of some tables not exists.  
>stellar-core --newdb

>sudo stellar-core --forcescp                ---------?

>sudo stellar-core

This will run stellar-core server

### horizon config

* create db  
>createdb horizon

* set environment at /root/.bashrc

>export DATABASE_URL="postgres://ubuntu:a@localhost/horizon"  
>export STELLAR_CORE_DATABASE_URL="postgres://ubuntu:a@localhost/stellar"  
>export STELLAR_CORE_URL="http://localhost:11626"  
>export INGEST=true  

source /root/.bashrc

* db initialize 

>horizon db init

* run horizon  
>horizon  
or  
>horizon serve

## make stellar-core and horizon as service

>cp ./stellar-core.service /etc/systemd/system/stellar-core.service  
>cp ./horizon.service /etc/systemd/system/horizon.service  
>systemctl daemon-reload  
>systemctl enable stellar-core.service  
>systemctl enable horizon.service  
>systemctl start stellar-core  
>systemctl start horizon  

* check service status  
>service stellar-core status  
>service horizon status

## Mainnet setting
need to edit stellar-core.cfg.  
need inserting validating node, crafting a quorum set  
set all urls as live and history storage

Maybe only for getting transaction history, we don't need main net setting

### check stellar-core --c 'quorum' and if there is any missing, should remove it from node names

# test API
>node -e 'process.env.RUN_TYPE = "test"'

## createAccount
>node ./unittest/testAccount.js


# Run Vcoins

1. Run stellar-core daemon
1. Run horizon daemon
1. Run project
    - configure project (config/index.js)  
    - npm install  
    - pm2 start index.js --name stellar-vcoins
