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
    ```
    cd config
    cp mainnet.js.example mainnet.js
    ```
    Update config variables in the above file.

1. Run project
    - Start the server:
    `pm2 start pm2.json`
    - To restart the server, run:
    `pm2 restart loom-backend`
