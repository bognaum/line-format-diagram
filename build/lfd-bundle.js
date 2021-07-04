var LineFormatDiagram;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const LFD = __webpack_require__(1).default;

module.exports = LFD;

/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LineFormatDiagram)
/* harmony export */ });
/* harmony import */ var _lib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _set_style_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _buildDiagram_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _DiagramEditor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);






const version = "7.0.0-alpha";

class LineFormatDiagram {
	constructor (clPref="line-format-diagram") {
		this.clPref = clPref;
		(0,_set_style_js__WEBPACK_IMPORTED_MODULE_2__.default)(clPref);
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
	const {object :tOb, error :jsonError} = _lib_js__WEBPACK_IMPORTED_MODULE_0__.tryParseJSON(template);
	if (tOb)
		new _DiagramEditor_js__WEBPACK_IMPORTED_MODULE_4__.default(self.clPref, elem, tOb);
		// return editDiagram(self, elem, tOb);
	else if (jsonError) {
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("exec-error");
		const 
			firstLN = parseInt(elem.dataset.lineNum) || 1,
			json = template,
			hl = new _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_1__.default("e-s-json-err-hl"),
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
	const elem = _lib_js__WEBPACK_IMPORTED_MODULE_0__.eHTML(`<pre class=""><pre>`);
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


	

	const {object :tOb, error :jsonError} = _lib_js__WEBPACK_IMPORTED_MODULE_0__.tryParseJSON(template);

	if (tOb) {

		(0,_buildDiagram_js__WEBPACK_IMPORTED_MODULE_3__.default)(self, elem, tOb);
		elem.dataset.eSchemeVersion = self.version;

		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("executed");
	} else if (jsonError) {
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("exec-error");
		const 
			firstLN = parseInt(elem.dataset.lineNum) || 1,
			json = template,
			hl = new _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_1__.default("e-s-json-err-hl"),
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


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "forEachRecur": () => (/* binding */ forEachRecur),
/* harmony export */   "tryParseJSON": () => (/* binding */ tryParseJSON),
/* harmony export */   "fromJson": () => (/* binding */ fromJson),
/* harmony export */   "eHTML": () => (/* binding */ eHTML),
/* harmony export */   "eHTMLDF": () => (/* binding */ eHTMLDF),
/* harmony export */   "getPart": () => (/* binding */ getPart),
/* harmony export */   "isPart": () => (/* binding */ isPart)
/* harmony export */ });
/* harmony import */ var _NodeClass_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);




function getPart(self, el) {
	return recur(el);
	function recur(el) {
		if (isPart(self, el)) 
			return el;
		if (el.parentElement)
			return recur(el.parentElement);
	}
}

function isPart(self, el) {
	return el.classList?.contains(`${self.clPref}-part`);
}

function setStatusMark(el, className) {
	const classes = ["executing", "executed", "exec-error"];
	if (classes.includes(className)) {
		el.classList.remove(...classes);
		el.classList.add(className);
	} else {
		throw new Error("Invalid className of diagram status: "+slassName);
	}
}


function forEachRecur(preCb, ob, postCb) {
	if (ob instanceof Array) 
		for (let v of ob)
				forEachRecur(preCb, v, postCb);
	else if (typeof ob == "object") {
		if (preCb)
			preCb(ob);
		forEachRecur(preCb, ob.ch, postCb);
		if (postCb)
			postCb(ob);
	}
}

function tryParseJSON (json) {
	try {
		const object = fromJson(json)
		return {object};
	} catch (err) {
		return {
			text: json,
			error: err,
		}
	}
}

function fromJson(json) {
	const ob =  JSON.parse(json, function(k, v) {
		if (typeof (k * 1) == "number" && typeof v == "object" && "ch" in v) {
			const node = new _NodeClass_js__WEBPACK_IMPORTED_MODULE_0__.default(v);
			if (node.ch instanceof Array)
				node.ch.forEach(v => v.parent = node);
			return node;
		} else
			return v;
	});

	if (typeof ob == "string")
		return new _NodeClass_js__WEBPACK_IMPORTED_MODULE_0__.default({ch: ob});
	else if (ob instanceof Array)
		return new _NodeClass_js__WEBPACK_IMPORTED_MODULE_0__.default({ch: ob});
	else 
		return ob;
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

function eHTMLDF(code) {
	const _shell = document.createElement("template");
	return _shell.innerHTML = code, _shell.content;
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Node)
/* harmony export */ });
class Node {
	constructor (ob) {
		Object.assign(this, ob);
	}
	
	split        (a, b) { return split       (this, a, b);}
	join         (a, b) { return join        (this, a, b);}
	wrap         (a, b) { return wrap        (this, a, b);}
	unwrap       (    ) { return unwrap      (this      );}

	isStr        (    ) { return isStr       (this      );}
	isArr        (    ) { return isArr       (this      );}

	toJSON       (    ) { return toJSON      (this      );}
	getSerial    (    ) { return getSerial   (this      );}
	getBySerial  (sN  ) { return getBySerial (this, sN  );}
	get chIndex () { return getChIndex(this); }
	get clone   () { return getClone  (this); }
}

function unwrap (self) {
	if (isArr(self.ch)) {
		self.parent.ch.splice(self.chIndex, 1, ...self.ch);
		initChildren(self.parent);
	} else if (isStr(self.ch) && self.parent.ch.length == 1) {
		self.parent.ch = self.ch;
		initChildren(self.parent);
	}
}

function join (self, a, b) {
	if (isArr(self.ch)) {
		const joined = self.ch.slice(a, b);
		if (isArr(...joined.map(v => v.ch))) {
			const 
				startPoint = joined[0].chIndex,
				pasted = new Node({
					td: "J",
					parent: self,
					ch: [],
				});
			for (let v of joined)
				pasted.ch.push(...v.ch);
			for (let v of pasted.ch) 
				v.parent = pasted;
			self.ch.splice(startPoint, joined.length, pasted);
		} else if (isStr(...joined.map(v => v.ch))) {
			const 
				startPoint = joined[0].chIndex,
				pastedStr = joined.reduce((a,v) => a += v.ch, ""),
				pastedNode = new Node({
					td: "J",
					ch: pastedStr,
					parent: self,
				});
			self.ch.splice(startPoint, joined.length, pastedNode);
		}
	}
	const 
		n = self.chIndex + 1,
		right = self.parent.ch[n];
	if (right)
		if (isArr(self, right) || isStr(self, right)) {
			self.ch = self.ch.concat(right.ch);
			self.parent.ch.splice(n, 1);
		}

}


function split (self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = [self.td || "X", "S", self.td || "X"],
		newChildren = [];

	for (let p of parts) {
		const td = tds.shift();
		if (p.length) 
			newChildren.push(new self.constructor ({
					td,
					ch: p,
					parent: self.parent,
				}));
	}
		

	self.parent.ch.splice(self.chIndex, 1, ...newChildren);
}

function wrap(self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = ["X","W","X"],
		newChildren = [];

	if (isStr(self.ch)) {

		for (let str of parts) {
			const td = tds.shift();
			if (str.length)
				newChildren.push(new self.constructor ({
						td,
						ch: str,
						parent: self,
					}));
		}

		self.ch = newChildren;
	} else if (isArr(self.ch)) {
		const wrNode = new Node({
			td: "Wr",
			ch: parts[1],
			parent: self,
		});
		initChildren(wrNode);
		newChildren.push(...parts[0], wrNode, ...parts[2]);
		self.ch = newChildren;
	} else {
		throw new Error();
	}
}

