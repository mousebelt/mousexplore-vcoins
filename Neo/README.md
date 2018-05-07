# Install Neo node
## dotnet install
### Register Microsoft key and feed
>wget -q packages-microsoft-prod.deb https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
>sudo dpkg -i packages-microsoft-prod.deb

### Install .NET SDK
>wget -q packages-microsoft-prod.deb https://packages.microsoft.com/config/ubuntu/16.04/packages-microsoft-prod.deb
>sudo dpkg -i packages-microsoft-prod.deb

## Installation of NEO node
Download the Neo-CLI package on Github and unzip it
https://github.com/neo-project/neo-cli/releases

>sudo apt-get install libleveldb-dev sqlite3 libsqlite3-dev
>dotnet neo-cli.dll

Neo-CLI provides a series of APIs for external access. If you want to start the node while opening the API, you can run the following code.
>dotnet neo-cli.dll /rpc

If you want the external program to access the node API need to open the firewall port: 10331-10334, 20331-20334

## testnet/mainnet configure
You will find the following config files.
>$HOME/neo-cli/config.json
>$HOME/neo-cli/config.mainnet.json
>$HOME/neo-cli/config.testnet.json

mainnet config
>cp config.mainnet.json config.json

testnet config
>cp config.testnet.json config.json

## run as daemon
>screen -S dotnet neo-cli.dll /rpc

# Reference
http://docs.neo.org/en-us/node/cli.html
