class ExpressionScheme  {

	get version() {
		return "git";
	}
	
	static build(container, templ=null) {
		const self = this;
		if (container.classList.contains("executed")) {
			console.error(`(!) Expression Scheme:`, `Dowble execution. \n`, container);
			return;
		}
		var 
			lineTextStyle = container.dataset.lineTextStyle || "",
			bdColor = container.dataset.bdColor && ` border-color: ${container.dataset.bdColor};` || "";
		var 
			tLevels = [],
			bLevels = [];

		if (!templ)
			templ = container.textContent;

		if (typeof templ == "string")
			templ = getTempl(templ);

		if (typeof templ == "string") {  // Error is detected!
			container.innerHTML = templ;
			container.style.whiteSpace = "pre-wrap";
			return;
		}

		getLevels(templ);
		var linesHtmlStr = getLinersHtmlStr();

		container.innerHTML = `<!-- version ${this.version} -->` + getHtmlStr(templ) + linesHtmlStr;
		container.classList.add("executed");

		function getTempl(json) {
			try {
				return JSON.parse(templ);
			} catch(err) {
				console.error(err);
				// console.log(`err`);console.dir(err);
				if (self.jsonErrorHl) {
					const codePre = document.createElement("pre");
					codePre.className = "json-error-hl";
					container.parentElement.insertBefore(codePre, container);
					self.jsonErrorHl.highlight(codePre, json, container.dataset.lineNum || 1);
					self.jsonErrorHl.highlight.scrollToFirstError(codePre);
				} else if (window.findJsonError) {
					return window.findJsonError(json).getMarkedStr();
				}
			}
		}

		function getLineCount(str) {
			if (str === undefined || str === null)
				return 0;
			return str.split(/<\s?br\s?[/]?>/).length;
		}

		function replaceEOL(str) {
			return str.replace(/\n/g, "<br>");
		}

		function getLevels(templ) {
			var 
				bDCount = 0;

			recursive(templ, 0);
			bLevels.push(1);

			function recursive(templ, level=0) {
				tLevels[level] = tLevels[level] || 0;

				templ.forEach((v) => {

					if ("td" in v) {
						v.topDescr = replaceEOL(v.td);
					}
					v.inner = v.ch;
					if (v.inner)
						if (typeof v.inner != "string")
							recursive(v.inner, level + 1);

					var lineCount = getLineCount(v.topDescr);
					if (tLevels[level] < lineCount)
						tLevels[level] = lineCount;

					v.bottomDescr = v.bottomDescr || v.bd;
					if (v.bottomDescr)
						if (typeof v.inner == "string") {
							v.bottomDescr = replaceEOL(v.bottomDescr);
							bLevels.push(getLineCount(v.bottomDescr))
						} else {
							v.bottomDescr = null;
							v.errors = v.errors || [];
							v.errors.push("'v.bottomDescr' is deleted.");
						}
				});
			}
		}

		function getLinersHtmlStr() {
			var str = "";
			for (var i = bLevels.length - 1; 0 <= i; i --) 
				str += `<div class="es-grid-bv-liner" style="height: ${bLevels[i] * 1.3}em"></div>`;
			
			return str;
		}

		function getHFZ(lineCount) {
			return `height: ${lineCount * 1.5}em; font-size: 1em; `;
		}

		function getHtmlStr(templ) {
			var 
				str    = "",
				sPartN = 0;

			recursive(templ, 0);
			return str;

			function recursive(templ, level=0) {
				templ.forEach((v) => {
					var hFZ = getHFZ(tLevels[level]), showBdsClass = "";
					var localBdColor = "border-color: transparent;";

					if ("topDescr" in v) {
						showBdsClass = "show-borders";
						localBdColor = bdColor;
					} else {}

					str += `<div class="es-part ${showBdsClass}" style="${localBdColor}">`;
					
					if ("topDescr" in v)
						str += `<div 
							class="es-top-descr es-description es-grid-v-liner" 
							style="${hFZ+bdColor}"
						>${v.topDescr}</div>`;
					else 
						str += `<div class="es-grid-v-liner" style="${hFZ}"></div>`;

					if (v.inner)
						if (typeof v.inner != "string") {
							recursive(v.inner, level + 1);
						} else {

							for (var i = level + 1; i < tLevels.length; i++) {
								let hFZ = getHFZ(tLevels[i]);
								str += `<div class="es-grid-v-liner" style="${hFZ}"></div>`; 
							}
							
							sPartN ++;

							let styleStr = bdColor+lineTextStyle;
							if (container.dataset["lineTextStyleP"+sPartN])
								styleStr += container.dataset["lineTextStyleP"+sPartN];

							styleStr += v.style || "";

							str += `<div 
								class="es-line-text part-${sPartN}" 
								style="${styleStr} ${localBdColor}"
							>${v.inner}</div>`;
						}

					if (v.bottomDescr) {

						var strCount = bLevels.shift();
						str += `
							<div class="es-bottom-rel-wr" style="${bdColor}">
								<div class="es-bottom-rel" style="${bdColor}">
									<div class="es-rel-line" style="${bdColor}">`;

						bLevels.forEach((v) => {
							str += `<div class="es-grid-bv-liner" style="height: ${v * 1.2}em"></div>`;
						});

						str += `
										<div class="es-bottom-descr es-description es-grid-bv-liner" style="height: ${strCount * 1.2}em; ${bdColor}">${v.bottomDescr}</div>
									</div>
								</div>
							</div>
						`;
					}

					

					str += `</div>`; // .es-part
				});
			}
		}
	}
}

