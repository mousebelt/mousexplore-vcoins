var neo = require('neo-api');
const localNode = neo.node('http://localhost:20332');

module.exports = {
    localNode,

    db: "mongodb://localhost:27017/neodb",

    CRON_TIME_INTERVAL: 5000,	//if we decrease this to 100ms, cronservice has trouble after some time.
    CRON_TREAT_MAX_BLOCKS: 100
}
