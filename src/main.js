import Vue from 'vue';
import router from './router/';
import store from './store/';

import './plugins/bootstrap';
import './plugins/helpers';
import granny from './plugins/granny';

import App from './App.vue';

granny.setAccessToken(store.state.ACCESS_TOKEN);

fetch('/cfg/settings.json')
	.then(response => response.json())
	.then(data => {
		granny.setDomain(data.granny_url);
		Vue.prototype.$granny = granny;
		Vue.config.productionTip = false;

		granny.getStatus().then(async ([err, status]) => {
			if (err) {
				alert('ERROR', err);
				console.log(err);
			}

			store.commit('SET_APP_INITIATED', status.APP_INITIATED);
			store.commit('SET_SERVER_TS', status.ts);

			if (!status.auth) store.commit('SET_APP_ACCESS_TOKEN', '');
			else store.dispatch('GET_ME');

			new Vue({
				router,
				store,
				render: h => h(App),
			}).$mount('#app');
		});
	});
