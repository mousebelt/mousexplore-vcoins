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
    CLIENT_WRITE_URL='loom_chain_write_url'
    CLIENT_READ_URL='loom_chain_read_url'
    STARDUST_API_URL=
    ```

1. Run project
    - Start the server:
    `pm2 start pm2.json`
    - To restart the server, run:
    `pm2 restart loom-backend`