function getChIndex (self) {
	if (self.parent) 
		for (let [k,v] of self.parent.ch.entries()) 
			if (v == self)
				return k;

	return null;
}

function getRoot(self) {
	return self.parent ? getRoot(self.parent) : self;
}

function isStr(...args) {
	for (let a of args) 
		if (! (typeof a == "string"))
			return false;
	return true;
}

function isArr(...args) {
	for (let a of args) 
		if (! (a instanceof Array))
			return false;
	return true;
}

function toJSON(self) {
	const ob = Object.assign({}, self);
	delete ob.parent;
	delete ob.serialN;
	delete ob.topDescr;
	delete ob.bottomDescr;

	return ob;
}

function getClone(self) {
	const  clone = new Node(self);
	delete clone.parent;
	delete clone.serialN;
	delete clone.topDescr;
	delete clone.bottomDescr;

	if(typeof self.ch == "object") {
		clone.ch = self.ch.map(getClone);
		clone.ch.forEach(v => v.parent = clone);
	}

	return clone;
}

function checkToParent(self) {
	const root = getRoot(self);
	forEachRecur((node) => {
		if (node.ch)
			for (let v of node.ch) {
				if (! v.parent)
					debugger;
				if (v.parent != node)
					debugger;
			}
	});
}

function getBySerial(self, serialN) {
	const root = getRoot(self);
	let node, sN = 0;
	forEachRecur((v) => {
		if (serialN == sN) 
			node = v;

		sN ++;
	}, root);
	return node;
}

function getSerial(self) {
	const root = getRoot(self);
	let serialN, sN = 0;
	forEachRecur((v) => {
		if (v == self)
			serialN = sN;
		else
			sN ++;
	}, root);
	return serialN;
}

function forEachRecur(preCb, ob, postCb) {
	if (ob instanceof Array) 
		for (let v of ob)
				forEachRecur(preCb, v, postCb);
	else if (typeof ob == "object") {
		if (preCb)
			preCb(ob);
		forEachRecur(preCb, ob.ch, postCb);
		if (postCb)
			postCb(ob);
	}
}

function initChildren(self) {
	if (isArr(self))
		self.ch.forEach(v => v.parent = self);
}

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JsonErrHlter)
/* harmony export */ });
/* harmony import */ var _set_style_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);



const version = "1.1.4";

const {
	token,
	nToken,
	spToken,
	rule,
	domain,
	seq,
	alter,
	q,
	not,
	spWrap,
	error,
	deb,
} = _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__.default.describeAPI;

const
	__main_ = rule(function(pc) {
		return seq(
			spWrap(r.subject.catch("Main. Expected subject.")),
			error("Main. Unexpected symbol after end of code.").q("*")
		)(pc);
	}),
	list = rule(function(pc) {
		return token("[").in("list__open")
			.break(
				seq(
					spWrap(r.subject.q("*/", spWrap(token(",").in("list__coma")))),
					token("]").in("list__close")
						.catch("List. Expected closing bracket ' ] '."),
				)
			).msg("List.")(pc);
			
	}),
	dict = rule(function(pc) {
		return spToken("{")
			.break(
				alter(
					spToken("}"),
					seq(
						seq(
							d.string_n.catch("Dict. Expected string name of field."),
							spToken(":").catch("Dict. Expected colon ' : '."),
							r.subject.catch("Dict. Expected subject - (null | boll | number | string | list | dict).")
						).q("*/", spToken(",")),
						spToken("}").catch("Dict. Expected closing curly ' } ' or coma ' , '."),
					),
				)
			).msg("Dict.")(pc);
	}),
	d = {
		string_v : domain("string_v" , function(pc) {
			return r.string(pc);
		}),
		string_n : domain("string_n" , function(pc) {
			return r.string(pc);
		}),
		slashed : domain("slashed", function(pc) {
			return token(
				'\\"'         ,
				"\\\\"        , 
				"\\/"         , 
				"\\b"         ,
				"\\f"         ,
				"\\n"         ,
				"\\r"         ,
				"\\t"         ,
				/\\u\d\d\d\d/y,
			)(pc);
		}),
		number          : domain("number", function(pc) {
			return token(/\b\d+\.|\.\d+\b|\b\d+\.?\d*\b/y)(pc);
		}),
		bool            : domain("bool", function(pc) {
			return token(/\btrue\b|\bfalse\b/y)(pc);
		}),
		_null           : domain("_null", function(pc) {
			return token(/\bnull\b/y)(pc);
		}),
	},
	r = {
		subject         : rule(function(pc) {
			return alter(
				d._null,
				d.bool,
				d.number,
				d.string_v,
				list,
				dict
			)(pc);
		}),
		string        : rule(function(pc) {
			return seq(
				token('"'),
				q(alter(d.slashed, nToken('"', "\n", "\\")), "*"),
				token('"').catch("String: invalid symbol"),
			)(pc);
		}),
		space           : rule(function(pc) {
			return token(/\s+/y)(pc);
		}),
	};

class JsonErrHlter extends _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__.default.Highlighter {
	constructor (clPref="json-err-hl") {
		super(__main_, clPref);
		(0,_set_style_js__WEBPACK_IMPORTED_MODULE_0__.default)(clPref);
	}

	get version () { return version; }

