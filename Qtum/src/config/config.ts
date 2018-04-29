const config = {
	development: {
		PORT: 8001,

		QTUM_RPC_HOST: "127.0.0.1",
		QTUM_RPC_PORT: 18338,
		QTUM_RPC_USER: "bing",
		QTUM_RPC_PASS: "123"

	},
	production: {
		PORT: 80,

		QTUM_RPC_HOST: "127.0.0.1",
		QTUM_RPC_PORT: 8338,
		QTUM_RPC_USER: "bing",
		QTUM_RPC_PASS: "123"

	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}