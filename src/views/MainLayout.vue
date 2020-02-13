<template>
	<div id="main">
		<div class="wrapper">
			<!-- <Header /> -->
			<Drawer />

			<div id="content">
				<nav class="navbar navbar-expand-lg navbar-light bg-light">
					<div class="container-fluid">
						<div class="collapse navbar-collapse" id="navbarSupportedContent">
							<ul class="nav navbar-nav ml-auto">
								<li class="nav-item active">
									<b-nav-item @click.prevent="logout()">
										<b-icon-box-arrow-right></b-icon-box-arrow-right> Logout
									</b-nav-item>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<transition name="fade" mode="out-in"><router-view></router-view></transition>
			</div>
		</div>
	</div>
</template>

<script>
import Header from './main/components/Header';
import Drawer from './main/components/Drawer';
import { mapMutations } from 'vuex';

export default {
	name: 'MainLayout',
	methods: {
		...mapMutations(['SET_APP_ACCESS_TOKEN']),
		logout() {
			this.SET_APP_ACCESS_TOKEN('');
			this.$router.push({ name: 'Login' });
		},
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
	#sidebar {
		min-width: 80px;
		max-width: 80px;
		text-align: center;
		margin-left: -80px !important;
	}
	.dropdown-toggle::after {
		top: auto;
		bottom: 10px;
		right: 50%;
		-webkit-transform: translateX(50%);
		-ms-transform: translateX(50%);
		transform: translateX(50%);
	}
	#sidebar.active {
		margin-left: 0 !important;
	}
	#sidebar .sidebar-header h3,
	#sidebar .CTAs {
		display: none;
	}
	#sidebar .sidebar-header strong {
		display: block;
	}
	#sidebar ul li a {
		padding: 20px 10px;
	}
	#sidebar ul li a span {
		font-size: 0.85em;
	}
	#sidebar ul li a i {
		margin-right: 0;
		display: block;
	}
	#sidebar ul ul a {
		padding: 10px !important;
	}
	#sidebar ul li a i {
		font-size: 1.3em;
	}
	#sidebar {
		margin-left: 0;
	}
	#sidebarCollapse span {
		display: none;
	}
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