	getHighlighted (
		templ, firstLineNum=1, cssClasses="calm-clarified-theme") {
		return super.getHighlighted(templ, firstLineNum, cssClasses);
	}
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setStyle)
/* harmony export */ });
function setStyle(clPref) {

	const cssCode = `
	.json-err-hl.calm-theme {
	  background-color: #222; }
	  .json-err-hl.calm-theme .json-err-hl__line-text {
	    color: #eee; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .string {
	      color: #ddc; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .string_v {
	      color: #ddc; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .string_n {
	      color: #78a; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .slashed {
	      color: #f90; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .number {
	      color: #f90; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .bool {
	      color: #f90; }
	    .json-err-hl.calm-theme .json-err-hl__line-text ._null {
	      color: #98f; }

	.json-err-hl.calm-clarified-theme .json-err-hl__line .json-err-hl__line-number {
	  background-color: #444; }

	.json-err-hl.calm-clarified-theme .json-err-hl__line-text {
	  color: #eee; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .string {
	    color: #ddc; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .string_v {
	    color: #ddc; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .string_n {
	    color: #78a; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .bool {
	    color: #fb6; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .number {
	    color: #fb6; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .slashed {
	    color: #fb6; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text ._null {
	    color: #98f; }

	.json-err-hl.monokai-theme {
	  background-color: #333; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .string_n {
	    color: #3bd; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .string {
	    color: #da5; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .string_v {
	    color: #da5; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .slashed {
	    color: #98f; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .number {
	    color: #98f; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .bool {
	    color: #98f; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text ._null {
	    color: #e48; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string_n {
	  color: #3bd; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string {
	  color: #da5; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string_v {
	  color: #da5; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .slashed {
	  color: #98f; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .number {
	  color: #98f; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .bool {
	  color: #98f; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text ._null {
	  color: #e48; }

	 `.replaceAll(/json-err-hl/g, clPref);

	const styleClassName = `${clPref}__theme-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = eHTML(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		document.head.appendChild(style);
	}
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

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _describeAPI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Highlighter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	version: "5.3.0",
	describeAPI: _describeAPI_js__WEBPACK_IMPORTED_MODULE_0__.default,
	Highlighter: _Highlighter_js__WEBPACK_IMPORTED_MODULE_1__.default,
});

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	token,
	nToken,
	spToken,
	rule,
	domain,
	seq,
	alter,
	q,
	not,
	spWrap,
	error,
	deb,
});

const Analyzer_proto = {
	q : function (quanto, sepCallb=undefined) {
		if (quanto == "*/" || quanto == "+/")
			chekToAnalyzer("analyzer.q", 2, sepCallb);
		return q(this, quanto, sepCallb);
	},
	in : function (name) {
		return domain(name, this);
	},
	and : function (callb) {
		chekToAnalyzer("analyzer.and", 1, callb);
		return seq(this, callb);
	},
	or : function (callb) {
		chekToAnalyzer("analyzer.or", 1, callb);
		return alter(this, callb);
	},
	break : function (...args) {
		for (let [k, callb] of args.entries())
			chekToAnalyzer("analyzer.break", k + 1, callb);
		let message = "";
		const _break_ = (pc) => {
			if(this(pc)) {
				seq(...args).or(undefinedError(message))(pc);
				return true;
			} else {
				return false;
			}
		}
		Object.setPrototypeOf(_break_, Analyzer_proto);
		_break_.msg = function(msg) {
			message = msg;
			return this;
		}
		return _break_;
	},
	catch : function (msg) {
		const _catch_ = (pc) => {
			return alter(
				this,
				error(msg)
			)(pc);
		}
		Object.setPrototypeOf(_catch_, Analyzer_proto);
		return _catch_;
	},
	deb : function (i0=0, i1=0) {
		return deb(this, i0, i1);
	},
};

Object.setPrototypeOf(Analyzer_proto, Function);

function seq(...callbs) {
	for (let [k, callb] of callbs.entries())
		chekToAnalyzer("seq", k + 1, callb);
	function _seq_(pc) {
		const hpc = pc.createHypo();
		for (let [k, callb] of callbs.entries()) {
			const res = callb(hpc);
			if (res || pc.errC.eFlag) 
				continue;
			else 
				return false;
		}
		pc.acceptHypo(hpc);
		return true;
	}
	Object.setPrototypeOf(_seq_, Analyzer_proto);
	return _seq_;
}

function alter(...callbs) {
	for (let [k, callb] of callbs.entries())
		chekToAnalyzer("alter", k + 1, callb);
	function _alter_(pc) {
		let res;
		for (let [k, callb] of callbs.entries()) {
			const res = callb(pc);
			if (res)
				return true;
		}
		return false;
	}
	Object.setPrototypeOf(_alter_, Analyzer_proto);
	return _alter_;
}

function q(callb, quanto, callb2=undefined) {
	chekToAnalyzer("q", 1, callb);
	let _q_;
	if (quanto == "*") {
		_q_ = function _q_zero_or_many_(pc) {
			while (pc.text[pc.i]) {
				let i0 = pc.i, status;
				status = callb(pc);
				if (status) {
					if (i0 != pc.i) {
						continue;
					} else {
						/**
						 * Not strict variant. Mismatches allowed throw error message in console.
						 */
						console.error(`(!)`, `i0 == pc.i`, 
							"\n\tpc.i :", pc.i, "\n\tpc.monitor :", pc.monitor); 
						pc.i ++;
						return true;

						/**
						 * Strict variant. Mismatches forbidden. Script will stoped.
						 */
						// console.error(`(!)`, `i0 == pc.i`, pc); debugger; throw new Error();
					}
				} else 
					return true;
			}
			return true;
		}
	} else if (quanto == "+") {
		_q_ = function _q_one_or_many_(pc) {
			return callb(pc) && q(callb, "*")(pc);
		}
	} else if (quanto == "?") {
		_q_ = function _q_zero_or_one_(pc) {
			return callb(pc) || true;
		}
	} else if (quanto == "*/") {
		chekToAnalyzer("q", 3, callb2);
		_q_ = function _q_zero_or_many_sep_(pc) {
			seq(
				callb,
				seq(callb2, callb).q("*")
			)(pc);
			return true;
		}
	} else if (quanto == "+/") {
		chekToAnalyzer("q", 3, callb2);
		_q_ = function _q_one_or_many_sep_(pc) {
			return seq(
					callb,
					seq(callb2, callb).q("*")
				)(pc);
		}
	} else {
		console.error(`(!)`, `Invalid quantifier`, `'${quanto}'`); debugger; throw new Error();
	}

	Object.setPrototypeOf(_q_, Analyzer_proto);
	return _q_;
}

function not(callb) {
	chekToAnalyzer("not", 1, callb);
	const _not_ = function _not_(pc) {
		const hpc = pc.createHypo();
		const res = callb(hpc);
		if (! res) {
			pc.match(pc.text[pc.i]);
			return true;
		} else 
			return false;
	}
	Object.setPrototypeOf(_not_, Analyzer_proto);
	return _not_;
}

function domain(name, callb, msg=null) {
	const _domain_ = function _domain_(pc) {
		const
			chpc = pc.createChildHypo(name),
			status = callb(chpc)
		if (msg) 
			chpc.msg = msg;
		if (status || pc.errC.eFlag) 
			pc.acceptChildHypo(chpc);
		return !! status;
	}
	_domain_.msg = function (text) {
		return domain(name, callb, text);
	}
	_domain_.as = function(otherName, msg=null) {
		return domain(otherName, callb);
	}
	Object.setPrototypeOf(_domain_, Analyzer_proto);
	return _domain_;
}

function rule(callb) {
	const _rule_ = function _rule_(pc) {
		const 
			hpc    = pc.createHypo(),
			status = callb(hpc);
		if (status || pc.errC.eFlag) 
			pc.acceptHypo(hpc);
		return !! status;
	}
	Object.setPrototypeOf(_rule_, Analyzer_proto);
	return _rule_;
}

function token(...templs) {
	const _token_ = function _token_(pc) {
		return pc.match(...templs);
	}
	Object.setPrototypeOf(_token_, Analyzer_proto);
	return _token_;
}

function nToken(...templs) {
	const _notToken_ = function _notToken_(pc) {
		return pc.notMatch(...templs);
	}
	Object.setPrototypeOf(_notToken_, Analyzer_proto);
	return _notToken_;
}

function spToken(...templs) {
	const _space_wrapped_token_ = function(pc) {
		return seq(token(/\s+/y).q("*"), token(...templs), token(/\s+/y).q("*"),)(pc);
	}
	Object.setPrototypeOf(_space_wrapped_token_, Analyzer_proto);
	return _space_wrapped_token_;
}

function spWrap(callb) {
	chekToAnalyzer("spWrap", 1, callb);
	const _space_wrapped_ = function(pc) {
		return seq(token(/\s+/y).q("*"), callb, token(/\s+/y).q("*"),)(pc);
	}
	Object.setPrototypeOf(_space_wrapped_, Analyzer_proto);
	return _space_wrapped_;
}

function error(msg) {
	const _error_ = function(pc) {
		domain("error", token(/\s*.*/y), msg)(pc);
		pc.errC.eFlag = true;
		domain("after-error", token(/\s+|\S+/y), msg).q("*")(pc);
		return true;
	}
	Object.setPrototypeOf(_error_, Analyzer_proto);
	return _error_;
}

function undefinedError(msg) {
	const _undefined_error_ = function(pc) {
		return error("Undefined error. "+msg)(pc);
	}
	Object.setPrototypeOf(_undefined_error_, Analyzer_proto);
	return _undefined_error_;
}

function deb(callb, a=0, b=0) {
	chekToAnalyzer("deb", 1, callb);
	function _deb_(pc) {
		b = b || pc.text.length;
		if (a <= pc.i && pc.i <= b) {
			debugger;
			const res = callb(pc);
			console.log(`res`, res);
			debugger;
			return res;
		}
	}
	Object.setPrototypeOf(_deb_, Analyzer_proto);
	return _deb_;
}

function chekToAnalyzer(fName, argN, callb) {
	if (! callb || callb instanceof Analyzer_proto) {
		console.error(`Argument`, argN, `(from 1) of function '${fName}()' is not Analiser. There is: \n`, callb?.toString ? callb.toString() : callb);
		throw new Error(`Invalid callback. \n\tArgument ${argN} of function '${fName}()' is not Analiser. \n`);
	} else
		return true;
}

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HighlightAPI)
/* harmony export */ });
/* harmony import */ var _ParseContext_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);


class HighlightAPI {

	constructor (mainRule, clPref="syntax-hl-fk") {
		this.mainRule = mainRule;
		this.clPref   = clPref  ;
		_setCSS(this);
	}

	/**
	 * getHighlighted       (template, firstLineNum, cssClasses)
	 * highlightTextContent (el)
	 * scrollToFirstError   (el)
	 * highlight            (el, template, firstLineNum)
	 * setMainRule          (rule)
	 */

	getHighlighted       (...args) { return getHighlighted       (this, ...args); }
	highlightTextContent (...args) { return highlightTextContent (this, ...args); }
	scrollToFirstError   (...args) { return scrollToFirstError   (this, ...args); }
	highlight            (...args) { return highlight            (this, ...args); }
	setMainRule          (...args) { return setMainRule          (this, ...args); }
}


function getHighlighted(self, text, firstLineNum=1, cssClasses="") {
	const el = document.createElement("div");
	if (typeof cssClasses == "string")
		el.className += " " + cssClasses;
	else if (cssClasses instanceof Array) 
		el.classList.add(...cssClasses);
	else 
		throw new Error([
			"(!) getHighlighted(). ",
			"Argument #3 must be a string, an array of strings, or undefined.",
			"",
			cssClasses+" given.",
			""
		].join("\n"));
	highlight(self, el, text, firstLineNum);
	return el;
}

function highlightTextContent(self, el) {
	return highlight(self, el, el.textContent, getFirstLineNum(el));
}

function scrollToFirstError(self, el) {
	const errEl = el.querySelector(".error");
	if (errEl) {
		// errEl.scrollIntoView();
		const 
			top = errEl.getBoundingClientRect().top - el.getBoundingClientRect().top,
			vpH = el.clientHeight,
			deltaScroll = top - vpH / 2;
		el.scrollTop = deltaScroll;
	}
}

function highlight(self, contentEl, text, firstLineNum=1) {
	if (! (contentEl instanceof HTMLElement))
		throw new Error([
			"(!) highlight(). Argument #1 must be a HTMLElement.",
			"",
			contentEl + " given.",
			""
		].join("\n"));

	if (["executing", "executed", "exec-error"].some((v) => contentEl.classList.contains(v)))
		throw new Error([
			"(!) Highlighter. Already handled.", 
			"",
			contentEl
		].join("\n"));
	
	contentEl.classList.add(self.clPref);
	contentEl.classList.add("executing");
	contentEl.innerHTML = "";

	if (typeof text != "string")
		throw new Error([
			"(!) highlight(). Argument #2 must be a string.",
			"",
			text + " given.",
			""
		].join("\n"));

	try {
		const
			model    = _buildModel(self, text),
			contents = _renderToHighlight(self, model, firstLineNum);
		contents.forEach((lineOb) => lineOb.appendTo(contentEl));
		contentEl.classList.remove("executing");
		contentEl.classList.add("executed");
	} catch (e) {
		console.error(`(!)-CATCHED`, e);
		const lines = text.split("\n");
		lines.forEach((line, i, a) => {
			let lineOb = _makeLine(self, firstLineNum + i);
			let m = line.match(/^(\s*)(.*)/);
			[lineOb.indent.textContent, lineOb.content.textContent] = [m[1], m[2]];
			if (i < a.length - 1)
				lineOb.setEol();
			lineOb.appendTo(contentEl);
		});
		contentEl.classList.remove("executing");
		contentEl.classList.add("exec-error");
	}
}

function setMainRule(self, rule) {
	self.mainRule = rule;
}

function _buildModel(self, text) {
	const mSlot = [];
	self.mainRule(new _ParseContext_js__WEBPACK_IMPORTED_MODULE_0__.default({
		text, 
		i: 0, 
		mSlot, 
		dStack: []
	}));
	return mSlot;
}

function _renderToHighlight (self, model, firstLineNum=1) {
	const content = [], nodeStack = [];
	let lNum = firstLineNum, indentZoneFlag = true, lastLine;
	nodeStack.last = () => nodeStack[nodeStack.length - 1];
	content.push(lastLine = _makeLine(self, lNum ++));
	recur(model);
	return content;
	function recur(sb) {
		if (sb instanceof Array) {
			sb.forEach(recur);
		} else if (typeof sb == "object") {
			sb.parent = nodeStack.last() || null;

			nodeStack.push(sb);
			recur(sb.ch);
			nodeStack.pop();

		} else if (typeof sb == "string") {
			if (sb == "\n") {
				lastLine.setEol();
				content.push(lastLine = _makeLine(self, lNum ++));
				indentZoneFlag = true;
			} else if (indentZoneFlag && sb.match(/^\s+$/)) {
				lastLine.indent.innerHTML += sb;
			} else {
				let _sb = sb;
				if (indentZoneFlag) {
					const m = sb.match(/^(\s*)(.*)/);
					if (! m)
						throw new Error(`sb not matched with /^(\\s+)(.*)/. sb = ${sb}`)
					const
						indent = m[1],
						theText = m[2];
					lastLine.indent.innerHTML += indent;
					_sb = theText;
					indentZoneFlag = false;
				}
				const 
					lastDomainNode = nodeStack.last(),
					className = nodeStack.map(v => v.name).filter(v => v).join("- "),
					el = _evaluate(`<span class="${className || ""}"></span>`);
				if (nodeStack.last()?.name == "error") {
					lastLine.guter.classList.add("error");
					lastLine.guter.title = nodeStack.last()?.msg;
				}
				if (nodeStack.last()?.name == "after-error") {
					lastLine.guter.classList.add("after-error");
					lastLine.guter.title = nodeStack.last()?.msg;
				}
				lastLine.content.appendChild(el);
				el.textContent = _sb;
				el.astNode = nodeStack.last();
				const msgStr = nodeStack.reduce((a,v) => {
					if (v.msg) 
						a += `${v.name} : ${v.msg} \n`;
					return a;
				}, "");
				if (msgStr) {
					el.title = msgStr;
					el.style.cursor = "pointer";
				}
				if (lastDomainNode) {
					el.dataset.region = `${lastDomainNode.i0}:${lastDomainNode.i1}`;
					el.domain = lastDomainNode;
				}
			}
		} else {
			console.error("Invalid model node", sb);
			throw new Error("Invalid model node.")
		}
	}
}

function _makeLine(self, num) {
	return Object.setPrototypeOf(
		{
			line: _evaluate(
				`<span class="${self.clPref}__line">`+
					`<span class="${self.clPref}__line-number" data-line-number="${num}"></span>`+
					`<span class="${self.clPref}__line-indent"></span>`+
					`<span class="${self.clPref}__line-text"  ></span>`+
				`</span>`
			),
			eol: null,
			get guter  () {return this.line.children[0]},
			get indent () {return this.line.children[1]},
			get content() {return this.line.children[2]},
		},
		{
			appendTo: function(parent) {
				parent.appendChild(this.line);
				if (this.eol)
					parent.appendChild(this.eol);
			},
			setEol: function() {this.eol = _evaluate(`<span>\n</span>`);}
		}
	) 
}

function _setCSS(self) {
	
	const cssCode = `
		.syntax-hl-fk {
		  text-align: left;
		  white-space: pre;
		  background-color: #444;
		  color: #ccc;
		  -moz-tab-size: 4;
		  tab-size: 4;
		  overflow: auto;
		  max-height: 500px;
		  padding: 20px;
		  font-family: consolas, monospace; }
		  .syntax-hl-fk *::selection {
		    background-color: #000;
		    background-color: rgba(120, 120, 120, 0.5); }
		  .syntax-hl-fk .syntax-hl-fk__line {
		    margin-left: -20px; }
		    .syntax-hl-fk .syntax-hl-fk__line > * {
		      display: table-cell; }
		    .syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-number {
		      width: 50px;
		      min-width: 50px;
		      max-width: 50px;
		      text-align: right;
		      background-color: #333;
		      padding-right: 10px;
		      margin-right: 5px;
		      transition: all .2s; }
		      .syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-number:before {
		        content: attr(data-line-number) ""; }
		    .syntax-hl-fk .syntax-hl-fk__line span.syntax-hl-fk__line-number.error {
		      color: #fff;
		      background-color: #e48; }
		    .syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-indent {
		      padding-left: 5px; }
		    .syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-text {
		      padding-left: 20px;
		      white-space: pre-wrap;
		      word-break: break-word; }
		      .syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-text .error {
		        color: #fff;
		        background-color: #e48;
		        box-shadow: inset 0 0 2px #fff; }
		      .syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-text:before {
		        content: "";
		        margin-left: -20px; }

	`.replace(/syntax-hl-fk/g, self.clPref);

	const styleClassName = `${self.clPref}__base-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = _evaluate(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		document.head.appendChild(style);
	}
}

function _evaluate (code) {
	const shell = document.createElement("div");
	shell.innerHTML = code;
	return shell.children[0];
}


function getFirstLineNum(el) {
	const dln = parseInt(el.dataset.lineNum);
	if (! dln)
		return 1;
	else if (el.nodeName == "PRE")
		return dln + 1;
	else 
		return dln;
}

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParseContext)
/* harmony export */ });
/* harmony import */ var _ModelNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);


