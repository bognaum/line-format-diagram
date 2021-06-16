import JsonEHl from "./json-err-hl/json-err-hl.js";
import setStyle from "./set-style.js";

const version = "5.0.1";

export default class LineFormatDiagram {
	constructor (clPref="line-format-diagram") {
		this.clPref = clPref;
		setStyle(clPref);
	}

	build              (...args) { return build             (this, ...args); }
	buildByTextContent (...args) { return buildByTextContent(this, ...args); }

	get        version () {return version;}
	static get version () {return version;}
}

function buildByTextContent(self, elem) {
	return build(self, elem, elem.textContent);
}

function build (self, elem, template=null) {
	if (["executing", "executed"].some((v) => elem.classList.contains(v))) {
		console.error(`(!) Expression Scheme:`, `Dowble execution. \n`, elem);
		return;
	}
	elem.classList.add("executing");


	const opts = Object.assign({
		style:  "",
		bdColor: "",
		lineNum: 0,
	}, elem.dataset);

	opts.bdColor = opts.bdColor ? ` border-color: ${opts.bdColor}; ` : "";

	const {object :tOb, error :jsonError} = _tryParseJSON(template);

	if (tOb) {

		const {tLevels, bLevels} = _getLevels(tOb);
		const htmlStr = _getHtmlStr(tOb, opts, tLevels, bLevels, self.clPref) 
			+ _getLinersHtmlStr(bLevels, self.clPref);

		elem.innerHTML = htmlStr;
		elem.dataset.eSchemeVersion = self.version;
		elem.classList.remove("executing");
		elem.classList.add("executed");

		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("executed");
	} else if (jsonError) {
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("exec-error");
		const 
			firstLN = parseInt(opts.lineNum),
			json = template,
			hl = new JsonEHl("e-s-json-err-hl"),
			codeField = hl.getHighlighted(template, firstLN);
		elem.innerHTML = "";
		elem.appendChild(codeField);
		hl.scrollToFirstError(codeField);
		console.error(`(!) \n`, elem, "\n", jsonError);
		return;
	} else {
		throw new Error();
	}

	/*template = template || elem.textContent;

	let tOb; 

	if (typeof template == "string") {
		try {
			tOb = JSON.parse(template);
		} catch (err) {
			const firstLineNum = opts.lineNum * 1;
			const 
				json = template,
				highlighyer = new JsonEHl("e-s-json-err-hl");
			elem.innerHTML = 
				`<pre class="e-s-json-err-hl calm-clarified-theme"><pre>`;
			const pre = elem.children[0];
			highlighyer.highlight(pre, json, firstLineNum);
			highlighyer.scrollToFirstError(pre);
			return;
		}
	} else if (typeof template == "object"){
		tOb = template;
	} else {
		throw new Error("Invalid template", template);
	}*/

	
}

