import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/';

Vue.use(VueRouter);

/*
  meta
	-
*/
const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		//main layout
		{
			path: '/',
			component: () => import('@/views/MainLayout'),
			children: [
				{
					name: 'Dashboard',
					path: '/',
					component: () => import('@/views/main/Dashboard'),
					meta: {
						requiresAuth: true,
						requiresInititate: true,
					},
				},
				{
					path: '/domain',
					component: () => import('@/views/domain/Layout'),
					children: [
						{
							name: 'DomainAdd',
							path: 'add',
							component: () => import('@/views/domain/Add'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},

						{
							name: 'DomainView',
							path: 'view/:id',
							component: () => import('@/views/domain/View'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},

						{
							name: 'DomainContent',
							path: 'content/:id',
							component: () => import('@/views/domain/Content'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},

						{
							name: 'DomainFile',
							path: 'file/:id',
							component: () => import('@/views/domain/File'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},
					],
				},

				{
					path: '/user',
					component: () => import('@/views/user/Layout'),
					children: [
						{
							name: 'UserList',
							path: 'list',
							component: () => import('@/views/user/List'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},

						{
							name: 'UserAdd',
							path: 'add',
							component: () => import('@/views/user/Add'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},

						{
							name: 'UserView',
							path: 'view/:id',
							component: () => import('@/views/user/View'),
							meta: {
								requiresAuth: true,
								requiresInititate: true,
							},
						},
					],
				},
			],
		},

		//empty layout
		{
			path: '/util',
			component: () => import('@/views/EmptyLayout'),
			children: [
				{
					name: 'Login',
					path: 'login',
					component: () => import('@/views/empty/Login'),
					meta: {
						requiresInititate: true,
						requiresNotAuth: true,
					},
				},
				{
					name: 'Setup',
					path: 'setup',
					component: () => import('@/views/empty/Setup'),
					meta: {
						requiresNotInititate: true,
					},
				},
			],
		},
		{
			path: '*',
			component: () => import('@/views/EmptyLayout'),
			children: [
				{
					path: '',
					component: () => import('@/views/empty/Error'),
				},
			],
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth) console.log('requiresAuth', to.fullPath, 'loggedIn: ' + store.state.ACCESS_TOKEN);
	if (to.meta.requiresInititate)
		console.log('requiresInititate', to.fullPath, 'appInitiated: ' + store.state.APP_INITIATED);
	if (to.meta.requiresNotAuth) console.log('requiresNotAuth', to.fullPath, 'loggedIn: ' + store.state.ACCESS_TOKEN);
	if (to.meta.requiresNotInititate)
		console.log('requiresNotInititate', to.fullPath, 'appInitiated: ' + store.state.APP_INITIATED);

	if (to.meta.requiresAuth && store.state.ACCESS_TOKEN == false) router.push('/util/login');
	if (to.meta.requiresInititate && store.state.APP_INITIATED == false) next({ path: '/util/setup' });

	if (to.meta.requiresNotInititate && store.state.APP_INITIATED == true) router.push('/util/login');
	if (to.meta.requiresNotAuth && store.state.ACCESS_TOKEN != false) next({ path: '/' });

	console.log('nothing');
	next();
});

export default router;
