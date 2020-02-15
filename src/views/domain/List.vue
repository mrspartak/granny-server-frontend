<template>
	<div>
		<h3>
			Domains
		</h3>

		<b-table class="mt-4" :striped="true" :borderless="true" :fields="fields" :items="domains">
			<template v-slot:cell(domain)="data">
				<b-link
					:to="{
						name: 'DomainView',
						params: { id: data.item.domain },
					}"
				>
					{{ data.item.domain }}
				</b-link>
			</template>

			<template v-slot:cell(users)="data">
				{{ data.item.users.length }}
			</template>

			<template v-slot:cell(actions)="data">
				<b-link
					:to="{
						name: 'DomainView',
						params: { id: data.item.domain },
					}"
				>
					View
				</b-link>
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	name: 'UserView',
	data() {
		return {
			fields: ['domain', 'users', 'actions'],
		};
	},
	async mounted() {
		await this.GET_DOMAIN_LIST();
	},
	computed: {
		...mapState(['domains']),
	},
	methods: {
		...mapActions(['GET_DOMAIN_LIST']),
	},
};
</script>
