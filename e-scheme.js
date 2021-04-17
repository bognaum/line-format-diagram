import JsonEHl from "./json-err-hl/json-err-hl.js";
export default class EScheme {
	constructor (clPref="e-scheme") {
		this.clPref = clPref;
	}

	get version () {return "2.0.0"}

	build (container, template=null) {
		if (["executing", "executed"].some((v) => container.classList.contains(v))) {
			console.error(`(!) Expression Scheme:`, `Dowble execution. \n`, container);
			return;
		}
		container.classList.add("executing");

		const opts = Object.assign({
			eStyle:  "",
			bdColor: "",
			lineNum: 0,
			lineTextStyle: "",
		}, container.dataset);

		template = template || container.textContent;

		let tOb; 

		if (typeof template == "string") {
			try {
				tOb = JSON.parse(template);
			} catch (err) {
				const firstLineNum = opts.lineNum * 1;
				const 
					json = template,
					highlighyer = new JsonEHl("e-s-json-err-hl");
				container.innerHTML = 
					`<pre class="e-s-json-err-hl calm-clarified-theme"><pre>`;
				const pre = container.children[0];
				highlighyer.highlight(pre, json, firstLineNum);
				highlighyer.scrollToFirstError(pre);
				return;
			}
		} else if (typeof template == "object"){
			tOb = template;
		} else {
			throw new Error("Invalid template", template);
		}

		const {tLevels, bLevels} = getLevels(tOb);
		const htmlStr = getHtmlStr(tOb, opts, tLevels, bLevels, this.clPref) 
			+ getLinersHtmlStr(bLevels, this.clPref);

		container.innerHTML = `<!-- version ${this.version} -->` + htmlStr;
		container.classList.remove("executing");
		container.classList.add("executed");
	}
}

function getLevels(tOb) {
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

function getHtmlStr(templ, opts, tLevels, _bLevels, clPref) {
	let 
		bLevels = _bLevels.map(v => v),
		str    = "",
		sPartN = 0;

	recursive(templ, 0);
	return str;

	function recursive(templ, level=0) {
		templ.forEach((v) => {
			const
				hFZ = getHFZ(tLevels[level]);

			let 
				localBdColor = "border-color: transparent;",
				showBdsClass = "";

			if ("topDescr" in v) {
				showBdsClass = "show-borders";
				localBdColor = opts.bdColor;
			} else {}

			str += `<div class="${clPref}-part ${showBdsClass}" style="${localBdColor}">`;
			
			if ("topDescr" in v)
				str += `<div 
					class="${clPref}-top-descr ${clPref}-description ${clPref}-grid-v-liner" 
					style="${hFZ+opts.bdColor}"
				>`+ 
					`<div class="${clPref}-h-line"   style="${v.tbStyle || ""}"></div>`+
					`<div class="${clPref}-td-block" style="${v.tdStyle || ""}">${v.topDescr}</div>`+
					`<div class="${clPref}-h-line"   style="${v.tbStyle || ""}"></div>`+
				`</div>`;
			else 
				str += `<div 
					class="${clPref}-grid-v-liner" 
					style="${hFZ}"
				></div>`;

			if (v.ch)
				if (typeof v.ch == "string") {

					for (let i = level + 1; i < tLevels.length; i++) {
						let hFZ = getHFZ(tLevels[i]);
						str += `<div class="${clPref}-grid-v-liner" style="${hFZ}"></div>`; 
					}
					
					sPartN ++;

					let styleStr = opts.bdColor+opts.lineTextStyle;

					styleStr += v.style || "";

					str += `<div 
						class="${clPref}-line-text part-${sPartN}" 
						style="${
							opts.bdColor 
							+ opts.lineTextStyle 
							+ (v.style || "") 
							+ localBdColor
						}"
					>${v.ch}</div>`;

				} else if (typeof v.ch == "object" && "length" in v.ch) {
					recursive(v.ch, level + 1);
				} else {
					throw new Error(`(!) "ch" must be a string or an array.`);
				}

			if (v.bottomDescr) {

				let strCount = bLevels.shift();
				str += `
					<div class="${clPref}-bottom-rel-wr" style="${opts.bdColor}">
						<div class="${clPref}-bottom-rel" style="${opts.bdColor+v.bbStyle || ""}">
							<div class="${clPref}-rel-line" style="${opts.bdColor+v.bbStyle || ""}">`;

				bLevels.forEach((v) => {
					str += `<div class="${clPref}-grid-bv-liner" style="height: ${v * 1.2}em"></div>`;
				});

				str += `
								<div 
									class="${clPref}-bottom-descr ${clPref}-description ${clPref}-grid-bv-liner" 
									style="
										height: ${strCount * 1.2}em; 
										${opts.bdColor+(v.bdStyle || "")}
									"
								>${v.bottomDescr}</div>
							</div>
						</div>
					</div>
				`;
			}

			

			str += `</div>`; // .${clPref}-part
		});
	}
}

function getLinersHtmlStr(bLevels, clPref) {
	let str = "";
	for (let i = bLevels.length - 1; 0 <= i; i --) 
		str += `<div class="${clPref}-grid-bv-liner" style="height: ${bLevels[i] * 1.3}em"></div>`;
	
	return str;
}

function getHFZ(lineCount) {
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