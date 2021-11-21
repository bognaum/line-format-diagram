import * as lib          from "./../lib.js";
import JsonEHl           from "./../json-err-hl/json-err-hl.js";
import {
	editLoop, 
	stringifyTOb
}                        from "./DiagramEditor.js";

export default function _getAppDom(self) {
	const pr = self.clPref;
	const dFragment = lib.eHTMLDF(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-history-buttons" style="float: left;">
				<button class="${pr}-nav-undo" ><span class="count"></span> ⤶</button>
				<button class="${pr}-nav-redo" >⤷ <span class="count"></span></button>
				&nbsp;&nbsp;
			</div>
			<div class="${pr}-edit-panel__btn-block ${pr}-edit-buttons" style="float: right;">
				<button class="${pr}-edit-all-td"    >all td +/-</button>
				&nbsp;
				<button class="${pr}-edit-td"        >td +/-</button>
				<button class="${pr}-edit-bd"        >bd +/-</button>
				<button class="${pr}-edit-td-bd"     >td ↔ bd</button>
				&nbsp;
				<button class="${pr}-edit-split"     >split</button>
				<button class="${pr}-edit-join"      >join</button>
				&nbsp;
				<button class="${pr}-edit-wrap"      >wrap</button>
				<button class="${pr}-edit-unwrap"    >unwrap</button>
				&nbsp;
				<button class="${pr}-edit-subdivide" >subdivide</button>
				&nbsp;
				<button class="${pr}-edit-wrap-subdiv" hidden>wrap/subdiv</button>
			</div>
			<div style="clear: both;"></div>
			<br>
		</div>

		<div class="${pr}-diagram"></div>

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
					with indents:
					<select name="" id="" class="${pr}-indent-select" style="font-family: consolas, monospace">
						<option value=""        >min</option>
						<option value="\t"      >\\t</option>
						<option value=" "       >&nbsp;1&nbsp;</option>
						<option value="  "      >&nbsp;2&nbsp;</option>
						<option value="   "     >&nbsp;3&nbsp;</option>
						<option value="    "    >&nbsp;4&nbsp;</option>
						<option value="     "   >&nbsp;5&nbsp;</option>
						<option value="      "  >&nbsp;6&nbsp;</option>
						<option value="       " >&nbsp;7&nbsp;</option>
						<option value="        ">&nbsp;8&nbsp;</option>
					</select>
				</div>
				<div style="clear: both;"></div>
			</div>
			<div style="padding: 5px 100px;">
				<pre class="${pr}-code-field" contenteditable="true"></pre>
			</div>
		</div>
	`);

	const domApi = {
		navUndo             : {
			el: dFragment.querySelector(`.${pr}-nav-undo`            ),
			onclick: function(ev) {
				const {editStage, history} = self;
				if (history[history.i - 1]) {
					editStage.tOb = history[-- history.i].tOb.clone;
					editStage.selArgs = {...history[history.i].selArgs};
					self.updateButtons();
					editLoop(self);
				}
			},
			updateBtn: function() {
				const hist = self.history;
				this.el.disabled = (hist.i <= 0);
				this.el.querySelector(`.count`).textContent = hist.i;
			},
		},
		navRedo             : {
			el: dFragment.querySelector(`.${pr}-nav-redo`            ),
			onclick: function(ev) {
				const {editStage, history} = self;
				if (history[history.i + 1]) {
					editStage.tOb = history[++ history.i].tOb.clone;
					editStage.selArgs = {...history[history.i].selArgs};
					self.updateButtons();
					editLoop(self);
				}
			},
			updateBtn: function() {
				const hist = self.history;
				this.el.disabled = (hist.i == hist.length - 1);
				this.el.querySelector(`.count`).textContent = 
					hist.length - 1 - hist.i;
			},
		},
		editAllTd              : {
			el: dFragment.querySelector(`.${pr}-edit-all-td`     ),
			onclick: function(ev) {
				for (const node of self.editStage.tOb.preRecIter()) {
					if (!node.td) {
						for (const node of self.editStage.tOb.preRecIter()) {
							node.td ||= "•";
						}
						break;
					} else if (node.td == "•") {
						for (const node of self.editStage.tOb.preRecIter()) {
							if (node.td == "•")
								delete node.td;
						}
						break;
					}
				}
				editLoop(self);
			},
			updateBtn: function() {
				for (const node of self.editStage.tOb.preRecIter()) 
					if (!node.td || node.td == "•")
						return this.el.disabled = false;
				this.el.disabled = true;
			},
		},
		editTd              : {
			el: dFragment.querySelector(`.${pr}-edit-td`             ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				rootSelNode.td ? delete rootSelNode.td : rootSelNode.td = "X";
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode;
			},
		},
		editBd              : {
			el: dFragment.querySelector(`.${pr}-edit-bd`             ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				rootSelNode.bd ? delete rootSelNode.bd : rootSelNode.bd = "X";
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !(rootSelNode && typeof rootSelNode.ch == "string");
			},
		},
		editTdBd              : {
			el: dFragment.querySelector(`.${pr}-edit-td-bd`             ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				const [td, bd] = [rootSelNode.td, rootSelNode.bd];
				if (td)
					rootSelNode.bd = td;
				else
					delete rootSelNode.bd;
				if (bd)
					rootSelNode.td = bd;
				else
					delete rootSelNode.td;
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !(rootSelNode && (typeof rootSelNode.ch == "string" || rootSelNode.bd));
			},
		},
		editSplit           : {
			el: dFragment.querySelector(`.${pr}-edit-split`          ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				const newSel = rootSelNode.split(a, b)();
				self.editStage.selArgs = newSel;
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode?.split(a, b);
			},
		},
		editJoin            : {
			el: dFragment.querySelector(`.${pr}-edit-join`           ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				const newSel = rootSelNode.join(a, b)();
				self.editStage.selArgs = newSel;
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode?.join(a, b);
			},
		},
		editSubdivide            : {
			el: dFragment.querySelector(`.${pr}-edit-subdivide`      ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				const newSel = rootSelNode.subdivide(a, b)();
				self.editStage.selArgs = newSel;
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode?.subdivide(a, b);
			},
		},
		editWrap            : {
			el: dFragment.querySelector(`.${pr}-edit-wrap`           ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				const newSel = rootSelNode.wrap(a, b)();
				self.editStage.selArgs = newSel;
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode?.wrap(a, b);
			},
		},
		editWrapSubdiv            : {
			el: dFragment.querySelector(`.${pr}-edit-wrap-subdiv`           ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				rootSelNode.wrapSubdiv(a, b)();
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode?.wrapSubdiv(a, b);
			},
		},
		editUnwrap          : {
			el: dFragment.querySelector(`.${pr}-edit-unwrap`         ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				const newSel = rootSelNode.unwrap(a, b)();
				self.editStage.selArgs = newSel;
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootSelNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootSelNode?.unwrap(a, b);
			},
		},
		diagram             : {
			el: dFragment.querySelector(`.${pr}-diagram`             ),
		},
		discard             : {
			// Не работает из-за того, что при потере фокуса на <pre> происходит коммит. 
			// А тогда уже делать discard нет смысла.
			el: dFragment.querySelector(`.${pr}-discard`             ),
			onclick: function(ev) {
				const codeField = self.domApi.codeField;
				// codeField.el.focus();
				codeField.el.textContent = codeField.el.oldValue = stringifyTOb(self.editStage.tOb);
				editLoop(self);
			},
			updateBtn: function() {},
		},
		toClipboard         : {
			el: dFragment.querySelector(`.${pr}-to-clipboard`        ),
			onclick: function(ev) {
				const 
					indent = self.domApi.indentSelect.el.value,
					str = JSON.stringify(self.editStage.tOb, null, indent);

				lib.copyToClipboard(str);
			},
			updateBtn: function() {},
		},
		indentSelect: {
			el: dFragment.querySelector(`.${pr}-indent-select`       ),
		},
		codeField           : {
			el: dFragment.querySelector(`.${pr}-code-field`          ),
			onfocus: function(ev) {
				this.oldValue = this.textContent;
			},
			onblur : function(ev) {
				if (this.oldValue != this.textContent) {
					const {object, error, text} = 
						lib.tryParseJSON(self.domApi.codeField.el.textContent);
					// editLoop.commit(self);
					if (object) {
						self.editStage.tOb = object.clone;
						editLoop.commit(self);
					} else if (error) {
						const 
							hl = new JsonEHl("e-s-json-err-hl"),
							codeField = hl.getHighlighted(text);
						self.domApi.diagram.el.innerHTML = "";
						self.domApi.diagram.el.appendChild(codeField);
						hl.scrollToFirstError(codeField);
						console.error(`(!) \n`, self.domApi.diagram.el, "\n", error);
					}
				}
			},
		},
	};

	for (const i in domApi) {
		const 
			api = domApi[i],
			el  = api.el;
		el.api = api;
		el.onclick = api.onclick;
		el.oninput = api.oninput;
		el.onfocus = api.onfocus;
		el.onblur  = api.onblur ;
	}

	return [dFragment, domApi, updateButtons];

	function updateButtons() {
		for (const i in domApi) 
			if (domApi[i].updateBtn)
				domApi[i].updateBtn();
	}
}
