var EScheme;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JsonErrHlter)
/* harmony export */ });
/* harmony import */ var _set_style_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);



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
			return token(/\\[\\ntbu'"`]/y)(pc);
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
				q(alter(d.slashed, nToken('"')), "*"),
				token('"'),
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
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _describeAPI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Highlighter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	version: "5.1.0",
	describeAPI: _describeAPI_js__WEBPACK_IMPORTED_MODULE_0__.default,
	Highlighter: _Highlighter_js__WEBPACK_IMPORTED_MODULE_1__.default,
});

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
		chekToAnalyzer("q", 1, callb);
		return seq(this, callb);
	},
	or : function (callb) {
		chekToAnalyzer("q", 1, callb);
		return alter(this, callb);
	},
	break : function (...args) {
		for (let [k, callb] of args.entries())
			chekToAnalyzer("seq", k + 1, callb);
		let message = "";
		const _error_test_ = (pc) => {
			if(this(pc)) {
				seq(...args).or(undefinedError(message))(pc);
				return true;
			} else {
				return false;
			}
		}
		insertProto(Analyzer_proto, _error_test_);
		_error_test_.msg = function(msg) {
			message = msg;
			return this;
		}
		return _error_test_;
	},
	catch : function (msg) {
		const _wrong_ = (pc) => {
			return alter(
				this,
				error(msg)
			)(pc);
		}
		insertProto(Analyzer_proto, _wrong_);
		return _wrong_;
	},
	deb : function (i0=0, i1=0) {
		return deb(this, i0, i1);
	},
};

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
	insertProto(Analyzer_proto, _seq_);
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
	insertProto(Analyzer_proto, _alter_);
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
			return callb(pc) && q(callb(pc), "*");
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

	insertProto(Analyzer_proto, _q_);
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
	insertProto(Analyzer_proto, _not_);
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
	insertProto(Analyzer_proto, _domain_);
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
	insertProto(Analyzer_proto, _rule_);
	return _rule_;
}

function token(templ) {
	const _token_ = function _token_(pc) {
		return pc.match(templ);
	}
	insertProto(Analyzer_proto, _token_);
	return _token_;
}

function nToken(templ) {
	const _notToken_ = function _notToken_(pc) {
		return pc.notMatch(templ);
	}
	insertProto(Analyzer_proto, _notToken_);
	return _notToken_;
}

function spToken(templ) {
	const _space_wrapped_token_ = function(pc) {
		return seq(token(/\s+/y).q("*"), token(templ), token(/\s+/y).q("*"),)(pc);
	}
	insertProto(Analyzer_proto, _space_wrapped_token_);
	return _space_wrapped_token_;
}

function spWrap(callb) {
	chekToAnalyzer("spWrap", 1, callb);
	const _space_wrapped_ = function(pc) {
		return seq(token(/\s+/y).q("*"), callb, token(/\s+/y).q("*"),)(pc);
	}
	insertProto(Analyzer_proto, _space_wrapped_);
	return _space_wrapped_;
}

function error(msg) {
	const _error_ = function(pc) {
		domain("error", token(/\s*.*/y), msg)(pc);
		pc.errC.eFlag = true;
		domain("after-error", token(/\s+|\S+/y), msg).q("*")(pc);
		return true;
	}
	insertProto(Analyzer_proto, _error_);
	return _error_;
}

function undefinedError(msg) {
	const _undefined_error_ = function(pc) {
		return error("Undefined error. "+msg)(pc);
	}
	insertProto(Analyzer_proto, _undefined_error_);
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
	insertProto(Analyzer_proto, _deb_);
	return _deb_;
}

function insertProto(proto, ob) {
	return Object.setPrototypeOf(ob, Object.setPrototypeOf(proto, Object.getPrototypeOf(ob)));
}

