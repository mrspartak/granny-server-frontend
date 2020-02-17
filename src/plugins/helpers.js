import Vue from 'vue';

Vue.mixin({
	methods: {
		formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));

			return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		},
		formatTimeDiff(ts) {
			let diff = ts - this.server_ts;
			if (diff <= 60) return `${diff} sec`;
			if (diff <= 3600) {
				diff = parseInt(diff / 60);
				return `${diff} min`;
			}
			if (diff <= 3600 * 24) {
				diff = parseInt(diff / 3600);
				return `${diff} h`;
			}
			if (diff <= 3600 * 24 * 30) {
				diff = parseInt(diff / 3600 / 24);
				return `${diff} d`;
			}
			if (diff <= 3600 * 24 * 30 * 12) {
				diff = parseInt(diff / 3600 / 24 / 30);
				return `${diff} m`;
			}

			diff = parseInt(diff / 3600 / 24 / 30 / 12);
			return `${diff} y`;
		},
	},
});
