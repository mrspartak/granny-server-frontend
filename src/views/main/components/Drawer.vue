<template>
	<nav id="sidebar">
		<div class="sidebar-header">
			<h3>Granny</h3>
			<strong>BS</strong>
		</div>

		<ul class="list-unstyled components">
			<li class="active">
				<b-link :to="{ name: 'Dashboard' }">
					<b-icon-window></b-icon-window>
					Dashboard
				</b-link>
			</li>
		</ul>

		<ul class="list-unstyled components">
			<li>
				<b-link :to="{ name: 'DomainList' }">
					<b-icon-list></b-icon-list>
					Domains
				</b-link>
			</li>
			<li>
				<b-link :to="{ name: 'DomainAdd' }" v-if="me.settings.canAddDomains">
					<b-icon-plus></b-icon-plus>
					Add
				</b-link>
			</li>
		</ul>

		<ul class="list-unstyled components" v-if="me.role == 'admin' && users.length">
			<li>
				<b-link :to="{ name: 'UserList' }">
					<b-icon-list></b-icon-list>
					Users
				</b-link>
			</li>
			<li>
				<b-link :to="{ name: 'UserAdd' }">
					<b-icon-plus></b-icon-plus>
					Add
				</b-link>
			</li>
		</ul>

		<ul class="list-unstyled components">
			<li>
				<b-link @click.prevent="logout()"> <b-icon-box-arrow-right></b-icon-box-arrow-right> Logout </b-link>
			</li>
		</ul>
	</nav>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	name: 'MainDrawer',

	computed: {
		...mapState(['domains']),
		...mapState(['users']),
		...mapState(['me']),
	},
	methods: {
		...mapMutations(['SET_APP_ACCESS_TOKEN']),
		logout() {
			this.SET_APP_ACCESS_TOKEN('');
			this.$router.push({ name: 'Login' });
		},
	},
};
</script>

<style type="text/css" scoped>
#sidebar {
	min-width: 250px;
	max-width: 250px;
	background: #7386d5;
	color: #fff;
	transition: all 0.3s;
}

#sidebar.active {
	min-width: 80px;
	max-width: 80px;
	text-align: center;
}

#sidebar.active .sidebar-header h3,
#sidebar.active .CTAs {
	display: none;
}

#sidebar.active .sidebar-header strong {
	display: block;
}

#sidebar ul li a {
	text-align: left;
}

#sidebar.active ul li a {
	padding: 20px 10px;
	text-align: center;
	font-size: 0.85em;
}

#sidebar.active ul li a i {
	margin-right: 0;
	display: block;
	font-size: 1.8em;
	margin-bottom: 5px;
}

#sidebar.active ul ul a {
	padding: 10px !important;
}

#sidebar.active .dropdown-toggle::after {
	top: auto;
	bottom: 10px;
	right: 50%;
	-webkit-transform: translateX(50%);
	-ms-transform: translateX(50%);
	transform: translateX(50%);
}

#sidebar .sidebar-header {
	padding: 20px;
	background: #6d7fcc;
}

#sidebar .sidebar-header strong {
	display: none;
	font-size: 1.8em;
}

#sidebar ul.components {
	padding: 20px 0;
	border-bottom: 1px solid #47748b;
}

#sidebar ul li a {
	padding: 10px;
	font-size: 1.1em;
	display: block;
}

#sidebar ul li a:hover {
	color: #7386d5;
	background: #fff;
}

#sidebar ul li a i {
	margin-right: 10px;
}

#sidebar ul li.active > a,
a[aria-expanded='true'] {
	color: #fff;
	background: #6d7fcc;
}

a[data-toggle='collapse'] {
	position: relative;
}

.dropdown-toggle::after {
	display: block;
	position: absolute;
	top: 50%;
	right: 20px;
	transform: translateY(-50%);
}

ul ul a {
	font-size: 0.9em !important;
	padding-left: 30px !important;
	background: #6d7fcc;
}

ul.CTAs {
	padding: 20px;
}

ul.CTAs a {
	text-align: center;
	font-size: 0.9em !important;
	display: block;
	border-radius: 5px;
	margin-bottom: 5px;
}

a.download {
	background: #fff;
	color: #7386d5;
}

a.article,
a.article:hover {
	background: #6d7fcc !important;
	color: #fff !important;
}
</style>