class ParseContext {
	constructor(pc) {
		Object.defineProperties(this,{
			text:   {value: pc.text},
			mSlot:  {value: pc.mSlot},
			dStack: {value: pc.dStack},
			lFStack: {value: pc.lFStack},
			errC: {value: pc.errC || {eFlag: false}},
		});
		this.i = pc.i;
		this.i0 = pc.i0;
		this.selfMN = pc.selfMN;
		this.monitor = pc.monitor;
		// this.debugDomain = pc.debugDomain;
	}
	match (...templs) {
		for (let t of templs) {
			const {mSubstr, len} = this._getMatchSubstr(t);
			if (mSubstr) {
				this.i += len;
				push(this.mSlot, mSubstr);
				this.monitor = this.i+ " : "+this.text.substr(this.i, 20)
				return mSubstr;
			}
		} 
		return "";
	}
	notMatch (...templs) {
		for (let t of templs) {
			const {mSubstr, len} = this._getMatchSubstr(t);
			if (mSubstr) 
				return false;
		}

		const simbol = this.text[this.i];
		push(this.mSlot, simbol);
		this.i += 1;
		this.monitor = this.i+ " : "+this.text.substr(this.i, 20);
		return simbol;
	}
	createHypo () {
		const 
			{text, i, mSlot, dStack, errC} = this,
			hpc = {text, i, mSlot: [], dStack, errC};
		return new ParseContext(hpc);
	}
	acceptHypo (hpc) {
		this.i = hpc.i;
		this.monitor = hpc.monitor;
		// this.mSlot.push(...hpc.mSlot);
		hpc.mSlot.forEach((v) => push(this.mSlot, v));
		return true;
	}
	createChildHypo (name) {
		const 
			{text, i, dStack, errC} = this,
			mSlot = [],
			mn = new _ModelNode_js__WEBPACK_IMPORTED_MODULE_0__.default(name, mSlot),
			hpc = {text, i, i0: i, mSlot, selfMN: mn, dStack, errC};
		mn.i0 = i;
		return new ParseContext(hpc);
	}
	acceptChildHypo (hpc) {
		this.i = this.i1 = hpc.i;
		push(this.mSlot, hpc.selfMN);
		hpc.selfMN.i1 = hpc.i;
		if (hpc.msg)
			hpc.selfMN.msg = hpc.msg;
		hpc.selfMN = null;
		return true;
	}
	_getMatchSubstr (templ) {
		let mSubstr = "", len;
		if (typeof templ == "string") {
			len = templ.length;
			const substr = this.text.substr(this.i, len);
			if (substr === templ)
				mSubstr = substr;
			
		} else if (templ instanceof RegExp) {
			templ.lastIndex = this.i;
			const mOb    = this.text.match(templ);
			mSubstr =  mOb && mOb[0] || "";
			len = mSubstr.length;
		}

		return {mSubstr, len};
	}
}



