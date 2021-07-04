import * as lib      from "./lib.js";
import JsonEHl       from "./json-err-hl/json-err-hl.js";
import setStyle      from "./set-style.js";
import buildDiagram  from "./buildDiagram.js";
import DiagramEditor from "./DiagramEditor.js";

const version = "7.0.1-alpha";

export default class LineFormatDiagram {
	constructor (clPref="line-format-diagram") {
		this.clPref = clPref;
		setStyle(clPref);
	}

	build              (...args) { return build             (this, ...args); }
	buildByTextContent (...args) { return buildByTextContent(this, ...args); }
	getBuilded         (...args) { return getBuilded        (this, ...args); }
	edit               (...args) { return edit              (this, ...args); }

	get        version () {return version;}
	static get version () {return version;}
}

function edit(self, elem) {
	const template = elem.textContent;
	const {object :tOb, error :jsonError} = lib.tryParseJSON(template);
	if (tOb)
		new DiagramEditor(self.clPref, elem, tOb);
		// return editDiagram(self, elem, tOb);
	else if (jsonError) {
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("exec-error");
		const 
			firstLN = parseInt(elem.dataset.lineNum) || 1,
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
}

function getBuilded(self, templ) {
	const elem = lib.eHTML(`<pre class=""><pre>`);
	return build(self, elem, templ);
}

function buildByTextContent(self, elem) {
	return build(self, elem, elem.textContent);
}

function build (self, elem, template) {
	if (! (elem instanceof HTMLElement))
		throw new Error([
			"(!) build(). Argument #1 must be a HTMLElement.",
			"",
			elem + " given.",
			""
		].join("\n"));

	if (["executing", "executed", "exec-error"].some((v) => elem.classList.contains(v)))
		throw new Error([
			"(!) Line format diagram. Already handled.", 
			"",
			elem
		].join("\n"));

	elem.dataset.fileTreeDiagramVersion = version;
	// elem.classList.add(self.clPref);
	elem.classList.add("executing");

	if (typeof template != "string")
		throw new Error([
			"(!) build(). Argument #2 must be a string.",
			"",
			template + " given.",
			""
		].join("\n"));


	

	const {object :tOb, error :jsonError} = lib.tryParseJSON(template);

	if (tOb) {

		buildDiagram(self, elem, tOb);
		elem.dataset.eSchemeVersion = self.version;

		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("executed");
	} else if (jsonError) {
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("exec-error");
		const 
			firstLN = parseInt(elem.dataset.lineNum) || 1,
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
	return tOb;
}
