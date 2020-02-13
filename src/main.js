import Vue from 'vue';
import App from './App.vue';
import router from './router/';
import store from './store/';

import './plugins/bootstrap';
import granny from './plugins/granny';

granny.setAccessToken(store.state.ACCESS_TOKEN);

fetch('/cfg/settings.json')
	.then(response => response.json())
	.then(data => {
		granny.setDomain(data.granny_url);
		Vue.prototype.$granny = granny;
		Vue.config.productionTip = false;

		granny.getStatus().then(([err, status]) => {
			if (err) {
				alert('ERROR', err);
				console.log(err);
			}

			store.commit('SET_APP_INITIATED', status.APP_INITIATED);
			if (!status.auth) store.commit('SET_APP_ACCESS_TOKEN', '');

			new Vue({
				router,
				store,
				render: h => h(App),
			}).$mount('#app');
		});
	});
