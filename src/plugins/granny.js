import Vue from 'vue';
import store from '../store/';
import router from '../router/';
var Granny = require('granny');

var granny = new Granny({
	//domain: window._env.granny_url
});

granny.on('logged_out', () => {
	store.commit('SET_APP_ACCESS_TOKEN', '');
	router.push({ name: 'Login' });
});

export default granny;
