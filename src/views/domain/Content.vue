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

			<b-button size="sm" variant="outline-primary" :to="{ name: 'DomainView', id: domain.domain }"
				>View info</b-button
			>
		</h3>

		<b-form class="mt-4">
			<b-row>
				<b-col>
					<label>Select path for file</label>
					<b-input-group>
						<b-input v-model="form.path" :disabled="!form.file"></b-input>
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

		<b-table-simple class="mt-4" small responsive striped borderless>
			<b-thead>
				<b-tr>
					<b-th>Name</b-th>
					<b-th class="text-right">Size Original</b-th>
					<b-th class="text-right">Size Total</b-th>
					<b-th class="text-right">Files Inside</b-th>
					<b-th class="text-center">Actions</b-th>
				</b-tr>
			</b-thead>
			<b-tbody>
				<b-tr v-for="item in items">
					<b-td>
						<div v-if="item.type == 'folder'">
							<b-link
								:to="{
									name: 'DomainContent',
									params: { id: $route.params.id },
									query: { path: getPath() + '/' + item.path },
								}"
							>
								<b><b-icon-folder scale="1.5" class="mr-1"></b-icon-folder> {{ item.path }}</b>
							</b-link>
						</div>
						<div v-else>
							<b-link
								:to="{
									name: 'DomainFile',
									params: { id: $route.params.id },
									query: { path: getPath() + '/' + item.path },
								}"
							>
								<b-icon-image scale="1.5" class="mr-1"></b-icon-image> {{ item.path }}
							</b-link>
						</div>
					</b-td>

					<b-td class="text-right">{{ formatBytes(item.size.original) }}</b-td>
					<b-td class="text-right">
						{{
							formatBytes(
								Object.values(item.size).reduce(
									(accumulator, currentValue) => accumulator + currentValue,
								),
							)
						}}
					</b-td>

					<b-td class="text-right">{{ item.items }}</b-td>

					<b-td class="text-center">
						<b-button
							v-if="item.type == 'file'"
							size="sm"
							variant="outline-danger"
							@click="deleteImage(getPath() + '/' + item.path)"
						>
							Delete
						</b-button>
					</b-td>
				</b-tr>
			</b-tbody>
			<b-tfoot>
				<b-tr>
					<b-th colspan="2" variant="secondary" class="text-right" v-if="items">
						{{
							formatBytes(
								items.reduce(
									(accumulator, currentValue) => accumulator + currentValue.size.original,
									0,
								),
							)
						}}
					</b-th>
					<b-th variant="secondary" class="text-right">
						{{
							formatBytes(
								items.reduce((accumulator, currentValue) => {
									return (
										accumulator +
										Object.values(currentValue.size).reduce((acc, curr) => acc + curr, 0)
									);
								}, 0),
							)
						}}
					</b-th>
					<b-th colspan="2" variant="secondary" class="text-right"></b-th>
				</b-tr>
			</b-tfoot>
		</b-table-simple>
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
			fields: ['name', 'size_original', 'size_total', 'files_inside', 'actions'],
		};
	},
	beforeMount() {
		this.setupAPI();
	},
	mounted() {
		this.getDirectoryContent();
		this.setFormPath();
	},
	watch: {
		'$route.query.path'() {
			console.log('watch.query.path');
			this.getDirectoryContent();
			this.setFormPath();
		},
		'$route.params.id'() {
			console.log('watch.params.id');
			this.setupAPI();
			this.getDirectoryContent();
			this.setFormPath();
		},
		'form.file'() {
			this.setFormPath();
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

		async deleteImage(path) {
			if (!confirm('Are you sure you want to delete ' + path + '?')) return false;

			var [err, deleted] = await this.$granny.deleteImage({ path });
			if (err) {
				return this.$bvToast.toast(err.message, {
					title: 'Error',
					variant: 'danger',
				});
			}

			this.$bvToast.toast('Image deleted!', {
				title: 'Success',
				variant: 'success',
			});
			this.getDirectoryContent();
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

		setFormPath() {
			this.form.path =
				'/' + (this.getPath() ? this.getPath() + '/' : '') + (this.form.file ? this.form.file.name : '');
		},

		formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		},
	},
};
</script>
