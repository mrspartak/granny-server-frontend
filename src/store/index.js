import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import state from '@/store/state';
import actions from '@/store/actions';
import getters from '@/store/getters';
import mutations from '@/store/mutations';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

let store = new Vuex.Store({
	state,
	actions,
	getters,
	mutations,
	plugins: [createPersistedState()],
});

export default store;