ExpressionScheme.jsonErrorHl = (function(){
	return makeJsonErrorHl();

	function makeJsonErrorHl() {
		const {
			ParseContext,
			seq,
			alter,
			q,
			not,
			domain,
			rule,
			token,
			deb,
		} = HlFwCore();

		const
			__main_ = rule(function(pc) {
				return seq(
					r.space.q("*"),
					alter(
						r.subject,
						err.msg("expected subject")
					),
					r.space.q("*"),
					err.msg("unwanted symbol after end of code").q("*"),
				)(pc);
			}),
			list = rule(function(pc) {
				if (token("[").in("list__open")(pc)) {
					r.space.q("*")(pc);
					r.subject.q("*/", r.coma_sep.in("list__coma"))(pc);
					r.space.q("*")(pc);
					token("]").in("list__close").or(err.msg("expected closing bracket ' ] ' or coma ' , '"))(pc);
					return true;
				} else
					return false;
			}),
			dict = rule(function(pc) {
				if (r.curly_op(pc)) {
					alter(
						seq(r.curly_cl),
						seq(
							seq(
								d.string_n.or(err.msg("expected string name of field")),
								r.colon_sep.or(err.msg("expected colon ' : '")),
								r.subject.or(err.msg("expected subject - (null | boll | number | string | list | dict)"))
							).q("*/", r.coma_sep),
							seq(r.curly_cl).or(err.msg("expected closing curly ' } ' or coma ' , '")),
						),
					)(pc);
					return true;
				} else
					return false;
			}),
			err = domain("error", function(pc) {
				return pc.match(/\s*.*/y);
			}),
			d = {
				string_v : domain("string_v" , function(pc) {
					return r.string(pc);
				}),
				string_n : domain("string_n" , function(pc) {
					return r.string(pc);
				}),
				slashed : domain("slashed", function(pc) {
					return pc.match(/\\[\\ntbu'"`]/y);
				}),
				number          : domain("number", function(pc) {
					return pc.match(/\b\d+\.|\.\d+\b|\b\d+\.?\d*\b/y);
				}),
				bool            : domain("bool", function(pc) {
					return pc.match(/\btrue\b|\bfalse\b/y);
				}),
				_null           : domain("_null", function(pc) {
					return pc.match(/\bnull\b/y);
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
				coma_sep      : rule(function(pc) {
					return seq(
						r.space.q("*"),
						token(","),
						r.space.q("*"),
						)(pc);
				}),
				colon_sep      : rule(function(pc) {
					return seq(
						r.space.q("*"),
						token(":"),
						r.space.q("*"),
						)(pc);
				}),
				curly_op      : rule(function(pc) {
					return seq(token("{"), r.space.q("*"))(pc);
				}),
				curly_cl      : rule(function(pc) {
					return seq(r.space.q("*"), token("}"))(pc);
				}),
				string        : rule(function(pc) {
					return pc.match('"')
						&& q(pc => d.slashed(pc) || pc.notMatch('"'), "*")(pc) 
						&& pc.match('"');
				}),
				space           : rule(function(pc) {
					return pc.match(/\s+/y);
				}),
			};

		return makeUserAPI(ParseContext, __main_);
	}

	function HlFwCore() {
		const Analyzer_proto = _make_Analizer_proto();

		function _make_Analizer_proto() {
			const Analyzer_proto = {
				q : function wr_q(quanto, sepCallb=null) {
					return q(this, quanto, sepCallb);
				},
				in : function wr_inDomainin(name) {
					return domain(name, this);
				},
				and : function wr_and(callb) {
					return seq(this, callb);
				},
				or : function wr_or(callb) {
					return alter(this, callb);
				},
				deb : function wr_deb(i0=0, i1=0) {
					return deb(this, i0, i1);
				},
			};

			return Analyzer_proto;
		}

		function seq(...callbs) {
			function _seq_(pc) {
				const hpc = pc.createHypo();
				for (let [k, callb] of callbs.entries()) {
					chekToAnaliser(callb);
					const res = callb(hpc);
					if (res) 
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
			function _alter_(pc) {
				let res;
				for (let [k, callb] of callbs.entries()) {
					chekToAnaliser(callb);
					const res = callb(pc);
					if (res)
						return true;
				}
				return false;
			}
			insertProto(Analyzer_proto, _alter_);
			return _alter_;
		}

		function q(callb, quanto, callb2=null) {
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
				_q_ = function _q_zero_or_many_sep_(pc) {
					seq(
						callb,
						seq(callb2, callb).q("*")
					)(pc);
					return true;
				}
			} else if (quanto == "+/") {
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
			const _not_ = function _not_(pc) {
				const hpc = pc.createHypothesis();
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
				if (status) 
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
				if (status) 
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

		function deb(callb, a=0, b=0) {
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

		class ParseContext {
			constructor(pc) {
				Object.defineProperties(this,{
					text:   {value: pc.text},
					mSlot:  {value: pc.mSlot},
					dStack: {value: pc.dStack},
					lFStack: {value: pc.lFStack},
				});
				this.i = pc.i;
				this.i0 = pc.i0;
				this.selfMN = pc.selfMN;
				this.monitor = pc.monitor;
				// this.debugDomain = pc.debugDomain;
			}
			match (templ) {
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

				if (mSubstr) {
					this.i += len;
					push(this.mSlot, mSubstr);
					this.monitor = this.i+ " : "+this.text.substr(this.i, 20)
					return mSubstr;
				} else
					return "";
			}
			notMatch (templ) {
				const hpc = this.createHypo();
				if (! hpc.match(templ)) {
					this.match(this.text[this.i]);
					return true;
				} else
					return false;
			}
			createHypo () {
				const 
					{text, i, mSlot, dStack} = this,
					hpc = {text, i, mSlot: [], dStack};
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
					{text, i, dStack} = this,
					mSlot = [],
					mn = new ModelNode(name, mSlot),
					hpc = {text, i, i0: i, mSlot, selfMN: mn, dStack};
				mn.i0 = i;
				return new ParseContext(hpc);
			}
			acceptChildHypo (hpc) {
				this.i = this.i1 = hpc.i;
				push(this.mSlot, hpc.selfMN);
				hpc.selfMN.i1 = hpc.i - 1;
				if (hpc.msg)
					hpc.selfMN.msg = hpc.msg;
				hpc.selfMN = null;
				return true;
			}
		}

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

		function insertProto(proto, ob) {
			return Object.setPrototypeOf(ob, Object.setPrototypeOf(proto, Object.getPrototypeOf(ob)));
		}

		function chekToAnaliser(fn) {
			if (! fn || Object.getPrototypeOf(fn) != Analyzer_proto) {
				console.error(fn);
				if (fn && fn.toString)
					console.error(fn.toString());
				debugger;
				throw new Error("Invalid callback.");
			} else
				return true;
		}

		return {
			ParseContext,
			seq,
			alter,
			q,
			not,
			domain,
			rule,
			token,
			deb,
		};
	}

	function makeUserAPI(ParseContext, mainRule) {
		function highlight(contentEl, text, firstLineNum=1) {
			contentEl.innerHTML = "";
			try {
				const
					model    = buildModel(text),
					contents = renderToHighlight(model, firstLineNum);
				for (let v of contents) 
					contentEl.appendChild(v);
			} catch (e) {
				console.error(`(!)-CATCHED`, e);
				let lines = text.split("\n"), innerHTML = "";
				lines.forEach((v,i,a) => {
					if (i)
						innerHTML += "\n";
					innerHTML += makeLine(i, v);
				});
				contentEl.innerHTML = innerHTML;
			}
			function makeLine(lNum, text) {
				return (
					`<span class="json-error-hl__line">`+
						`<span class="json-error-hl__line-number" data-line-number="${firstLineNum + lNum}"></span>`+
						`<span class="json-error-hl__line-indent"></span>`+
						`<span class="json-error-hl__line-text">${text}</span>`+
					`</span>`);
			}
		}

		highlight.textContent = function highlightTextContent(el) {
			return this(el, el.textContent, (el.dataset.lineNum*1 + 1) || 1);
		}

		highlight.scrollToFirstError =function scrollToFirstError(el) {
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

		highlight.tCFirstError = function tCFirstError(el) {
			const res = this.textContent(el);
			this.scrollToFirstError(el);
			return res;
		}

		return {highlight, setMainRule};


		function buildModel(text) {
			const mSlot = [];
			mainRule(new ParseContext({
				text, 
				i: 0, 
				mSlot, 
				dStack: []
			}));
			return mSlot;
		}

		function renderToHighlight (model, firstLineNum=1) {
			const content = [], dStack = [], msgStack = [], dNodeStack = [];
			let lNum = firstLineNum, indentZoneFlag = true, lastLine;
			content.push(lastLine = makeLine(lNum));
			recur(model);
			return content;
			function recur(sb) {
				if (sb instanceof Array) {
					sb.forEach(recur);
				} else if (typeof sb == "object") {
					sb.parent = dNodeStack[dNodeStack.length - 1];

					dStack.push(sb.name);
					dNodeStack.push(sb);
					msgStack.push(sb.msg || "");

					recur(sb.ch);

					msgStack.pop();
					dNodeStack.pop();
					dStack.pop();
				} else {
					if (sb == "\n") {
						content.push(evaluate(`<span>\n</span>`));
						content.push(lastLine = makeLine());
						indentZoneFlag = true;
					} else {
						if (indentZoneFlag && sb.match(/^\s+$/)) {
							lastLine.children[1].innerHTML += sb;
						} else {
							indentZoneFlag = false;
							const 
								lastDomainNode = dNodeStack[dNodeStack.length - 1],
								el = evaluate(`<span>${sb}</span>`);
							lastLine.children[2].appendChild(el);
							el.className = dStack.filter(v => v).join("- ") || "";
							if (msgStack.join("")) {
								let 
									msgStr = "";
								dStack.forEach((v,i,a) => {
									let pf = (i + 1 == a.length)? "" : "-";
									msgStr += `${v+pf} : ${msgStack[i]} \n`;
								});
								el.title = msgStr;
								el.style.cursor = "pointer";
							}
							if (lastDomainNode) {
								el.dataset.region = `${lastDomainNode.i0}:${lastDomainNode.i1}`;
								el.domain = lastDomainNode;
							}
						}
					}
				}
			}
			function makeLine() {
				return evaluate(
					`<span class="json-error-hl__line">`+
						`<span class="json-error-hl__line-number" data-line-number="${lNum ++}"></span>`+
						`<span class="json-error-hl__line-indent"></span>`+
						`<span class="json-error-hl__line-text"  ></span>`+
					`</span>`);
			}
			function evaluate (code) {
				const shell = document.createElement("div");
				shell.innerHTML = code;
				return shell.children[0];
			}
		}

		function setMainRule(rule) {
			mainRule = rule;
		}
	}
})();