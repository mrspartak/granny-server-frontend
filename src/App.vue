<template>
	<router-view></router-view>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
	name: 'App',
	mounted() {
		setInterval(async () => {
			var [err, status] = await this.$granny.getStatus();
			this.SET_SERVER_TS(status.ts);
		}, 60 * 1000);
	},
	methods: {
		...mapMutations(['SET_SERVER_TS']),
	},
};
</script>
