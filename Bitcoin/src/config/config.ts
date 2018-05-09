const config = {
	development: {
		PORT: 8001,

		BTC_RPC_HOST: "127.0.0.1",
		BTC_RPC_PORT: 18332,
		BTC_RPC_USER: "igor",
		BTC_RPC_PASS: "123456",

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28338,
		LITE_RPC_USER: "litecoin",
		LITE_RPC_PASS: "123",
	},
	production: {
		PORT: 80,

		BTC_RPC_HOST: "127.0.0.1",
		BTC_RPC_PORT: 18332,
		BTC_RPC_USER: "igor",
		BTC_RPC_PASS: "123456",

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28338,
		LITE_RPC_USER: "litecoin",
		LITE_RPC_PASS: "123",
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}