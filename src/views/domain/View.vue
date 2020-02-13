<template>
	<div>
		<b-breadcrumb>
			<b-breadcrumb-item
				:to="{
					name: 'DomainView',
					params: { id: $route.params.id },
					query: { path: '/' },
				}"
			>
				{{ $route.params.id }}
			</b-breadcrumb-item>

			<b-breadcrumb-item
				v-for="path in pathSplited"
				:to="{
					name: 'DomainView',
					params: { id: $route.params.id },
					query: { path: path.long },
				}"
			>
				{{ path.short }}
			</b-breadcrumb-item>
		</b-breadcrumb>

		<b-table :striped="true" :borderless="true" :fields="fields" :busy="isBusy" :items="items">
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
							name: 'DomainView',
							params: { id: $route.params.id },
							query: { path: getPath() + '/' + data.item.path },
						}"
					>
						<b><b-icon-folder scale="1.5" class="mr-1"></b-icon-folder> {{ data.item.path }}</b>
					</b-link>
				</div>
				<div v-else>
					{{ data.item.path }}
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
	},
	watch: {
		'$route.query.path'() {
			console.log('watch.query.path');
			this.getDirectoryContent();
		},
		'$route.params.id'() {
			console.log('watch.params.id');
			this.setupAPI();
			this.getDirectoryContent();
		},
	},
	computed: {
		...mapState(['domains']),

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
			console.log(err, content);

			let folders = [],
				files = [];
			content.structure.forEach(item => {
				if (item.type == 'file') files.push(item);
				if (item.type == 'folder') folders.push(item);
			});

			this.isBusy = false;
			this.items = [...folders, ...files];
		},
		setupAPI() {
			let domain = this.domains.find(domain => domain.domain == this.$route.params.id);
			this.$granny.setOptions({
				accessKey: domain.accessKey,
				accessSecret: domain.accessSecret,
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
