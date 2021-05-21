const path = require('path');

module.exports = {
	context: __dirname,
	entry: './lfd.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'lfd-bundle.js',
		library: "LineFormatDiagram",
	},
	mode: 'none', 
	devtool: "source-map",
};