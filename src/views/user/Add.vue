<template>
	<b-form @submit.prevent="onSubmit">
		<b-form-group label="Login:">
			<b-form-input v-model="form.login" type="text" required></b-form-input>
		</b-form-group>

		<b-form-group label="Password:">
			<b-form-input v-model="form.password" type="password" required></b-form-input>
		</b-form-group>

		<b-form-group label="Role:">
			<b-form-select v-model="form.role" :options="roles"></b-form-select>
		</b-form-group>

		<b-button type="submit" variant="primary">Submit</b-button>
	</b-form>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'DomainAdd',
	data() {
		return {
			roles: [
				{ value: null, text: 'Please select role' },
				{ value: 'admin', text: 'Admin. Will get access to whole panel' },
				{ value: 'client', text: 'Client. Will get access only to his domains' },
			],
			form: {
				login: '',
				password: '',
				role: null,
			},
		};
	},
	methods: {
		...mapActions(['GET_USER_LIST']),

		onSubmit() {
			if (!this.form.login)
				return this.$bvToast.toast('No login provided', {
					title: 'Error',
					variant: 'danger',
				});

			if (!this.form.password)
				return this.$bvToast.toast('No password provided', {
					title: 'Error',
					variant: 'danger',
				});

			this.$granny.addUser(this.form).then(([err, result]) => {
				if (err)
					return this.$bvToast.toast(err.message, {
						title: 'Error',
						variant: 'danger',
					});

				this.GET_USER_LIST();
				this.$bvToast.toast('User added', {
					title: 'Success',
					variant: 'success',
				});
				this.$router.push({
					name: 'UserView',
					params: { id: result.login },
				});
			});
		},
	},
};
</script>
