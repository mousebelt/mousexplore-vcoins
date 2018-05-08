// define local node object
var neo = require('neo-api');
const localNode = neo.node('http://localhost:20332');
exports.localNode = localNode;

exports.getBlockCount = function (req, res) {
    localNode.getBlockCount().then(function (result) {
        console.log('Current block height: ' + result);
    }).catch(function (err) {
        console.log(err);
    });
    // localNode.getLastBlockHash().then(function (result) {
    //     console.log('Hash of last block: ' + result);
    // });
}
