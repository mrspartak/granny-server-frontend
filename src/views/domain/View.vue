<template>
	<div>
		<h3>
			Domain: {{ domain.domain }}

			<b-button variant="outline-primary" :to="{ name: 'DomainContent', id: domain.domain }"
				>View content</b-button
			>
		</h3>

		<b-row class="mt-5">
			<b-col>
				<label>Access key</label>
				<b-input
					readonly
					class="mb-2 mr-sm-3 mb-sm-0"
					:value="showKeys ? domain.accessKey : '********************'"
				></b-input>
			</b-col>
			<b-col>
				<label>Access secret</label>
				<b-input
					readonly
					class="mb-2 mr-sm-3 mb-sm-0"
					:value="showKeys ? domain.accessSecret : '********************'"
				></b-input>
			</b-col>
			<b-col cols="3">
				<label></label><br />
				<b-button variant="outline-secondary mr-sm-3" @click="showKeys = !showKeys"
					>Toggle keys vision</b-button
				>
				<b-button variant="outline-danger" @click="regenerateKeys">Regenerate keys</b-button>
			</b-col>
		</b-row>

		<h4 class="mt-5">Settings</h4>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'DomainView',
	data() {
		return {
			showKeys: false,
		};
	},
	beforeMount() {
		this.setupAPI();
	},
	watch: {
		'$route.params.id'() {
			console.log('watch.params.id');
			this.setupAPI();
		},
	},
	computed: {
		...mapState(['domains']),

		domain: function() {
			return this.domains.find(domain => domain.domain == this.$route.params.id);
		},
	},
	methods: {
		setupAPI() {
			this.$granny.setOptions({
				accessKey: this.domain.accessKey,
				accessSecret: this.domain.accessSecret,
			});
		},

		regenerateKeys() {
			if (!confirm('Are you sure you want to regenerate keys?')) return;

			alert('Currently this is in development');
			//todo
		},
	},
};
</script>
