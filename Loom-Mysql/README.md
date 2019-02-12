# MouseXplore Loom Backend
![Alt text](/logo.png?raw=true "Logo")


This is the MouseXplore Loom Backend.


# Environment
* install node
* install mysql
* npm install


# Run Backend

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
    `pm2 restart loomexplorer-backend`
