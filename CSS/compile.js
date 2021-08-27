const 
	sass$ = require("sass"),
	fs$   = require("fs"),
	path$ = require("path");

const 
	scssPathName   = path$.resolve(__dirname, "lfd.scss"),
	jsTemplate     = path$.resolve(__dirname, "template.js"),
	outputPathName = scssPathName + ".js",
	outFile        = "lfd.scss.js"; // Без этого не создаётся source map.

const 
	compOb = sass$.renderSync({
		file: scssPathName,
		outFile, // Без этого не создаётся source map.
		sourceMap: true,
		sourceMapEmbed: true,
	}),
	cssCode = compOb.css.toString(),
	// mapCode = compOb.map?.toString(),
	// prretifiedMap = mapCode? JSON.stringify(JSON.parse(mapCode), null, 4) : null,
	templ = fs$.readFileSync(jsTemplate).toString(),
	resultCode = templ.replace("-xxx-inserting-tag-xxx-", ""+cssCode+"");

// console.log(`prretifiedMap :`, prretifiedMap);

fs$.writeFileSync(outputPathName, resultCode);
console.log("OK");

// setInterval(() => {},1000);