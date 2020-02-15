<template>
	<div>
		<b-breadcrumb>
			<b-breadcrumb-item
				:to="{
					name: 'UserList',
				}"
			>
				Users
			</b-breadcrumb-item>

			<b-breadcrumb-item>
				{{ user.login }}
			</b-breadcrumb-item>
		</b-breadcrumb>

		<h3>User: {{ user.login }}</h3>

		<h4 class="mt-5">Settings</h4>
		<b-row>
			<b-col xl="3" lg="4" sm="6" xs="12">
				<b-form-group label="Password">
					<b-form-input v-model="form.password" type="password" trim></b-form-input>
				</b-form-group>
			</b-col>
			<b-col xl="3" lg="4" sm="6" xs="12">
				<b-form-group label="Role">
					<b-form-select v-model="form.role" :options="roles"></b-form-select>
				</b-form-group>
			</b-col>

			<b-col xs="12" xl="12">
				<b-form-group label="Domains []">
					<b-form-select v-model="form.domains" :multiple="true" :select-size="10">
						<b-form-select-option v-for="domain in domains" :value="domain._id">{{
							domain.domain
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
	name: 'UserView',
	data() {
		return {
			showKeys: false,
			roles: [
				{ value: null, text: 'Please select role' },
				{ value: 'admin', text: 'Admin. Will get access to whole panel' },
				{ value: 'client', text: 'Client. Will get access only to his domains' },
			],
			form: {
				password: null,
				role: null,
				domains: [],
			},
			_form: {},
		};
	},
	mounted() {
		this._form = Object.assign({}, this.form);
		this.resetForm();
	},
	computed: {
		...mapState(['users']),
		...mapState(['domains']),

		user: function() {
			return this.users.find(user => user.login == this.$route.params.id);
		},
	},
	methods: {
		...mapActions(['GET_USER_LIST']),

		async editItem() {
			var [err, result] = await this.$granny.editUser(
				Object.assign(
					{
						login: this.user.login,
					},
					this.form,
				),
			);

			if (err)
				return this.$bvToast.toast(err.message, {
					title: 'Error',
					variant: 'danger',
				});

			this.$bvToast.toast('User edited', {
				title: 'Success',
				variant: 'success',
			});

			await this.GET_USER_LIST();
			this.resetForm();
		},

		resetForm() {
			this.form = Object.assign(this._form, {
				role: this.user.role,
				domains: this.user.domains,
			});
		},
	},
};
</script>
