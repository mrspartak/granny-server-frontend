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

			<b-breadcrumb-item
				:to="{
					name: 'DomainContent',
					params: { id: $route.params.id },
					query: { path: '/' },
				}"
			>
				{{ $route.params.id }}
			</b-breadcrumb-item>

			<b-breadcrumb-item
				v-for="path in pathSplited"
				:to="{
					name: 'DomainContent',
					params: { id: $route.params.id },
					query: { path: path.long },
				}"
			>
				{{ path.short }}
			</b-breadcrumb-item>
		</b-breadcrumb>

		<h3 class="mb-4">
			Domain: {{ domain.domain }}

			<b-button variant="outline-primary" :to="{ name: 'DomainView', id: domain.domain }">View info</b-button>
		</h3>

		<b-form class="mt-4">
			<b-row>
				<b-col>
					<label>Select path for file</label>
					<b-input-group>
						<b-input v-model="form.path"></b-input>
					</b-input-group>
				</b-col>

				<b-col>
					<label>Image to upload</label>
					<b-form-file v-model="form.file" accept="image/*"></b-form-file>
				</b-col>

				<b-col columns="3">
					<label></label><br />
					<b-button class="mt-2" type="submit" variant="outline-primary" @click.prevent="uploadImage()"
						>Upload</b-button
					>
				</b-col>
			</b-row>
		</b-form>

		<b-table class="mt-4" :striped="true" :borderless="true" :fields="fields" :busy="isBusy" :items="items">
			<template v-slot:table-busy>
				<div class="text-center text-danger my-2">
					<b-spinner class="align-middle"></b-spinner>
					<strong>Loading...</strong>
				</div>
			</template>

			<template v-slot:cell(name)="data">
				<div v-if="data.item.type == 'folder'">
					<b-link
						:to="{
							name: 'DomainContent',
							params: { id: $route.params.id },
							query: { path: getPath() + '/' + data.item.path },
						}"
					>
						<b><b-icon-folder scale="1.5" class="mr-1"></b-icon-folder> {{ data.item.path }}</b>
					</b-link>
				</div>
				<div v-else>
					<b-link
						:to="{
							name: 'DomainFile',
							params: { id: $route.params.id },
							query: { path: getPath() + '/' + data.item.path },
						}"
					>
						<b-icon-image scale="1.5" class="mr-1"></b-icon-image> {{ data.item.path }}
					</b-link>
				</div>
			</template>

			<template v-slot:cell(files_inside)="data">
				{{ data.item.items }}
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'DomainView',
	data() {
		return {
			form: {
				isBusy: false,
				path: this.getPath(),
				file: null,
			},
			items: [],
			isBusy: true,
			fields: ['name', 'files_inside'],
		};
	},
	beforeMount() {
		this.setupAPI();
	},
	mounted() {
		this.getDirectoryContent();
		this.form.path = '/' + (this.getPath() ? this.getPath() + '/' : '') + 'space.jpg';
	},
	watch: {
		'$route.query.path'() {
			console.log('watch.query.path');
			this.getDirectoryContent();
			this.form.path = '/' + (this.getPath() ? this.getPath() + '/' : '') + 'space.jpg';
		},
		'$route.params.id'() {
			console.log('watch.params.id');
			this.setupAPI();
			this.getDirectoryContent();
			this.form.path = '/' + (this.getPath() ? this.getPath() + '/' : '') + 'space.jpg';
		},
	},
	computed: {
		...mapState(['domains']),

		domain: function() {
			return this.domains.find(domain => domain.domain == this.$route.params.id);
		},

		pathSplited: function() {
			let path = this.getPath();

			let splited = path.split('/');
			let toReturn = [];

			let absolute = '';
			splited.forEach(subPath => {
				absolute = absolute + '/' + subPath;
				toReturn.push({
					short: subPath,
					long: absolute,
				});
			});

			return toReturn;
		},
	},
	methods: {
		async getDirectoryContent() {
			this.isBusy = true;

			var [err, content] = await this.$granny.listDirectory({
				path: this.getPath(),
			});

			let folders = [],
				files = [];
			content.structure.forEach(item => {
				if (item.type == 'file') files.push(item);
				if (item.type == 'folder') folders.push(item);
			});

			this.isBusy = false;
			this.items = [...folders, ...files];
		},

		async uploadImage() {
			this.form.isBusy = true;

			if (!this.form.path) {
				this.form.isBusy = false;
				return this.$bvToast.toast('Path must be specified', {
					title: 'Error',
					variant: 'danger',
				});
			}

			if (!this.form.file) {
				this.form.isBusy = false;
				return this.$bvToast.toast('Image must be provided', {
					title: 'Error',
					variant: 'danger',
				});
			}

			var [err, result] = await this.$granny.uploadImage({ path: this.form.path, image: this.form.file });
			if (err) {
				this.form.isBusy = false;
				return this.$bvToast.toast(err.message, {
					title: 'Error',
					variant: 'danger',
				});
			}

			this.$bvToast.toast('Image uploaded!', {
				title: 'Success',
				variant: 'success',
			});
			this.$router.push({
				name: 'DomainFile',
				params: { id: this.domain.domain },
				query: { path: result.imagePath },
			});
		},

		setupAPI() {
			this.$granny.setOptions({
				accessKey: this.domain.accessKey,
				accessSecret: this.domain.accessSecret,
			});
		},

		getPath() {
			let path = this.$route.query.path ? this.$route.query.path : '/';
			path = path.trim();
			path = path.replace(/\/+/, '/');
			path = this.trim(path, '/');
			path = this.trim(path, '\\');

			return path;
		},
		trim(string, char) {
			if (char === ']') char = '\\]';
			if (char === '\\') char = '\\\\';
			return string.replace(new RegExp('^[' + char + ']+|[' + char + ']+$', 'g'), '');
		},
	},
};
</script>
