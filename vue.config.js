module.exports = {
	assetsDir: 'public',
	runtimeCompiler: true,
	chainWebpack: config => {
		config.plugin('copy').tap(([pathConfigs]) => {
			pathConfigs.unshift({
				from: 'src/cfg',
				to: 'cfg',
			});
			return [pathConfigs];
		});
	},
};
