<template>
	<b-form @submit.prevent="onSubmit">
		<b-form-group
			id="input-group-1"
			label="Domain:"
			label-for="input-1"
			description="Better use some sub domain for this."
		>
			<b-form-input
				id="input-1"
				v-model="form.domain"
				type="text"
				placeholder="cdb.example.com"
				required
			></b-form-input>
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
			form: {
				domain: '',
			},
		};
	},
	methods: {
		...mapActions(['GET_DOMAIN_LIST']),

		onSubmit() {
			if (!this.form.domain) return;

			this.$granny.addDomain({ domain: this.form.domain }).then(([err, result]) => {
				if (err)
					return this.$bvToast.toast(err.message, {
						title: 'Error',
						variant: 'danger',
					});

				this.GET_DOMAIN_LIST();
				this.$bvToast.toast('Domain added', {
					title: 'Success',
					variant: 'success',
				});
				this.$router.push({
					name: 'DomainView',
					params: { id: result.domain },
				});
			});
		},
	},
};
</script>
