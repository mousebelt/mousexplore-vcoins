const config = {
	development: {
		PORT: 8001,

		LTC_RPC_HOST: "127.0.0.1",
		LTC_RPC_PORT: 28332,
		LTC_RPC_USER: "rpcuser",
		LTC_RPC_PASS: "pwd",
	},
	production: {
		PORT: 80,

		LTC_RPC_HOST: "127.0.0.1",
		LTC_RPC_PORT: 28332,
		LTC_RPC_USER: "rpcuser",
		LTC_RPC_PASS: "pwd",
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}