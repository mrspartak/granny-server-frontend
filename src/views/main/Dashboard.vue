<template>
	<div>
		<h3>Dashboard</h3>
		<b-card-group deck>
			<b-card bg-variant="light" header="Domains" class="text-center">
				<b-card-text>
					<b-link :to="{ name: 'DomainList' }"> Domains added {{ domains.length }} </b-link><br />
					<b>Tolal size: {{ totalDomainSize }}</b>
				</b-card-text>
			</b-card>

			<b-card bg-variant="light" header="Users" class="text-center" v-if="me.role == 'admin'">
				<b-card-text>
					<b-link :to="{ name: 'UsersList' }"> Users added {{ users.length }} </b-link>
				</b-card-text>
			</b-card>
		</b-card-group>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'Dashboard',

	computed: {
		...mapState(['domains']),
		...mapState(['users']),
		...mapState(['me']),

		totalDomainSize() {
			return this.formatBytes(
				this.domains.reduce((acc, data) => {
					return acc + data.size;
				}, 0),
			);
		},
	},
};
</script>
