import * as lib from "./lib.js";
import JsonEHl  from "./json-err-hl/json-err-hl.js";

export default function buildDiagram(self, elem, tOb) {
	const opts = Object.assign({
		style:  "",
		bdColor: "",
		lineNum: 0,
	}, elem.dataset);

	opts.bdColor = opts.bdColor &&= ` border-color: ${opts.bdColor}; `;

	const {tLevels, bLevels} = _getLevels(tOb);
	const htmlStr = _getHtmlStr(tOb, opts, tLevels, bLevels, self.clPref) 
		+ _getLinersHtmlStr(bLevels, self.clPref);

	elem.innerHTML = htmlStr;
}
function _getLevels(tOb) {
	const 
		tLevels = [],
		bLevels = [];

	let serialN = 0;

	recursive(tOb, 0);
	bLevels.push(1);
	return {tLevels, bLevels};

	function recursive(tOb, level=0) {
		tLevels[level] ||= 0;

		if (tOb instanceof Array) {

			for (let node of tOb) 
				recursive(node, level);

		} else if (tOb.ch) {

			const node = tOb;
			node.serialN = serialN ++;

			if ("td" in node) {
				const 
					lines = node.td.split("\n"),
					n = lines.length;
				if (tLevels[level] < n)
					tLevels[level] = n;
				node.topDescr = lines.join("<br/>");
			}

			if (node.ch)
				if (typeof node.ch != "string")
					recursive(node.ch, level + 1);

			if (node.bd)
				if (typeof node.ch == "string") {
					const 
						lines = node.bd.split("\n"),
						n = lines.length;
					bLevels.push(n);
					node.bottomDescr = lines.join("<br/>");
				} else {
					node.bottomDescr = null;
					node.errors = node.errors || [];
					node.errors.push("'node.bd' is deleted.");
				}
		}
	}
}

