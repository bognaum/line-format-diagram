const path = require('path');

module.exports = {
	context: __dirname,
	entry: './e-scheme.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'e-scheme-bundle.js',
		library: "EScheme",
	},
	mode: 'none', 
};