function push(arr, subj) {
	if (typeof subj == "string") {
		let lines = subj.split("\n");
		for (let [k, line] of lines.entries()) {
			if (k)
				arr.push("\n");
			if (line)
				pushOneLineText(arr, line);
		}
	} else 
		arr.push(subj);
}

function pushOneLineText(arr, subj) {
	let i = arr.length - 1;
	if (
		typeof arr[i] == "string" 
		&& typeof subj == "string" 
		&& arr[i] !== "\n" 
		&& subj !== "\n"
		&& (
			subj.match(/^\s+$/) && arr[i].match(/^\s+$/) 
			||
			! subj.match(/^\s+$/) && ! arr[i].match(/^\s+$/) 
		)
	)
		arr[i] += subj;
	else
		arr.push(subj);
}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModelNode)
/* harmony export */ });
class ModelNode {
	constructor (name, ch) {
		Object.defineProperties(this,{
			name: {value: name},
			ch  : {value: ch},
		});
	}

	get text () {
		let res = "";
		recur(this.ch);
		return res;
		function recur(sb) {
			if (sb instanceof Array) {
				sb.forEach(recur);
			} else if (typeof sb == "object") {
				recur(sb.ch);
			} else {
				res += sb;
			}
		}
	}
}

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setStyle)
/* harmony export */ });
function setStyle(clPref) {

	const cssCode = `
		.line-format-diagram {
		  font-size: 14px;
		  white-space: nowrap;
		  color: #333;
		  margin: 10px 5px;
		  padding: 10px 5px;
		  user-select: none;
		  font-family: consolas, courier, monospace;
		  /*&.executed *{

				display: inline-block;

				text-align: center;

			}*/
		  /*&:not(.executed) {

				font-family: monospace;

				white-space: pre;

				text-align: left;

			}*/ }
		  .line-format-diagram .line-format-diagram-part {
		    display: inline-block;
		    text-align: center;
		    border-right: 1px solid transparent;
		    border-left: 1px solid transparent;
		    margin-right: -1px; }
		    .line-format-diagram .line-format-diagram-part .line-format-diagram-grid-v-liner {
		      margin: 0 1px;
		      display: flex;
		      align-items: center;
		      justify-content: center;
		      height: 50px; }
		    .line-format-diagram .line-format-diagram-part .line-format-diagram-description:hover {
		      user-select: text; }
		    .line-format-diagram .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-h-line {
		      border-top: 1px solid #999;
		      flex-grow: 10; }
		    .line-format-diagram .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-td-block {
		      flex-grow: 1; }
		    .line-format-diagram .line-format-diagram-part .line-format-diagram-line-text {
		      font-size: 20px;
		      font-weight: bold;
		      color: #333;
		      white-space: pre;
		      background-clip: padding-box;
		      border-left: 1px solid transparent;
		      border-right: 1px solid transparent;
		      margin: -1px;
		      margin-top: 5px;
		      font-family: consolas, courier, monospace;
		      user-select: text; }
		    .line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr {
		      border-left: 1px solid transparent;
		      border-right: 1px solid transparent;
		      border-color: #999;
		      padding: 5px 1px;
		      margin: -1px;
		      display: block; }
		      .line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr .line-format-diagram-bottom-rel {
		        text-align: center;
		        display: block;
		        position: relative;
		        border-bottom: 1px solid #999; }
		        .line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr .line-format-diagram-bottom-rel > .line-format-diagram-rel-line {
		          display: inline-block;
		          position: absolute;
		          width: 10px;
		          border-left: 1px solid #999;
		          border-bottom: 1px solid #999;
		          padding-bottom: calc(5px + .5em); }
		          .line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr .line-format-diagram-bottom-rel > .line-format-diagram-rel-line > .line-format-diagram-bottom-descr {
		            position: absolute;
		            left: 100%;
		            white-space: pre;
		            border: 1px solid #999;
		            text-align: left; }
		  .line-format-diagram .line-format-diagram-part.show-borders {
		    border-color: #999; }
		    .line-format-diagram .line-format-diagram-part.show-borders .sps-line-text {
		      border-color: #999; }
		  .line-format-diagram .line-format-diagram-grid-v-liner + .line-format-diagram-part {
		    margin-left: -1px; }
		  .line-format-diagram .line-format-diagram-grid-bv-liner {
		    padding: 5px;
		    border: 4px solid transparent;
		    display: block; }

		.line-format-diagram.top-lines .line-format-diagram-part .line-format-diagram-grid-v-liner {
		  margin-top: 5px;
		  border-top: 1px solid transparent; }

		.line-format-diagram.top-lines .line-format-diagram-part .line-format-diagram-top-descr {
		  border-top: 1px solid #999;
		  align-items: flex-start; }
		  .line-format-diagram.top-lines .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-h-line {
		    border: none; }

		.line-format-diagram.bottom-lines .line-format-diagram-part .line-format-diagram-grid-v-liner {
		  margin-bottom: 5px;
		  border-bottom: 1px solid transparent; }

		.line-format-diagram.bottom-lines .line-format-diagram-part .line-format-diagram-top-descr {
		  border-bottom: 1px solid #999;
		  margin-top: -5px;
		  align-items: flex-end; }
		  .line-format-diagram.bottom-lines .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-h-line {
		    border: none; }

	`.replace(/\bline-format-diagram/g, clPref);

	const styleClassName = `${clPref}__theme-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = eHTML(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		const firstEl = document.head.children[0];
		if (firstEl)
			document.head.insertBefore(style, firstEl);
		else
			document.head.appendChild(style);
	}
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

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildDiagram)
/* harmony export */ });
/* harmony import */ var _lib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



function buildDiagram(self, elem, tOb) {
	elem.classList.add(self.clPref);
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

	recursive(tOb, 0);
	if (bLevels.length)
		bLevels.push(1);
	return {tLevels, bLevels};

	function recursive(tOb, level=0) {
		tLevels[level] ||= 0;

		if (tOb instanceof Array) {

			for (let node of tOb) 
				recursive(node, level);

		} else if (tOb.ch) {

			const node = tOb;

			if ("td" in node) {
				const 
					lines = node.td.split("\n"),
					n = lines.length;
				if (tLevels[level] < n)
					tLevels[level] = n;
				node.topDescr = lines.join("<br/>");
			} else {
				delete node.topDescr;
			}

			if (node.ch)
				if (typeof node.ch != "string")
					recursive(node.ch, level + 1);

			if (node.bd) {
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
			} else {
				delete node.bottomDescr;
			}
		}
	}
}

function _getHtmlStr(templ, opts, tLevels, _bLevels, clPref) {
	let 
		bLevels = _bLevels.map(v => v),
		str     = "",
		serialN = -1;

	recursive(templ, 0);
	return str;

	function recursive(templ, level=0, inheritStyle="", partChIndex=0) {
		if (templ instanceof Array) {
			for (let [index, node] of templ.entries()) 
				recursive(node, level, inheritStyle, index);
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
				`style="${localBdColor}" ` +
				`data-serial-n="${++ serialN}"` +
				`data-part-ch-index="${partChIndex}">`;
			
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
						str += `<div class="${clPref}-grid-v-liner" style="${hFZ}"></div>`; 
					}

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

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DiagramEditor)
/* harmony export */ });
/* harmony import */ var _lib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _buildDiagram_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _selection_event_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14);





class DiagramEditor {
	constructor (clPref, elem, tOb) { constructor(this, clPref, elem, tOb);}
}

function constructor(self, clPref, elem, tOb) {
	elem.innerHTML = "";

	self.clPref      = clPref;
	self.tOb         = tOb;
	self.editPanel   = _getEditPanelDom(self);
	self.codeEditBlock = _getCodeEditBlockDom(self);
	self.editButtons = self.editPanel.querySelector(`.${self.clPref}-edit-buttons`);
	self.navButtons  = self.editPanel.querySelector(`.${self.clPref}-nav-buttons`);
	self.diagram     = _lib_js__WEBPACK_IMPORTED_MODULE_0__.eHTML(`<div class=""><div>`);
	self.partTextField = self.editPanel.querySelector(`.${self.clPref}-edit-part-text-field`);
	self.codeField   = self.codeEditBlock.querySelector(`.${self.clPref}-code-field`);
	self.editStage   = {
			tOb:     tOb.clone,
		};
	self.history   = [];
	self.history.i = -1;


	elem.append(
		self.editPanel, 
		self.diagram, 
		self.codeEditBlock,
	);

	editLoop.commit(self);

	(0,_selection_event_js__WEBPACK_IMPORTED_MODULE_3__.default)(self);

	// self.diagram.setAttribute("contenteditable", "true");
	// self.diagram.oninput = console.log;

}

editLoop.commit = commit;

function commit(self) {
	const {editStage, history} = self;
	this(self);

	history.i ++;
	history[history.i] = editStage.tOb.clone;
	history.splice(history.i + 1, Infinity);

	setBtnEnableDisable(self);
}

function editLoop(self) {
	(0,_buildDiagram_js__WEBPACK_IMPORTED_MODULE_1__.default)(self, self.diagram, self.editStage.tOb);
	self.codeField.textContent = _stringify(self.editStage.tOb);
	self.diagram.querySelectorAll(`.${self.clPref}-td-block`).forEach((v,i,a) => {
		createOnEditField(self, v, "td");
	});
	self.diagram.querySelectorAll(`.${self.clPref}-bottom-descr`).forEach((v,i,a) => {
		createOnEditField(self, v, "bd");
	});
	/*self.diagram.querySelectorAll(`.${self.clPref}-line-text`).forEach((v,i,a) => {
		createOnEditField(self, v, "ch");
	});*/
	self.partTextField.value = "";
	self.partTextField.editedNode = null;
}

function createOnEditField(self, el, fieldName) {
	el.setAttribute("contenteditable", "true");
	el.onfocus = function(ev) {
		this.oldValue = this.textContent;
	}
	el.onblur = function(ev) {
		if (this.oldValue != this.textContent)
			editLoop.commit(self);
	}
	el.oninput = function(ev) {
		const 
			part = _lib_js__WEBPACK_IMPORTED_MODULE_0__.getPart(self, this),
			node = self.editStage.tOb.getBySerial(part.dataset.serialN);
		node[fieldName] = this.textContent;
		self.codeField.textContent = _stringify(self.editStage.tOb);
	}
}

function setBtnEnableDisable(self) {
	const {clPref :pr, history :hist, editPanel :pane} = self;

	pane.querySelector(`.${pr}-nav-undo`)[
		(hist.i <= 0) ? "setAttribute" : "removeAttribute"
	]("disabled", true);
	pane.querySelector(`.${pr}-nav-undo .count`).textContent = hist.i;

	pane.querySelector(`.${pr}-nav-redo`)[
		(hist.i == hist.length - 1) ? "setAttribute" : "removeAttribute"
	]("disabled", true);
	pane.querySelector(`.${pr}-nav-redo .count`).textContent = 
		hist.length - 1 - hist.i;
}

function _getEditPanelDom(self) {
	const pr = self.clPref;
	
	const dom = _lib_js__WEBPACK_IMPORTED_MODULE_0__.eHTML(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-history-buttons" style="float: left;">
				<button class="${pr}-nav-undo" >&nbsp;⤶ <span class="count"></span></button>
				<button class="${pr}-nav-redo" >&nbsp;<span class="count"></span> ⤷</button>
				&nbsp;&nbsp;
			</div>
			<!-- <div class="${pr}-edit-panel__btn-block ${pr}-nav-buttons" style="float: left;">
				<button class="${pr}-nav-left" >⮜</button>
				<button class="${pr}-nav-up"   >⮝</button>
				<button class="${pr}-nav-right">⮞</button>
				<button class="${pr}-nav-down" >⮟</button>
			</div> -->
			<div class="${pr}-edit-panel__btn-block ${pr}-edit-buttons" style="float: right;">
				<button class="${pr}-edit-td"        >td</button>
				<button class="${pr}-edit-bd"        >bd</button>
				&nbsp;
				<button class="${pr}-edit-split"     >split</button>
				<button class="${pr}-edit-join"      >join</button>
				&nbsp;
				<button class="${pr}-edit-wrap"      >wrap</button>
				<button class="${pr}-edit-unwrap"    >unwrap</button>
			</div>
			<div style="clear: both;"></div>
			<br>
			<div>
				<input class="${pr}-edit-part-text-field" 
					style="
						width: calc(100% - 6px); 
						text-align: center;
						font-family: consolas, monospace;
					">
			</div>
			<br>
		</div>
	`);

	dom.querySelector(`.${pr}-edit-buttons`).onclick = function(ev) {
		const {rootNode, a, b} = self.editStage.selArgs;
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		if (tClass(`${pr}-edit-td`)) {
			rootNode.td ? delete rootNode.td : rootNode.td = "X";
		} else 
		if (tClass(`${pr}-edit-bd`)) {
			rootNode.bd ? delete rootNode.bd : rootNode.bd = "X";
		} else 
		if (tClass(`${pr}-edit-split`)) {
			rootNode.split(a, b);
		} else 
		if (ev.target.classList.contains(`${pr}-edit-wrap`)) {
			rootNode.wrap(a, b);
		} else 
		if (tClass(`${pr}-edit-unwrap`)) {
			rootNode.unwrap(a, b);
		} else 
		if (tClass(`${pr}-edit-join`)) {
			rootNode.join(a, b);
		}  
		editLoop.commit(self);
	};

	dom.querySelector(`.${pr}-nav-undo`).onclick = function(ev) {}
	dom.querySelector(`.${pr}-nav-redo`).onclick = function(ev) {}

	dom.querySelector(`.${pr}-history-buttons`).onclick = function (ev) {
		const {editStage, history} = self;
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		let t = ev.target;
		do {

			if        (t.classList.contains(`${pr}-nav-undo`)) {
				if (history[history.i - 1]) {
					editStage.tOb = history[-- history.i].clone;
					setBtnEnableDisable(self);
					editLoop(self);
				}
			} else if (t.classList.contains(`${pr}-nav-redo`)) {
				if (history[history.i + 1]) {
					editStage.tOb = history[++ history.i].clone;
					setBtnEnableDisable(self);
					editLoop(self);
				}
			}else 
				continue;
			break;

		} while (t != this && (t = t.parentElement));
	};

	/*dom.querySelector(`.${pr}-nav-buttons`).onclick = function (ev) {
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		if        (tClass(`${pr}-nav-left`)) {
			// ...
		} else if (tClass(`${pr}-nav-up`)) {
			// ...
		} else if (tClass(`${pr}-nav-right`)) {
			// ...
		} else if (tClass(`${pr}-nav-down`)) {
			// ...
		}

	};*/

	dom.querySelector(`.${pr}-edit-part-text-field`).onfocus = function(ev) {
		this.tsartValue = this.value
	}

	dom.querySelector(`.${pr}-edit-part-text-field`).oninput = function (ev) {
		const node = this.editedNode;
		if (typeof this.editedNode?.ch != "string")
			throw new Error();
		this.editedNode.ch = this.value;
		self.codeField.textContent = _stringify(self.editStage.tOb);
	}

	dom.querySelector(`.${pr}-edit-part-text-field`).onblur = function(ev) {
		if (this.tsartValue != this.value)
			editLoop.commit(self);
	}
	return dom;
}

