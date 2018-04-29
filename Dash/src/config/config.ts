const config = {
	development: {
		PORT: 8001,

		DASH_RPC_HOST: "127.0.0.1",
		DASH_RPC_PORT: 38338,
		DASH_RPC_USER: "dash",
		DASH_RPC_PASS: "123"
	},
	production: {
		PORT: 80,

		DASH_RPC_HOST: "127.0.0.1",
		DASH_RPC_PORT: 38338,
		DASH_RPC_USER: "dash",
		DASH_RPC_PASS: "123"
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}