function _getHtmlStr(templ, opts, tLevels, _bLevels, clPref) {
	let 
		bLevels = _bLevels.map(v => v),
		str    = "",
		sPartN = 0;

	recursive(templ, 0);
	return str;

	function recursive(templ, level=0, inheritStyle="") {
		if (templ instanceof Array) {
			for (let node of templ) 
				recursive(node, level, inheritStyle);
		} else if (templ.ch) {

			const node = Object.assign({
				tbStyle: "",
				tdStyle: "",
				style  : "",
				bbStyle: "",
				bdStyle: "",
				class  : "",
			}, templ);

			const hFZ = _getHFZ(tLevels[level]);

			let 
				localBdColor = "border-color: transparent;",
				showBdsClass = "";

			if ("topDescr" in node) {
				showBdsClass = "show-borders";
				localBdColor = opts.bdColor;
			} else {}

			str += `<div class="${clPref}-part ${showBdsClass} ${node.class}" ` + 
				`style="${localBdColor}" data-serial-n="${node.serialN}">`;
			
			if ("topDescr" in node)
				str += [
					`<div `,
						`class="`,
							`${clPref}-top-descr `,
							`${clPref}-description `,
							`${clPref}-grid-v-liner `,
							`${node.class}`,
						`" `,
						`style="`,
							`\n/* Autogenerated*/  ${hFZ}`,
							`\n/*Common bdColor*/  ${opts.bdColor}`,
						`"`,
					`>`,

						`<div `,
							`class="${clPref}-h-line ${node.class}" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor} `,
								`\n/* Local tbStyle*/  ${node.tbStyle}"`,
						`></div>`,

						`<div `,
							`class="${clPref}-td-block ${node.class}" `,
							`style="/*Local tdStyle*/  ${node.tdStyle}"`,
						`>`,
								`${node.topDescr}`,
						`</div>`,

						`<div `,
							`class="${clPref}-h-line ${node.class}" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor} `,
								`\n/* Local tbStyle*/  ${node.tbStyle}"`,
						`></div>`,

					`</div>`,
				].join("");
			else 
				str += `<div 
					class="${clPref}-grid-v-liner" 
					style="/*Autogenerated*/  ${hFZ}"
				></div>`;

			if (node.ch)
				if (typeof node.ch == "string") {

					for (let i = level + 1; i < tLevels.length; i++) {
						let hFZ = _getHFZ(tLevels[i]);
						str += `<div class="${clPref}-grid-node-liner" style="${hFZ}"></div>`; 
					}
					
					sPartN ++;

					str += [
						`<div `,
							`class="${clPref}-line-text ${node.class}" `,
							`style="`,
								`\n/*  Autogenerated*/  ${localBdColor}`,
								`\n/*   Common style*/  ${opts.style}`,
								`\n/*Inherited style*/  ${inheritStyle}`,
								`\n/*      Own style*/  ${node.style}`,
							`"`,
						`>${node.ch}</div>`
					].join("");

				} else if (typeof node.ch == "object" && "length" in node.ch) {
					recursive(node.ch, level + 1, inheritStyle+node.style);
				} else {
					throw new Error(`(!) "ch" must be a string or an array.`);
				}

			if (node.bottomDescr) {

				let strCount = bLevels.shift();
				str += [
					`<div class="${clPref}-bottom-rel-wr ${node.class}" `,
						`style="/*Common bdColor*/  ${opts.bdColor}">`,

						`<div class="${clPref}-bottom-rel ${node.class}" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor}`,
								`\n/* Local bbStyle*/  ${(node.bbStyle)}`,
							`">`,

							`<div class="${clPref}-rel-line ${node.class}" `,
								`style="`,
									`\n/*Common bdColor*/  ${opts.bdColor}`,
									`\n/* Local bbStyle*/  ${(node.bbStyle)}`,
								`">`
				].join("");

				bLevels.forEach((node) => {
					str += [
						`<div class="${clPref}-grid-bv-liner" `,
							`style="/*Autogenerated*/  height: ${node * 1.2}em"></div>`
					].join("");
				});

				str += [
								`<div `,
									`class="`,
										`${clPref}-bottom-descr `,
										`${clPref}-description `,
										`${clPref}-grid-bv-liner `,
										`${node.class}`,
									`" `,
									`style="`,
										`\n/*Autogenerated*/  height: ${strCount * 1.2}em; `,
										`\n/*Common bdColor*/  ${opts.bdColor}`,
										`\n/* Local bdStyle*/  ${(node.bdStyle)}`,
									`"`,
								`>`,
									`${node.bottomDescr}`,
								`</div>`,
							`</div>`,
						`</div>`,
					`</div>`,
				].join("");
			}

			

			str += `</div>`; // .${clPref}-part
		}
	}
}
function _getLinersHtmlStr(bLevels, clPref) {
	let str = "";
	for (let i = bLevels.length - 1; 0 <= i; i --) 
		str += `<div class="${clPref}-grid-bv-liner" `+
			`style="/*Autogenerated*/  height: ${bLevels[i] * 1.3}em"></div>`;
	
	return str;
}

function _getHFZ(lineCount) {
	return `height: ${lineCount * 1.5}em; font-size: 1em; `;
}

/*function _tryParseJSON (json) {
	try {
		return {
			object: JSON.parse(json)
		};
	} catch (err) {
		return {
			text: json,
			error: err,
		}
	}
}*/

/*function _tryParseJSON (json) {
	try {
		const object = _fromJson(json)
		return {object};
	} catch (err) {
		return {
			text: json,
			error: err,
		}
	}
}

function _fromJson(json) {
	return JSON.parse(json, function(k, v) {
		if (typeof (k * 1) == "number" && typeof v == "object" && "ch" in v) {
			const node = new Node(v);
			if (node.ch instanceof Array)
				node.ch.forEach(v => v.parent = node);
			return node;
		} else
			return v;
	});
}*/


/*function eHTML(code, shell=null) {
	const _shell = 
		! shell                  ? document.createElement("div") :
		typeof shell == "string" ? document.createElement(shell) :
		typeof shell == "object" ? shell :
			null;
	_shell.innerHTML = code;
	return _shell.children[0];
}*/
