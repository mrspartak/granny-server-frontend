<template>
	<div>
		<h3>
			Users
		</h3>

		<b-table class="mt-4" :striped="true" :borderless="true" :fields="fields" :items="users">
			<template v-slot:cell(login)="data">
				<b-link
					:to="{
						name: 'UserView',
						params: { id: data.item.login },
					}"
				>
					{{ data.item.login }}
				</b-link>
			</template>

			<template v-slot:cell(domains)="data">
				{{ data.item.domains.length }}
			</template>

			<template v-slot:cell(actions)="data">
				<b-link
					:to="{
						name: 'UserView',
						params: { id: data.item.login },
					}"
				>
					View
				</b-link>
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'UserView',
	data() {
		return {
			fields: ['login', 'role', 'domains', 'actions'],
		};
	},
	computed: {
		...mapState(['users']),
	},
	methods: {},
};
</script>
