module.exports = function(config) {
	config.set({
		basePath: '../',
		frameworks: ['ng-scenario'],
		files: [
			'test/e2e/**/*.js'
		],

		autoWatch: false,

		browsers: ['Firefox'],

		singleRun: true,

		proxies: {
			'/': 'http://localhost:9879/'
		},

		urlRoot: "__karma__",

		junitReporter: {
			outputFile: 'test_out/e2e.xml',
			suite: 'e2e'
		}

	});
};
