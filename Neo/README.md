# Install Neo node
## dotnet install
### Register Microsoft key and feed
>wget -q packages-microsoft-prod.deb https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
>sudo dpkg -i packages-microsoft-prod.deb

### Install .NET SDK
>sudo apt-get install apt-transport-https  
>sudo apt-get update  
>sudo apt-get install dotnet-sdk-2.1  

## Installation of NEO node
Download the Neo-CLI package on Github and unzip it
https://github.com/neo-project/neo-cli/releases

>sudo apt-get install unzip libleveldb-dev sqlite3 libsqlite3-dev libunwind8-dev   
>wget https://github.com/neo-project/neo-cli/releases/download/v2.7.3/neo-cli-ubuntu.16.04-x64.zip  
>unzip neo-cli-ubuntu.16.04-x64.zip  

Boostrap Node
>wget https://s3.eu-west-2.amazonaws.com/ashant-neo/chain.acc.zip  
>unzip chain.acc.zip -d ./neo-cli/  

Start the Node and Confirm it is Running
>cd neo-cli  
>dotnet neo-cli.dll /rpc  

If you want the external program to access the node API need to open the firewall port: 10331-10334, 20331-20334

## testnet/mainnet configure
You will find the following config files.
>$HOME/neo-cli/config.json  
>$HOME/neo-cli/config.mainnet.json  
>$HOME/neo-cli/config.testnet.json  

mainnet config (json-rpc port: 10332)
>cp config.mainnet.json config.json  

testnet config (json-rpc port: 20332)
>cp config.testnet.json config.json  


## run as service
>screen dotnet neo-cli.dll /rpc  

* using systemctl
>cp ./neoseed.service /etc/systemd/system/neoseed.service  
>systemctl enable neoseed  
>systemctl start neoseed  

* check the status
>service neoseed status  
>systemctl status neoseed  


# Reference
http://docs.neo.org/en-us/node/cli.html