function _getCodeEditBlockDom(self) {
	const pr = self.clPref;
	const dom = _lib_js__WEBPACK_IMPORTED_MODULE_0__.eHTML(`
		<div class="${pr}-code-edit-block">
			<div class="${pr}-code-edit-panel">
				<div style="float: left;">
					<!-- <button class="${pr}-apply">Apply</button>
					&nbsp; -->
					<button class="${pr}-discard">Discard</button>
					<!-- <button class="${pr}-new-blank">New Blank</button> -->
				</div>
				<div style="float: right;">
					<button class="${pr}-to-clipboard">To Clipboard</button>
				</div>
				<div style="clear: both;"></div>
			</div>
			<div style="padding: 5px 100px;">
				<pre class="${pr}-code-field" contenteditable="true"></pre>
			</div>
		</div>
	`);

	dom.querySelector(`.${pr}-code-field`).onfocus = function(ev) {
		this.oldValue = this.textContent;
	};
	dom.querySelector(`.${pr}-code-field`).onblur = function(ev) {
		if (this.oldValue != this.textContent) {
			const {object, error, text} = 
				_lib_js__WEBPACK_IMPORTED_MODULE_0__.tryParseJSON(self.codeField.textContent);
			// editLoop.commit(self);
			if (object) {
				self.editStage.tOb = object.clone;
				editLoop.commit(self);
			} else if (error) {
				const 
					hl = new _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_2__.default("e-s-json-err-hl"),
					codeField = hl.getHighlighted(text);
				self.diagram.innerHTML = "";
				self.diagram.appendChild(codeField);
				hl.scrollToFirstError(codeField);
				console.error(`(!) \n`, self.diagram, "\n", error);
			}
		}
	};

	dom.onclick = function (ev) {
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		/*if        (tClass(`${pr}-new-blank`)) {
			const str = [
				`{`,
				`    "ch": [`,
				`        {`,
				`            "td": "main",`,
				`            "ch": ""`,
				`        }`,
				`    ]`,
				`}`,
			].join("\n");
			self.codeField.textContent = str;
			self.editStage.tOb = JSON.parse(str);
			editLoop.commit(self);
		} else if (tClass(`${pr}-apply`)) {
			const {object, error, text} = 
				lib.tryParseJSON(self.codeField.textContent);
			if (object) {
				self.editStage.tOb = object.clone;
				editLoop.commit(self);
			} else if (error) {
				const 
					hl = new JsonEHl("e-s-json-err-hl"),
					codeField = hl.getHighlighted(text);
				self.diagram.innerHTML = "";
				self.diagram.appendChild(codeField);
				hl.scrollToFirstError(codeField);
				console.error(`(!) \n`, self.diagram, "\n", error);

			}
		} else*/ if (tClass(`${pr}-discard`)) {
			const codeField = dom.querySelector(`.${pr}-code-field`);
			codeField.focus();
			codeField.textContent = codeField.oldValue = _stringify(self.editStage.tOb);
			editLoop(self);
		} else if (tClass(`${pr}-to-clipboard`)) {
			const str = self.codeField.textContent;

			const tA = document.createElement("textarea");
			tA.value = str;
			document.body.appendChild(tA);
			tA.select();
			document.execCommand("copy");
			document.body.removeChild(tA);
		}

	};

	return dom;
}


