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

			<template v-slot:cell(size)="data">
				<div
					:class="{
						'text-danger':
							data.item.adminSettings.maxSize > 0 && data.item.size > data.item.adminSettings.maxSize,
					}"
				>
					{{ formatBytes(data.item.size) }}
					<span v-if="data.item.adminSettings.maxSize > 0">
						/ {{ formatBytes(data.item.adminSettings.maxSize) }}</span
					>
				</div>
			</template>

			<template v-slot:cell(actions)="data">
				<b-button
					class="mr-2"
					size="sm"
					variant="outline-dark"
					:to="{
						name: 'DomainView',
						params: { id: data.item.domain },
					}"
				>
					View
				</b-button>

				<b-button
					class="mr-2"
					size="sm"
					variant="outline-dark"
					:to="{
						name: 'DomainContent',
						params: { id: data.item.domain },
					}"
				>
					Content
				</b-button>

				<b-button size="sm" variant="outline-danger" @click="deleteDomain(data.item.domain)">
					Delete
				</b-button>
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
			fields: ['domain', 'users', 'size', 'actions'],
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

		async deleteDomain(domain) {
			let confirmed = prompt('Please type domain name if you agree to delete domain and all its data');
			if (!confirmed) return;
			if (confirmed.trim().toLocaleLowerCase() !== domain) return;

			var [err, deleted] = await this.$granny.deleteDomain({ domain });
			if (err) {
				return this.$bvToast.toast(err.message, {
					title: 'Error',
					variant: 'danger',
				});
			}

			this.$bvToast.toast('Domain will be soon deleted', {
				title: 'Success',
				variant: 'success',
			});
			await this.GET_DOMAIN_LIST();
		},
	},
};
</script>
