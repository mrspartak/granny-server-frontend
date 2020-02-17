<template>
	<div>
		<b-breadcrumb>
			<b-breadcrumb-item
				:to="{
					name: 'DomainList',
				}"
			>
				Domains
			</b-breadcrumb-item>

			<b-breadcrumb-item>
				{{ domain.domain }}
			</b-breadcrumb-item>
		</b-breadcrumb>

		<h3>
			Domain: {{ domain.domain }}

			<b-button size="sm" variant="outline-primary" :to="{ name: 'DomainContent', id: domain.domain }"
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
		<b-row>
			<b-col lg="4" sm="6" xs="12">
				<b-form-group label="Referers. String of RegExp string for any string matching">
					<b-form-tags v-model="form.referer" class="mb-2"></b-form-tags>
					<b-button size="sm" variant="outline-secondary" class="mr-2" @click="form.referer = ['*']"
						>Allow all referals</b-button
					>
					<b-button size="sm" variant="outline-secondary" @click="form.referer.push('__allow_direct__')"
						>Allow direct access</b-button
					>
				</b-form-group>
			</b-col>

			<b-col xl="3" lg="4" sm="6" xs="12">
				<b-form-group label="Time to cache modified in hours. 0 = do not cache">
					<b-form-input v-model="form.ttl" type="number" min="0" number></b-form-input>
				</b-form-group>
			</b-col>

			<b-col xl="3" lg="4" sm="6" xs="12">
				<b-form-group label="Max size in bytes of domain bucket. 0 = unlimited">
					<b-form-input
						v-model="form.maxSize"
						type="number"
						min="0"
						number
						:disabled="me.role != 'admin'"
					></b-form-input>
				</b-form-group>
			</b-col>

			<b-col xs="12" xl="12" v-if="users.length">
				<b-form-group label="Users []">
					<b-form-select v-model="form.users" :multiple="true" :select-size="10">
						<b-form-select-option v-for="user in users" :value="user._id">{{
							user.login
						}}</b-form-select-option>
					</b-form-select>
				</b-form-group>
			</b-col>

			<b-col xs="12" xl="12">
				<b-button type="submit" variant="primary" @click.prevent="editItem()">Save</b-button>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
	name: 'DomainView',
	data() {
		return {
			showKeys: false,
			form: {
				users: [],
				referer: [],
				ttl: null,
				maxSize: null,
			},
			_form: {},
		};
	},
	beforeMount() {
		this.setupAPI();
	},
	mounted() {
		this._form = Object.assign({}, this.form);
		this.resetForm();
	},
	watch: {
		'$route.params.id'() {
			this.setupAPI();
		},
	},
	computed: {
		...mapState(['domains']),
		...mapState(['users']),
		...mapState(['me']),

		domain: function() {
			return this.domains.find(domain => domain.domain == this.$route.params.id);
		},
	},
	methods: {
		...mapActions(['GET_DOMAIN_LIST']),

		setupAPI() {
			this.$granny.setOptions({
				accessKey: this.domain.accessKey,
				accessSecret: this.domain.accessSecret,
			});
		},

		async editItem() {
			var [err, result] = await this.$granny.editDomain(
				Object.assign(
					{
						domain: this.domain.domain,
					},
					this.form,
				),
			);

			if (err)
				return this.$bvToast.toast(err.message, {
					title: 'Error',
					variant: 'danger',
				});

			this.$bvToast.toast('Domain edited', {
				title: 'Success',
				variant: 'success',
			});

			await this.GET_DOMAIN_LIST();
			this.resetForm();
		},

		regenerateKeys() {
			if (!confirm('Are you sure you want to regenerate keys?')) return;

			alert('Currently this is in development');
			//todo
		},

		resetForm() {
			this.form = Object.assign(this._form, {
				users: this.domain.users,
				referer: this.domain.settings.referer,
				ttl: this.domain.settings.ttl,
				maxSize: this.domain.adminSettings.maxSize,
			});
		},
	},
};
</script>
