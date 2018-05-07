// define local node object
var neo = require('neo.node.js');
const localNode = neo.node('http://localhost:20332');
exports.localNode = localNode;

exports.getBlockCount = function (req, res) {
    localNode.getBlockCount().then(function (result) {
        console.log('Current block height: ' + result);
    });
    localNode.getLastBlockHash().then(function (result) {
        console.log('Hash of last block: ' + result);
    });
}
