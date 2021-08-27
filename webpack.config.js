const path = require('path');

require("./CSS/watch.js");

module.exports = {
	context: __dirname,
	entry: './wp-enter-point.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'lfd-bundle.js',
		library: "LineFormatDiagram",
	},
	mode: 'none', 
	devtool: "source-map",
	watch: true,
};