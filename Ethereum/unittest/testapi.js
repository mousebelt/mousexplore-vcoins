var EthereumController = require('../controllers/ethereum');

var req;
var res;

console.log("------------ test blocklist API -------------");
req = {
    body: {
        start_height: 3168614, 
        count: 100
    }
};

EthereumController.blocklist(req, res);