function _getLevels(tOb) {
	const 
		tLevels = [],
		bLevels = [];

	recursive(tOb, 0);
	bLevels.push(1);
	return {tLevels, bLevels};

	function recursive(tOb, level=0) {
		tLevels[level] = tLevels[level] || 0;

		tOb.forEach((v) => {

			if ("td" in v) {
				const 
					lines = v.td.split("\n"),
					n = lines.length;
				if (tLevels[level] < n)
					tLevels[level] = n;
				v.topDescr = lines.join("<br/>");
			}

			if (v.ch)
				if (typeof v.ch != "string")
					recursive(v.ch, level + 1);

			if (v.bd)
				if (typeof v.ch == "string") {
					const 
						lines = v.bd.split("\n"),
						n = lines.length;
					bLevels.push(n);
					v.bottomDescr = lines.join("<br/>");
				} else {
					v.bottomDescr = null;
					v.errors = v.errors || [];
					v.errors.push("'v.bottomDescr' is deleted.");
				}
		});
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
		templ.forEach((v) => {
			const
				hFZ = _getHFZ(tLevels[level]);

			v = Object.assign({
				tbStyle: "",
				tdStyle: "",
				style  : "",
				bbStyle: "",
				bdStyle: "",
				class  : "",
			}, v);

			let 
				localBdColor = "border-color: transparent;",
				showBdsClass = "";

			if ("topDescr" in v) {
				showBdsClass = "show-borders";
				localBdColor = opts.bdColor;
			} else {}

			str += `<div class="${clPref}-part ${showBdsClass} ${v.class}" style="${localBdColor}">`;
			
			if ("topDescr" in v)
				str += [
					`<div `,
						`class="`,
							`${clPref}-top-descr `,
							`${clPref}-description `,
							`${clPref}-grid-v-liner `,
							`${v.class}`,
						`" `,
						`style="`,
							`\n/* Autogenerated*/  ${hFZ}`,
							`\n/*Common bdColor*/  ${opts.bdColor}`,
						`"`,
					`>`,

						`<div `,
							`class="${clPref}-h-line ${v.class}" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor} `,
								`\n/* Local tbStyle*/  ${v.tbStyle}"`,
						`></div>`,

						`<div `,
							`class="${clPref}-td-block ${v.class}" `,
							`style="/*Local tdStyle*/  ${v.tdStyle}"`,
						`>`,
								`${v.topDescr}`,
						`</div>`,

						`<div `,
							`class="${clPref}-h-line ${v.class}" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor} `,
								`\n/* Local tbStyle*/  ${v.tbStyle}"`,
						`></div>`,

					`</div>`,
				].join("");
			else 
				str += `<div 
					class="${clPref}-grid-v-liner" 
					style="/*Autogenerated*/  ${hFZ}"
				></div>`;

			if (v.ch)
				if (typeof v.ch == "string") {

					for (let i = level + 1; i < tLevels.length; i++) {
						let hFZ = _getHFZ(tLevels[i]);
						str += `<div class="${clPref}-grid-v-liner" style="${hFZ}"></div>`; 
					}
					
					sPartN ++;

					str += [
						`<div `,
							`class="${clPref}-line-text ${v.class}" `,
							`style="`,
								`\n/*  Autogenerated*/  ${localBdColor}`,
								`\n/*   Common style*/  ${opts.style}`,
								`\n/*Inherited style*/  ${inheritStyle}`,
								`\n/*      Own style*/  ${v.style}`,
							`"`,
						`>${v.ch}</div>`
					].join("");

				} else if (typeof v.ch == "object" && "length" in v.ch) {
					recursive(v.ch, level + 1, inheritStyle+v.style);
				} else {
					throw new Error(`(!) "ch" must be a string or an array.`);
				}

			if (v.bottomDescr) {

				let strCount = bLevels.shift();
				str += [
					`<div class="${clPref}-bottom-rel-wr ${v.class}" `,
						`style="/*Common bdColor*/  ${opts.bdColor}">`,

						`<div class="${clPref}-bottom-rel ${v.class}" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor}`,
								`\n/* Local bbStyle*/  ${(v.bbStyle)}`,
							`">`,

							`<div class="${clPref}-rel-line ${v.class}" `,
								`style="`,
									`\n/*Common bdColor*/  ${opts.bdColor}`,
									`\n/* Local bbStyle*/  ${(v.bbStyle)}`,
								`">`
				].join("");

				bLevels.forEach((v) => {
					str += [
						`<div class="${clPref}-grid-bv-liner" `,
							`style="/*Autogenerated*/  height: ${v * 1.2}em"></div>`
					].join("");
				});

				str += [
								`<div `,
									`class="`,
										`${clPref}-bottom-descr `,
										`${clPref}-description `,
										`${clPref}-grid-bv-liner `,
										`${v.class}`,
									`" `,
									`style="`,
										`\n/*Autogenerated*/  height: ${strCount * 1.2}em; `,
										`\n/*Common bdColor*/  ${opts.bdColor}`,
										`\n/* Local bdStyle*/  ${(v.bdStyle)}`,
									`"`,
								`>`,
									`${v.bottomDescr}`,
								`</div>`,
							`</div>`,
						`</div>`,
					`</div>`,
				].join("");
			}

			

			str += `</div>`; // .${clPref}-part
		});
	}
}

function _tryParseJSON (json) {
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

function eHTML(code, shell=null) {
	const _shell = 
		! shell                  ? document.createElement("div") :
		typeof shell == "string" ? document.createElement(shell) :
		typeof shell == "object" ? shell :
			null;
	_shell.innerHTML = code;
	return _shell.children[0];
}