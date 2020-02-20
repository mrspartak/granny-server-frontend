<template>
	<b-row>
		<b-col sm="12" md="8" offset-md="2" lg="6" offset-lg="3" xl="4" offset-xl="4">
			<b-jumbotron header="Granny JS" lead="Image Delivery Service">
				<p>Upload, Download, Manipulate images easily</p>

				<b-form>
					<b-form-group id="example-input-group-1" label="Login" label-for="example-input-1">
						<b-form-input
							id="example-input-1"
							name="example-input-1"
							v-model="$v.form.login.$model"
							:state="validateState('login')"
							aria-describedby="input-1-live-feedback"
						></b-form-input>

						<b-form-invalid-feedback id="input-1-live-feedback"
							>This is a required field and must be at least 6 characters.</b-form-invalid-feedback
						>
					</b-form-group>

					<b-form-group id="example-input-group-2" label="Password" label-for="example-input-2">
						<b-form-input
							id="example-input-2"
							name="example-input-2"
							v-model="$v.form.password.$model"
							:state="validateState('password')"
							aria-describedby="input-1-live-feedback"
							type="password"
						></b-form-input>

						<b-form-invalid-feedback id="input-2-live-feedback"
							>This is a required field and must be at least 6 characters.</b-form-invalid-feedback
						>
					</b-form-group>

					<b-button variant="primary" @click="login()">Login</b-button>
				</b-form>
			</b-jumbotron>
		</b-col>
	</b-row>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

export default {
	name: 'PagesLogin',
	data: () => ({
		form: {
			login: null,
			password: null,
		},
	}),
	validations: {
		form: {
			login: {
				required,
				minLength: minLength(6),
			},
			password: {
				required,
				minLength: minLength(6),
			},
		},
	},
	methods: {
		validateState(name) {
			const { $dirty, $error } = this.$v.form[name];
			return $dirty ? !$error : null;
		},
		validate() {
			this.$v.$touch();
			if (!this.$v.form.$anyError) this.login();
		},
		login() {
			this.$granny.login(this.form).then(([err, response]) => {
				if (err) return alert('Error: ' + err.message);

				this.$store.commit('SET_APP_ACCESS_TOKEN', response.accessToken);
				this.$store.dispatch('GET_ME');
				this.$router.push('/');
			});
		},
	},
	mixins: [validationMixin],
};
</script>
