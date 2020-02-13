<template>
	<router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'App',
	mounted() {
		this.GET_DOMAIN_LIST();
	},
	methods: {
		...mapActions(['GET_DOMAIN_LIST']),
	},
};
</script>
