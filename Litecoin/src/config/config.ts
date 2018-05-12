const config = {
	development: {
		PORT: 8001,

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28338,
		LITE_RPC_USER: "litecoin",
		LITE_RPC_PASS: "123",
	},
	production: {
		PORT: 80,

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28338,
		LITE_RPC_USER: "litecoin",
		LITE_RPC_PASS: "123",
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}