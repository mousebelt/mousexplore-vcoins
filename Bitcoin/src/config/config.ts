const config = {
	development: {
		PORT: 8001,

		BTC_RPC_HOST: "127.0.0.1",
		BTC_RPC_PORT: 18332,
		BTC_RPC_USER: "rpcuser",
		BTC_RPC_PASS: "pwd",
	},
	production: {
		PORT: 80,

		BTC_RPC_HOST: "127.0.0.1",
		BTC_RPC_PORT: 18332,
		BTC_RPC_USER: "rpcuser",
		BTC_RPC_PASS: "pwd",
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}