function _stringify(tOb) {
	return JSON.stringify(tOb, null, 4);
}

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setSelectionEvent)
/* harmony export */ });
/* harmony import */ var _lib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


function setSelectionEvent(self) {
	// document.onselectionchange = function (ev) {
	document.addEventListener("selectionchange", function (ev) {

		defineSelArgs(self);
	});
}

function defineSelArgs(self) {
	const 
		sel = window.getSelection();
	if (sel.rangeCount) {
		const
			rangeA = sel.getRangeAt(0),
			rangeB = sel.getRangeAt(sel.rangeCount - 1),
			{
				commonAncestorContainer :rootEl ,
				startContainer          :startEl,
			} = rangeA,
			{
				endContainer            :endEl  ,
			} = rangeB;

		const 
			rootPart = getPart(self, rootEl),
			rootNode = rootPart ? 
				self.editStage.tOb.getBySerial(rootPart.dataset.serialN) : null;
		if (rootNode && typeof rootNode.ch == "string") {
			self.partTextField.editedNode = rootNode;
			self.partTextField.value      = rootNode.ch;
		}

		if (rootPart) {
			let a, b, aEl, bEl;

			if (startEl == endEl) {
				a = rangeA.startOffset;
				b = rangeB.endOffset;
			} else {
				aEl = (function () {
					let el = startEl;
					do {
						if (el.parentElement == rootPart)
							return el;
					} while (el = el.parentElement);
				})();
				bEl = (function () {
					let el = endEl;
					do {
						if (el.parentElement == rootPart)
							return el;
					} while (el = el.parentElement);
				})();

				a = parseInt(aEl.dataset.partChIndex);
				b = parseInt(bEl.dataset.partChIndex) + 1;
			}
			self.editStage.selArgs = {
				rootNode,
				rootPart,
				aEl,
				bEl,
				a,
				b,
			}

			self.diagram.querySelectorAll(`.${self.clPref}-part`).forEach((v) => {
				v.style.boxShadow = "";
				v.style.background = "";
			});

			self.diagram.querySelectorAll(`*`).forEach((v) => {
				v.style.boxShadow = "";
				v.style.background = "";
			});
			rootPart.style.boxShadow = "inset 0 0 5px #777, 0 0 5px #777";
			if (aEl) {
				let el = aEl;
				do {
					el.style.background = `
						repeating-linear-gradient(
							135deg, 
							rgba(126,126,126,.2) 0, 
							rgba(126,126,126,.2) 5px, 
							transparent          5px, 
							transparent          10px
						)
					`;
					// el.style.background = "rgba(100,200,100,.3)";
				} while (el != bEl && (el = el.nextElementSibling));
			}
			/*if (aEl) 
				aEl.style.background = "rgba(100,200,100,.3";
			if (bEl) 
				bEl.style.background = "rgba(100,200,100,.3";*/

			let n = 0;
			console.groupCollapsed("defineSelArgs");
			console.log("");
			console.log(++ n, "rangeA"  , rangeA  );
			console.log(++ n, "rangeB"  , rangeB  );
			console.log(++ n, "rootPart", rootPart);
			console.log(++ n, "rootNode", rootNode);
			console.log(++ n, "aEl"     , aEl     );
			console.log(++ n, "a"       , a       );
			console.log(++ n, "bEl"     , bEl     );
			console.log(++ n, "b"       , b       );
			console.groupEnd();

			return;
		}
	}

	self.editStage.selArgs = {};
	return;
}

function getPart(self, el) {
	return recur(el);
	function recur(el) {
		if (isPart(self, el)) 
			return el;
		if (el.parentElement)
			return recur(el.parentElement);
	}
}

function isPart(self, el) {
	return el.classList?.contains(`${self.clPref}-part`);
}

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	LineFormatDiagram = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=lfd-bundle.js.map