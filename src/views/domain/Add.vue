<template>
	<b-form @submit.prevent="onSubmit">
		<b-row>
			<b-col lg="4" sm="12" xs="12">
				<b-form-group label="Domain:" description="Better use some sub domain for this. Like cdn.example.com">
					<b-form-input
						v-model="form.domain"
						type="text"
						placeholder="cdn.example.com"
						required
					></b-form-input>
				</b-form-group>
			</b-col>

			<b-col lg="4" sm="12" xs="12">
				<b-form-group
					label="S3 BucketName:"
					description="Use unique name to prevent dublicates. Default = Domain name"
				>
					<b-input-group>
						<b-input-group-prepend is-text>
							<b-form-checkbox switch class="mr-n2" v-model="bucketCustomName">
								<span class="sr-only">Checkbox for following text input</span>
							</b-form-checkbox>
						</b-input-group-prepend>

						<b-form-input
							v-model="form.bucketName"
							type="text"
							placeholder="cdn.example.com"
							:disabled="!bucketCustomName"
							required
						></b-form-input>

						<b-input-group-append>
							<b-button variant="outline-secondary" @click="createUniqueBucketName()"
								>Create unique</b-button
							>
						</b-input-group-append>
					</b-input-group>
				</b-form-group>
			</b-col>

			<b-col>
				<b-form-group label="Create bucket" description="You can create new bucket or use already existing one">
					<b-form-radio-group
						v-model="form.createBucket"
						:options="[
							{ text: 'Create', value: true },
							{ text: 'Use existing', value: false },
						]"
						name="radio-inline-bucket"
					></b-form-radio-group>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row class="mt-5">
			<b-col xs="12" lg="12" class="mt-">
				<b-form-group
					label="Use S3 setting passed to backend"
					description="You can pass any S3 endpoint here if you choose to pass custom settings"
				>
					<b-form-radio-group
						v-model="s3Default"
						:options="[
							{ text: 'Use default', value: true },
							{ text: 'Assign custom', value: false },
						]"
						name="radio-inline-s3"
					></b-form-radio-group>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row class="mt-2" v-if="!s3Default">
			<b-col lg="3" sm="6" xs="12">
				<b-form-group label="S3 endPoint:" description="Link to S3 endpoint. e.i. s3.amazonaws.com">
					<b-form-input
						v-model="form.s3.endPoint"
						type="text"
						placeholder="s3.amazonaws.com"
						required
					></b-form-input>
				</b-form-group>
			</b-col>

			<b-col lg="3" sm="6" xs="12">
				<b-form-group label="S3 accessKey:">
					<b-form-input v-model="form.s3.accessKey" type="text" placeholder="" required></b-form-input>
				</b-form-group>
			</b-col>

			<b-col lg="3" sm="6" xs="12">
				<b-form-group label="S3 secretKey:">
					<b-form-input v-model="form.s3.secretKey" type="text" placeholder="" required></b-form-input>
				</b-form-group>
			</b-col>

			<b-col lg="2" sm="6" xs="12">
				<b-form-group label="S3 port:" description="If you use local Minio, you can provide its port">
					<b-form-input v-model="form.s3.port" type="number"></b-form-input>
				</b-form-group>
			</b-col>

			<b-col lg="2" sm="6" xs="12">
				<b-form-group label="Use ssl connection:" description="Better use ssl">
					<b-form-radio-group
						v-model="form.s3.useSSL"
						:options="[
							{ text: 'Use SSL', value: true },
							{ text: 'Do not use SSL', value: false },
						]"
						name="radio-inline-ssl"
					></b-form-radio-group>
				</b-form-group>
			</b-col>
		</b-row>

		<b-button type="submit" variant="primary">Submit</b-button>
	</b-form>
</template>

<script>
import { mapActions } from 'vuex';
import randomWords from 'random-words';

export default {
	name: 'DomainAdd',
	data() {
		return {
			form: {
				domain: '',
				bucketName: '',
				s3: {
					endPoint: '',
					accessKey: '',
					secretKey: '',
					port: 0,
					useSSL: true,
				},
				createBucket: true,
			},
			bucketCustomName: false,
			s3Default: true,
		};
	},
	watch: {
		'form.domain': function() {
			if (!this.bucketCustomName) this.form.bucketName = this.form.domain;
		},
		bucketCustomName: function(newVal, oldVal) {
			if (newVal === false) this.form.bucketName = this.form.domain;
		},
	},
	methods: {
		...mapActions(['GET_DOMAIN_LIST']),

		onSubmit() {
			if (!this.form.domain) return;

			this.$granny
				.addDomain({
					domain: this.form.domain,
					bucket: this.form.bucketName,
					createBucket: this.form.createBucket,
					s3: this.form.s3,
				})
				.then(([err, result]) => {
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

		createUniqueBucketName() {
			if (!this.bucketCustomName) this.bucketCustomName = true;
			this.form.bucketName = randomWords({ exactly: 4, maxLength: 7 }).join('');
		},
	},
};
</script>
