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

			<b-breadcrumb-item>
				<b>{{ fileName }}</b>
			</b-breadcrumb-item>
		</b-breadcrumb>

		<h3 class="mb-4">
			Domain: {{ domain.domain }}

			<b-button size="sm" variant="outline-primary" :to="{ name: 'DomainView', id: domain.domain }"
				>View info</b-button
			>
		</h3>

		<b-row>
			<b-col xs="12" sm="12" lg="6" class="mb-5">
				<h5>
					Orinal image: <small>{{ originalSrc }}</small>
					<b-link :href="'//' + originalSrc" target="_blank"
						><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right
					></b-link>
				</h5>
				<p v-if="image">
					<b>{{ image.format }}</b> {{ image.original.width }}x{{ image.original.height }},
					{{ formatBytes(image.original.size) }}
				</p>
				<b-img fluid :src="'//' + originalSrc"></b-img>
			</b-col>

			<b-col xs="12" sm="12" lg="6">
				<h5>
					Modified images
				</h5>

				<b-table-simple class="mt-1" small responsive striped borderless caption-top v-if="image">
					<caption>
						Stored, modified images
					</caption>
					<b-thead>
						<b-tr>
							<b-th>Link</b-th>
							<b-th class="text-right">Size</b-th>
							<b-th class="text-right">Ttl</b-th>
						</b-tr>
					</b-thead>
					<b-tbody>
						<b-tr v-for="item in image.refChildren">
							<b-td>
								{{ modifiedSrc(item.modifications) }}
								<b-link :href="'//' + modifiedSrc(item.modifications)" target="_blank"
									><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right
								></b-link>
							</b-td>

							<b-td class="text-right">
								{{ formatBytes(item.size) }}
							</b-td>

							<b-td class="text-right">
								{{ item.ttl }}
							</b-td>
						</b-tr>
					</b-tbody>
				</b-table-simple>

				<p class="mt-4">
					<b>Long syntax:</b> {{ modifiedSrc() }}
					<b-link :href="'//' + modifiedSrc()" target="_blank"
						><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right
					></b-link>
				</p>
				<p>
					<b>Short syntax:</b> {{ modifiedShortSrc() }}
					<b-link :href="'//' + modifiedShortSrc()" target="_blank"
						><b-icon-box-arrow-up-right></b-icon-box-arrow-up-right
					></b-link>
				</p>
				<b-row>
					<b-col xl="4" lg="6" xs="12">
						<b-form-group label="Width">
							<b-form-input v-model="modifications.resize.width" trim></b-form-input>
						</b-form-group>
					</b-col>

					<b-col xl="4" lg="6" xs="12">
						<b-form-group label="Height">
							<b-form-input v-model="modifications.resize.height" trim></b-form-input>
						</b-form-group>
					</b-col>

					<b-col xl="4" lg="6" xs="12">
						<b-form-group label="Quality [1-100]">
							<b-form-input v-model="modifications.quality" trim></b-form-input>
						</b-form-group>
					</b-col>

					<b-col xl="4" lg="6" xs="12">
						<b-form-group label="Blur [1-1000]">
							<b-form-input v-model="modifications.blur" trim></b-form-input>
						</b-form-group>
					</b-col>

					<b-col xl="4" lg="6" xs="12">
						<b-form-group label="Format">
							<b-form-select v-model="modifications.format" :options="formatTypes"></b-form-select>
						</b-form-group>
					</b-col>

					<b-col xs="12" xl="12">
						<b-button type="submit" variant="primary" @click.prevent="modifiedSrcApplied = modifiedSrc()"
							>Show modified image</b-button
						>
					</b-col>
				</b-row>
				<b-img
					class="mt-2"
					fluid
					v-if="modifiedSrcApplied"
					:src="'//' + modifiedSrcApplied"
					@load="getImage()"
				></b-img>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'DomainView',
	data() {
		return {
			image: null,
			formatTypes: [
				{ value: null, text: 'Please select image format' },
				{ value: 'jpeg', text: 'JPEG' },
				{ value: 'png', text: 'PNG' },
				{ value: 'webp', text: 'WEBP' },
			],
			modifications: {
				resize: {
					width: null,
					height: null,
				},
				quality: null,
				blur: null,
				format: null,
			},
			modifiedSrcApplied: false,
		};
	},
	beforeMount() {
		this.setupAPI();
		this.getImage();
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

			return this.domain.domain + port + '/i/' + this.getPath();
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
		async getImage() {
			var [err, image] = await this.$granny.getImage({ path: this.getPath() });
			this.image = image;
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

		modifiedSrc: function(modifications = false) {
			let port = process.env.NODE_ENV == 'development' ? ':3001' : '';
			if (!modifications) modifications = Object.assign({}, this.modifications);
			if (modifications.resize) {
				if (modifications.resize.width) modifications.width = modifications.resize.width;
				if (modifications.resize.height) modifications.height = modifications.resize.height;
				delete modifications.resize;
			}

			let modPathArray = [];
			Object.keys(modifications).forEach(key => {
				if (modifications[key]) modPathArray.push(`${key}=${modifications[key]}`);
			});
			let modPath = modPathArray.length ? modPathArray.join(',') : '';

			return this.domain.domain + port + '/i/' + (modPath ? modPath + '/_/' : '') + this.getPath();
		},

		modifiedShortSrc: function(modifications = false) {
			let port = process.env.NODE_ENV == 'development' ? ':3001' : '';
			if (!modifications) modifications = Object.assign({}, this.modifications);
			if (modifications.resize) {
				if (modifications.resize.width) modifications.width = modifications.resize.width;
				if (modifications.resize.height) modifications.height = modifications.resize.height;
				delete modifications.resize;
			}

			let modPathArray = [];
			if (modifications.width || modifications.height) {
				if (modifications.width != modifications.height)
					modPathArray.push(
						`r=${modifications.width ? modifications.width : ''}x${
							modifications.height ? modifications.height : ''
						}`,
					);
				else modPathArray.push(`r=${modifications.width}`);
			}
			Object.keys(modifications).forEach(key => {
				if (modifications[key]) {
					let altKey = key;
					if (key == 'width') return;
					if (key == 'height') return;
					if (key == 'format') altKey = 'f';
					if (key == 'quality') altKey = 'q';

					modPathArray.push(`${altKey}=${modifications[key]}`);
				}
			});
			let modPath = modPathArray.length ? modPathArray.join(',') : '';

			return this.domain.domain + port + '/i/' + (modPath ? modPath + '/_/' : '') + this.getPath();
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
