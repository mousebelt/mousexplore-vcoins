const config = {
	development: {
		PORT: 8001,

		BCH_RPC_HOST: "127.0.0.1",
		BCH_RPC_PORT: 38338,
		BCH_RPC_USER: "cash",
		BCH_RPC_PASS: "123"
	},
	production: {
		PORT: 80,

		BCH_RPC_HOST: "127.0.0.1",
		BCH_RPC_PORT: 38338,
		BCH_RPC_USER: "cash",
		BCH_RPC_PASS: "123"
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}