function chekToAnalyzer(fName, argN, callb) {
	if (! callb || callb instanceof Analyzer_proto) {
		console.error(`Argument`, argN, `(from 1) of function '${fName}()' is not Analiser. There is: \n`, callb?.toString ? callb.toString() : callb);
		throw new Error(`Invalid callback. \n\tArgument ${argN} of function '${fName}()' is not Analiser. \n`);
	} else
		return true;
}

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HighlightAPI)
/* harmony export */ });
/* harmony import */ var _ParseContext_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);


function HighlightAPI (mainRule, clPref="syntax-hl-fk") {

	setCSS();
	return {
		highlight,            // (contentEl, text, firstLineNum=1)
		highlightTextContent, // (el)
		setMainRule,          // (rule)
		scrollToFirstError,   // (el)
	}

	function highlightTextContent(el) {
		return highlight(el, el.textContent, (el.dataset.lineNum*1 + 1) || 1);
	}

	function scrollToFirstError(el) {
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

	function highlight(contentEl, text, firstLineNum=1) {
		if (["executing", "executed", "exec-error"].some((v) => contentEl.classList.contains(v)))
			throw new Error("(!) Highlighter. Already handled.", contentEl);
		
		contentEl.classList.add("executing");
		contentEl.innerHTML = "";
		try {
			const
				model    = buildModel(text),
				contents = renderToHighlight(model, firstLineNum);
			contents.forEach((lineOb) => lineOb.appendTo(contentEl));
			contentEl.classList.remove("executing");
			contentEl.classList.add("executed");
		} catch (e) {
			console.error(`(!)-CATCHED`, e);
			const lines = text.split("\n");
			lines.forEach((line, i, a) => {
				let lineOb = makeLine(firstLineNum + i);
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


	function buildModel(text) {
		const mSlot = [];
		mainRule(new _ParseContext_js__WEBPACK_IMPORTED_MODULE_0__.default({
			text, 
			i: 0, 
			mSlot, 
			dStack: []
		}));
		return mSlot;
	}

	function renderToHighlight (model, firstLineNum=1) {
		const content = [], nodeStack = [];
		let lNum = firstLineNum, indentZoneFlag = true, lastLine;
		nodeStack.last = () => nodeStack[nodeStack.length - 1];
		content.push(lastLine = makeLine(lNum ++));
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
					content.push(lastLine = makeLine(lNum ++));
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
						el = evaluate(`<span class="${className || ""}"></span>`);
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

	function makeLine(num) {
		return Object.setPrototypeOf(
			{
				line: evaluate(
					`<span class="${clPref}__line">`+
						`<span class="${clPref}__line-number" data-line-number="${num}"></span>`+
						`<span class="${clPref}__line-indent"></span>`+
						`<span class="${clPref}__line-text"  ></span>`+
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
				setEol: function() {this.eol = evaluate(`<span>\n</span>`);}
			}
		) 
	}

	function setCSS() {
		
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

		`.replace(/syntax-hl-fk/g, clPref);

		const styleClassName = `${clPref}__base-style`;

		const styleAlreadyExists = [].some.call(
			document.querySelectorAll(`style.${styleClassName}`), 
			(v) => v.textContent === cssCode
		);

		if (! styleAlreadyExists) {
			const style = evaluate(`<style class="${styleClassName}"></style>`);
			style.textContent = cssCode;
			document.head.appendChild(style);
		}
	}

	function evaluate (code) {
		const shell = document.createElement("div");
		shell.innerHTML = code;
		return shell.children[0];
	}

	function setMainRule(rule) {
		mainRule = rule;
	}
}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParseContext)
/* harmony export */ });
/* harmony import */ var _ModelNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


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
	match (templ) {
		const {mSubstr, len} = this._getMatchSubstr(templ);

		if (mSubstr) {
			this.i += len;
			push(this.mSlot, mSubstr);
			this.monitor = this.i+ " : "+this.text.substr(this.i, 20)
			return mSubstr;
		} else
			return "";
	}
	notMatch (templ) {
		const {mSubstr, len} = this._getMatchSubstr(templ);

		if (mSubstr) {
			return false;
		} else {
			const simbol = this.text[this.i];
			push(this.mSlot, simbol);
			this.i += 1;
			this.monitor = this.i+ " : "+this.text.substr(this.i, 20);
			return simbol;
		}


		const hpc = this.createHypo();
		if (! hpc.match(templ)) {
			this.match(this.text[this.i]);
			return true;
		} else
			return false;
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
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setStyle)
/* harmony export */ });
function setStyle(clPref) {

	const cssCode = `
	.e-scheme {
	  font-size: 14px;
	  white-space: nowrap;
	  color: #333;
	  margin: 20px 5px;
	  padding: 20px 5px;
	  user-select: none;
	  font-family: consolas, courier, monospace; }
	  .e-scheme.executed * {
	    display: inline-block;
	    text-align: center; }
	  .e-scheme:not(.executed) {
	    font-family: monospace;
	    white-space: pre;
	    text-align: left; }
	  .e-scheme .e-scheme-part {
	    border-right: 1px solid transparent;
	    border-left: 1px solid transparent;
	    margin-right: -1px; }
	    .e-scheme .e-scheme-part .e-scheme-grid-v-liner {
	      margin: 0 1px;
	      display: flex;
	      align-items: center;
	      justify-content: center;
	      height: 50px; }
	    .e-scheme .e-scheme-part .e-scheme-description:hover {
	      user-select: text; }
	    .e-scheme .e-scheme-part .e-scheme-top-descr .e-scheme-h-line {
	      border-top: 1px solid #999;
	      flex-grow: 10; }
	    .e-scheme .e-scheme-part .e-scheme-top-descr .e-scheme-td-block {
	      flex-grow: 1; }
	    .e-scheme .e-scheme-part .e-scheme-line-text {
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
	    .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr {
	      border-left: 1px solid transparent;
	      border-right: 1px solid transparent;
	      border-color: #999;
	      padding: 5px 1px;
	      margin: -1px;
	      display: block; }
	      .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr .e-scheme-bottom-rel {
	        display: block;
	        position: relative;
	        border-bottom: 1px solid #999; }
	        .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr .e-scheme-bottom-rel > .e-scheme-rel-line {
	          position: absolute;
	          width: 10px;
	          border-left: 1px solid #999;
	          border-bottom: 1px solid #999;
	          padding-bottom: calc(5px + .5em); }
	          .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr .e-scheme-bottom-rel > .e-scheme-rel-line > .e-scheme-bottom-descr {
	            position: absolute;
	            left: 100%;
	            white-space: pre;
	            border: 1px solid #999;
	            text-align: left; }
	  .e-scheme .e-scheme-part.show-borders {
	    border-color: #999; }
	    .e-scheme .e-scheme-part.show-borders .sps-line-text {
	      border-color: #999; }
	  .e-scheme .e-scheme-grid-v-liner + .e-scheme-part {
	    margin-left: -1px; }
	  .e-scheme .e-scheme-grid-bv-liner {
	    padding: 5px;
	    border: 4px solid transparent;
	    display: block; }

	.e-scheme.top-lines .e-scheme-part .e-scheme-grid-v-liner {
	  margin-top: 5px;
	  border-top: 1px solid transparent; }

	.e-scheme.top-lines .e-scheme-part .e-scheme-top-descr {
	  border-top: 1px solid #999;
	  align-items: flex-start; }
	  .e-scheme.top-lines .e-scheme-part .e-scheme-top-descr .e-scheme-h-line {
	    border: none; }

	.e-scheme.bottom-lines .e-scheme-part .e-scheme-grid-v-liner {
	  margin-bottom: 5px;
	  border-bottom: 1px solid transparent; }

	.e-scheme.bottom-lines .e-scheme-part .e-scheme-top-descr {
	  border-bottom: 1px solid #999;
	  margin-top: -5px;
	  align-items: flex-end; }
	  .e-scheme.bottom-lines .e-scheme-part .e-scheme-top-descr .e-scheme-h-line {
	    border: none; }

	 `.replace(/e-scheme/g, clPref);

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EScheme)
/* harmony export */ });
/* harmony import */ var _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _set_style_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);


class EScheme {
	constructor (clPref="e-scheme") {
		this.clPref = clPref;
		(0,_set_style_js__WEBPACK_IMPORTED_MODULE_1__.default)(clPref);
	}

	get version () {return "2.1.0"}

	static get version () {return this.prototype.version;}

	build (container, template=null) {
		if (["executing", "executed"].some((v) => container.classList.contains(v))) {
			console.error(`(!) Expression Scheme:`, `Dowble execution. \n`, container);
			return;
		}
		container.classList.add("executing");

		const opts = Object.assign({
			style:  "",
			bdColor: "",
			lineNum: 0,
		}, container.dataset);

		opts.bdColor = opts.bdColor ? ` border-color: ${opts.bdColor}; ` : "";

		template = template || container.textContent;

		let tOb; 

		if (typeof template == "string") {
			try {
				tOb = JSON.parse(template);
			} catch (err) {
				const firstLineNum = opts.lineNum * 1;
				const 
					json = template,
					highlighyer = new _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_0__.default("e-s-json-err-hl");
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

		container.innerHTML = htmlStr;
		container.dataset.eSchemeVersion = this.version;
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

	function recursive(templ, level=0, inheritStyle="") {
		templ.forEach((v) => {
			const
				hFZ = getHFZ(tLevels[level]);

			v = Object.assign({
				tbStyle: "",
				tdStyle: "",
				style  : "",
				bbStyle: "",
				bdStyle: "",
			}, v);

			let 
				localBdColor = "border-color: transparent;",
				showBdsClass = "";

			if ("topDescr" in v) {
				showBdsClass = "show-borders";
				localBdColor = opts.bdColor;
			} else {}

			str += `<div class="${clPref}-part ${showBdsClass}" style="${localBdColor}">`;
			
			if ("topDescr" in v)
				str += [
					`<div `,
						`class="`,
							`${clPref}-top-descr `,
							`${clPref}-description `,
							`${clPref}-grid-v-liner`,
						`" `,
						`style="`,
							`\n/* Autogenerated*/  ${hFZ}`,
							`\n/*Common bdColor*/  ${opts.bdColor}`,
						`"`,
					`>`,

						`<div `,
							`class="${clPref}-h-line"   `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor} `,
								`\n/* Local tbStyle*/  ${v.tbStyle}"`,
						`></div>`,

						`<div `,
							`class="${clPref}-td-block" `,
							`style="/*Local tdStyle*/  ${v.tdStyle}"`,
						`>`,
								`${v.topDescr}`,
						`</div>`,

						`<div `,
							`class="${clPref}-h-line"   `,
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
						let hFZ = getHFZ(tLevels[i]);
						str += `<div class="${clPref}-grid-v-liner" style="${hFZ}"></div>`; 
					}
					
					sPartN ++;

					str += [
						`<div `,
							`class="${clPref}-line-text part-${sPartN}" `,
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
					`<div class="${clPref}-bottom-rel-wr" `,
						`style="/*Common bdColor*/  ${opts.bdColor}">`,

						`<div class="${clPref}-bottom-rel" `,
							`style="`,
								`\n/*Common bdColor*/  ${opts.bdColor}`,
								`\n/* Local bbStyle*/  ${(v.bbStyle)}`,
							`">`,

							`<div class="${clPref}-rel-line" `,
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
										`${clPref}-grid-bv-liner`,
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

function getLinersHtmlStr(bLevels, clPref) {
	let str = "";
	for (let i = bLevels.length - 1; 0 <= i; i --) 
		str += `<div class="${clPref}-grid-bv-liner" `+
			`style="/*Autogenerated*/  height: ${bLevels[i] * 1.3}em"></div>`;
	
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
})();

EScheme = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=e-scheme-bundle.js.map