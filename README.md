# MouseXplore Vcoins
![Alt text](/logo.png?raw=true "Logo")


This has cached and enriched responses from full cryptocurrency nodes that serves as the backend of the block explorer project. It is most often deployed in conjunction with the [frontend](https://github.com/norestlabs/mousexplore-frontend), though you can use it as a standalone for a wallet application.

### Getting Setup

After cloning this repository, switch to the folder you would like to use and follow the instructions to setup the cryptocurrency node powering it as well as mongodb. To run each of the block explorer implementations, use the following:

```
npm install
sudo npm install -g pm2
sudo pm2 start index.js --name vcoins
```

Then, whenever you need to restart the vcoins instance, you can run:

```
sudo pm2 restart vcoins
```

To view more detailed documentation regarding the API, check out the [API documentation](https://github.com/norestlabs/mousexplore-vcoins/wiki). To see more info on project setup, click the link in question above for detailed setup instructions.
