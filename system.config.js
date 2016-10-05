System.config({
	defaultJSExtensions: false,
	transpiler: 'traceur',
	meta: {
		'*.json': {loader: 'json'},
	},
	map: {
		'../../src/': 'source:',
		'../../': 'project:'
	},
	paths: {
		'project:*': '../*',
		'source:*': '../src/*',
		'vendor:*': '../src/vendor/*.js',
		'traceur': '../node_modules/bower-traceur/traceur.js',
		'json': '../node_modules/systemjs-plugin-json/json.js',
		'pubnub': '../node_modules/pubnub/dist/web/pubnub.js'
	}
});
