export default {
	SET_APP_INITIATED: (state, payload) => {
		state.APP_INITIATED = payload;
	},
	SET_APP_ACCESS_TOKEN: (state, payload) => {
		state.ACCESS_TOKEN = payload;
	},
	SET_ME: (state, payload) => {
		state.me = payload;
	},
	SET_SERVER_TS: (state, payload) => {
		state.server_ts = payload;
	},
	SET_DOMAINS: (state, payload = []) => {
		state.domains = payload;
	},
	SET_USERS: (state, payload = []) => {
		state.users = payload;
	},
};
