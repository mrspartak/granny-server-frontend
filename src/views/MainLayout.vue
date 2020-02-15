<template>
	<div id="main">
		<div class="wrapper">
			<!-- <Header /> -->
			<Drawer />

			<div id="content">
				<transition name="fade" mode="out-in"><router-view></router-view></transition>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

import Header from './main/components/Header';
import Drawer from './main/components/Drawer';

export default {
	name: 'MainLayout',
	mounted() {
		this.GET_DOMAIN_LIST();
		this.GET_USER_LIST();
	},
	methods: {
		...mapActions(['GET_DOMAIN_LIST', 'GET_USER_LIST']),
	},
	components: { Header, Drawer },
};
</script>

<style>
.wrapper {
	display: flex;
	align-items: stretch;
}
a,
a:hover,
a:focus {
	color: inherit;
	text-decoration: none;
	transition: all 0.3s;
}

.navbar {
	padding: 15px 10px;
	background: #fff;
	border: none;
	border-radius: 0;
	margin-bottom: 40px;
	box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
	box-shadow: none;
	outline: none !important;
	border: none;
}

.line {
	width: 100%;
	height: 1px;
	border-bottom: 1px dashed #ddd;
	margin: 40px 0;
}

i,
span {
	display: inline-block;
}

#content {
	width: 100%;
	padding: 20px;
	min-height: 100vh;
	transition: all 0.3s;
}

@media (max-width: 768px) {
}

.fade-enter-active,
.fade-leave-active {
	transition-duration: 0.1s;
	transition-property: opacity;
	transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
</style>
