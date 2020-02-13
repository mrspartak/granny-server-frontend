import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from '../store';

axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.common['Authorization'] = store.state.ACCESS_TOKEN || '';

Vue.use(VueAxios, axios);
