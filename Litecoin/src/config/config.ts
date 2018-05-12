const config = {
	development: {
		PORT: 8001,

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28332,
		LITE_RPC_USER: "rpcuser",
		LITE_RPC_PASS: "pwd",
	},
	production: {
		PORT: 80,

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28332,
		LITE_RPC_USER: "rpcuser",
		LITE_RPC_PASS: "pwd",
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}