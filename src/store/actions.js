import granny from '../plugins/granny';

export default {
	GET_DOMAIN_LIST({ commit, state }) {
		granny.listDomains().then(([err, domains]) => {
			if (err) return;

			if (domains) commit('SET_DOMAINS', domains);
		});
	},
};
