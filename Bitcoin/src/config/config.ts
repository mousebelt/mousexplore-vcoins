const config = {
	development: {
		PORT: 8001,

		QTUM_RPC_HOST: "127.0.0.1",
		QTUM_RPC_PORT: 18338,
		QTUM_RPC_USER: "bing",
		QTUM_RPC_PASS: "123",

		BTC_RPC_HOST: "127.0.0.1",
		BTC_RPC_PORT: 18332,
		BTC_RPC_USER: "igor",
		BTC_RPC_PASS: "123456",

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28338,
		LITE_RPC_USER: "litecoin",
		LITE_RPC_PASS: "123",

		DASH_RPC_HOST: "127.0.0.1",
		DASH_RPC_PORT: 38338,
		DASH_RPC_USER: "dash",
		DASH_RPC_PASS: "123",

		BCH_RPC_HOST: "127.0.0.1",
		BCH_RPC_PORT: 38338,
		BCH_RPC_USER: "dash",
		BCH_RPC_PASS: "123"
	},
	production: {
		PORT: 80,

		QTUM_RPC_HOST: "127.0.0.1",
		QTUM_RPC_PORT: 8338,
		QTUM_RPC_USER: "bing",
		QTUM_RPC_PASS: "123",

		BTC_RPC_HOST: "127.0.0.1",
		BTC_RPC_PORT: 18332,
		BTC_RPC_USER: "igor",
		BTC_RPC_PASS: "123456",

		LITE_RPC_HOST: "127.0.0.1",
		LITE_RPC_PORT: 28338,
		LITE_RPC_USER: "litecoin",
		LITE_RPC_PASS: "123",

		DASH_RPC_HOST: "127.0.0.1",
		DASH_RPC_PORT: 38338,
		DASH_RPC_USER: "dash",
		DASH_RPC_PASS: "123",

		BCH_RPC_HOST: "127.0.0.1",
		BCH_RPC_PORT: 38338,
		BCH_RPC_USER: "dash",
		BCH_RPC_PASS: "123"
	}
};

exports.get = function get(env) {
	return config[env] || config.development;
}