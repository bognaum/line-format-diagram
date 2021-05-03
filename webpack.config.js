const path = require('path');

module.exports = {
	context: __dirname,
	entry: './lit-lay.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'lit-lay-bundle.js',
		library: "EScheme",
	},
	mode: 'none', 
	devtool: "source-map",
};