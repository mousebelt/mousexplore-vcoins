# MouseXplore Loom Backend
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Loom Backend.


# Environment
* install node
* install mongodb
* npm install


# Run Backend

1. Run mongod

1. Update config
    Create `.env` file, and add the following variables to `.env`.
    ```
    NODE_ENV=development
    APP_SECRET='your_app_secret'
    APP_PORT=3000
    DATABASE_URI='mongodb://localhost:27017/loom-db'
    CLIENT_CHAIN_ID=default
    CLIENT_WRITE_URL='ws://68.183.20.43:46658/websocket'
    CLIENT_READ_URL='ws://68.183.20.43:9999/queryws'
    STARDUST_API_URL='http://68.183.20.43:3000'
    ```

1. Run project
    - Start the server:
    `pm2 start pm2.json`
    - To restart the server, run:
    `pm2 restart loom-backend`
