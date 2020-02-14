<template>
	<div>
		<h3 class="mb-4">
			Domain: {{ domain.domain }}

			<b-button variant="outline-primary" :to="{ name: 'DomainView', id: domain.domain }">View info</b-button>
		</h3>

		<b-breadcrumb>
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

			<b-breadcrumb-item>
				<b>{{ fileName }}</b>
			</b-breadcrumb-item>
		</b-breadcrumb>

		<div>
			<h5>
				Orinal image: <small>{{ originalSrc }}</small>
			</h5>
			<b-img fluid :src="originalSrc"></b-img>

			<h5 class="mt-5">
				Modified image: <small>{{ modifiedSrc }}</small>
			</h5>
			<b-form>
				<b-form-group label="Width">
					<b-form-input v-model="modifications.width" trim></b-form-input>
				</b-form-group>

				<b-form-group label="Height">
					<b-form-input v-model="modifications.height" trim></b-form-input>
				</b-form-group>

				<b-form-group label="Quality [1-100]">
					<b-form-input v-model="modifications.quality" trim></b-form-input>
				</b-form-group>

				<b-form-group label="Blur [1-1000]">
					<b-form-input v-model="modifications.blur" trim></b-form-input>
				</b-form-group>

				<b-form-group label="Format">
					<b-form-select v-model="modifications.format" :options="formatTypes"></b-form-select>
				</b-form-group>

				<b-button type="submit" variant="primary" @click.prevent="modifiedSrcApplied = modifiedSrc"
					>Show modified image</b-button
				>
			</b-form>
			<b-img class="mt-2" fluid v-if="modifiedSrcApplied" :src="modifiedSrcApplied"></b-img>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'DomainView',
	data() {
		return {
			formatTypes: [
				{ value: null, text: 'Please select image format' },
				{ value: 'jpeg', text: 'JPEG' },
				{ value: 'png', text: 'PNG' },
				{ value: 'webp', text: 'WEBP' },
			],
			modifications: {
				width: null,
				height: null,
				quality: null,
				blur: null,
				format: null,
			},
			modifiedSrcApplied: false,
		};
	},
	beforeMount() {
		this.setupAPI();
	},
	computed: {
		...mapState(['domains']),

		domain: function() {
			return this.domains.find(domain => domain.domain == this.$route.params.id);
		},

		fileName: function() {
			let path = this.getPath();
			let splited = path.split('/');

			return splited.pop();
		},

		originalSrc: function() {
			let port = process.env.NODE_ENV == 'development' ? ':3001' : '';

			return '//' + this.domain.domain + port + '/i/' + this.getPath();
		},

		modifiedSrc: function() {
			let port = process.env.NODE_ENV == 'development' ? ':3001' : '';

			let modPathArray = [];
			Object.keys(this.modifications).forEach(key => {
				if (this.modifications[key]) modPathArray.push(`${key}=${this.modifications[key]}`);
			});
			let modPath = modPathArray.length ? modPathArray.join(',') : '';

			return '//' + this.domain.domain + port + '/i/' + (modPath ? modPath + '/_/' : '') + this.getPath();
		},

		pathSplited: function() {
			let path = this.getPath();

			let splited = path.split('/');
			splited.pop();
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
