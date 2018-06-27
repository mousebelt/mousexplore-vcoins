module.exports = {
    port: 80,

    rpc_port: 10332,
    rpc_host: "127.0.0.1",
    rpc_server: 'http://localhost:10332',

    db: "mongodb://localhost:27017/neo-db",

    TX_CRON_TIME: 200,	//if we decrease this to 100ms, cronservice has trouble after some time.
}
