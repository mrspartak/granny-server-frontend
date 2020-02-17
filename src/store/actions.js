import granny from '../plugins/granny';

export default {
	async GET_DOMAIN_LIST({ commit, state }) {
		await granny.listDomains().then(([err, domains]) => {
			if (err) return;

			if (domains) commit('SET_DOMAINS', domains);
		});
	},
	async GET_USER_LIST({ commit, state }) {
		await granny.listUsers().then(([err, users]) => {
			if (err) return;

			if (users) commit('SET_USERS', users);
		});
	},
	async GET_ME({ commit, state }) {
		await granny.getMe().then(([err, me]) => {
			if (err) return;

			if (me) commit('SET_ME', me);
		});
	},
};
