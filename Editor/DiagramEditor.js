import * as lib          from "./../lib.js";
import buildDiagram      from "./../buildDiagram.js";
import JsonEHl           from "./../json-err-hl/json-err-hl.js";
import getSelArgs        from "./getSelArgs.js";

export default class DiagramEditor {
	constructor (clPref, elem, tOb) { constructor(this, clPref, elem, tOb);}
}

function constructor(self, clPref, elem, tOb) {
	elem.innerHTML = "";

	self.clPref      = clPref;
	self.tOb         = tOb;
	[self.dom, self.domApi, self.updateButtons] = _getAppDom(self); 
	self.editStage   = {
			tOb:     tOb.clone,
			selArgs: {
				rootNode: null,
				rootPart: null,
				aEl     : null,
				bEl     : null,
				a       : null,
				b       : null,
			}
		};
	self.history   = [];
	self.history.i = -1;


	elem.append(self.dom);

	editLoop.commit(self);

	document.addEventListener("selectionchange", function(ev) {
		const 
			clPref = self.clPref,
			tOb    = self.editStage.tOb;
		self.editStage.selArgs = getSelArgs(clPref, tOb);
		selectLoop(self);
	});

}

editLoop.commit = commit;

function commit(self) {
	const {editStage, history} = self;
	this(self);

	history.i ++;
	history[history.i] = editStage.tOb.clone;
	history.splice(history.i + 1, Infinity);
	self.updateButtons();
}

function editLoop(self) {
	buildDiagram(self, self.domApi.diagram.el, self.editStage.tOb);
	self.domApi.codeField.el.textContent = _stringify(self.editStage.tOb);
	self.domApi.diagram.el.querySelectorAll(`.${self.clPref}-td-block`).forEach((v,i,a) => {
		createOnEditField(self, v, "td");
	});
	self.domApi.diagram.el.querySelectorAll(`.${self.clPref}-bottom-descr`).forEach((v,i,a) => {
		createOnEditField(self, v, "bd");
	});
	/*self.domApi.diagram.querySelectorAll(`.${self.clPref}-line-text`).forEach((v,i,a) => {
		createOnEditField(self, v, "ch");
	});*/
	selectLoop(self);
	self.updateButtons();
}

function selectLoop(self) {
	const {r, a, b} = self.editStage.selArgs;

	const rootNode = self.editStage.tOb.getBySerial(r);
	if (rootNode) {
		const 
			rootSN = rootNode.getSerial(),
			rootPart = self.domApi.diagram.el.querySelector(`[data-serial-n="${rootSN}"]`);

		if (rootNode && typeof rootNode.ch == "string") {
			self.domApi.editPartTextField.el.editedNode = rootNode;
			self.domApi.editPartTextField.el.value      = rootNode.ch;
		} else {
			self.domApi.editPartTextField.el.value = "";
			self.domApi.editPartTextField.el.editedNode = null;
		}

		self.domApi.diagram.el.querySelectorAll(`.${self.clPref}-part`).forEach((v) => {
			v.style.boxShadow = "";
			v.style.background = "";
		});

		self.domApi.diagram.el.querySelectorAll(`*`).forEach((v) => {
			v.style.boxShadow = "";
			v.style.background = "";
		});

		if (rootPart) {
			rootPart.style.boxShadow = "inset 0 0 5px #777, 0 0 5px #777";
		}

		if (typeof rootNode.ch != "string") {
			const selectedNodes = rootNode.ch.slice(a, b);
			for (const node of selectedNodes) {
				const part = self.domApi.diagram.el.querySelector(
					`[data-serial-n="${node.getSerial()}"]`);
				part.style.background = `
					repeating-linear-gradient(
						135deg, 
						rgba(126,126,126,.2) 0, 
						rgba(126,126,126,.2) 5px, 
						transparent          5px, 
						transparent          10px
					)
				`;
			}
		}
	}

	self.updateButtons();
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
			part = lib.getPart(self, this),
			node = self.editStage.tOb.getBySerial(part.dataset.serialN);
		node[fieldName] = this.textContent;
		self.domApi.codeField.el.textContent = _stringify(self.editStage.tOb);
	}
}

function _getAppDom(self) {
	const pr = self.clPref;
	const dFragment = lib.eHTMLDF(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-history-buttons" style="float: left;">
				<button class="${pr}-nav-undo" >&nbsp;⤶ <span class="count"></span></button>
				<button class="${pr}-nav-redo" >&nbsp;<span class="count"></span> ⤷</button>
				&nbsp;&nbsp;
			</div>
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
					editStage.tOb = history[-- history.i].clone;
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
					editStage.tOb = history[++ history.i].clone;
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
		editTd              : {
			el: dFragment.querySelector(`.${pr}-edit-td`             ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				rootNode.td ? delete rootNode.td : rootNode.td = "X";
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !rootNode;
			},
		},
		editBd              : {
			el: dFragment.querySelector(`.${pr}-edit-bd`             ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				rootNode.bd ? delete rootNode.bd : rootNode.bd = "X";
				editLoop.commit(self);
			},
			updateBtn: function() {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				this.el.disabled = !(rootNode && typeof rootNode.ch == "string");
			},
		},
		editSplit           : {
			el: dFragment.querySelector(`.${pr}-edit-split`          ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				rootNode.split(a, b);
				editLoop.commit(self);
			},
			updateBtn: function() {},
		},
		editJoin            : {
			el: dFragment.querySelector(`.${pr}-edit-join`           ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				rootNode.join(a, b);
				editLoop.commit(self);
			},
			updateBtn: function() {},
		},
		editWrap            : {
			el: dFragment.querySelector(`.${pr}-edit-wrap`           ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				rootNode.wrap(a, b);
				editLoop.commit(self);
			},
			updateBtn: function() {},
		},
		editUnwrap          : {
			el: dFragment.querySelector(`.${pr}-edit-unwrap`         ),
			onclick: function(ev) {
				const 
					{r, a, b} = self.editStage.selArgs,
					rootNode = self.editStage.tOb.getBySerial(r);
				rootNode.unwrap(a, b);
				editLoop.commit(self);
			},
			updateBtn: function() {},
		},
		editPartTextField   : {
			el: dFragment.querySelector(`.${pr}-edit-part-text-field`),
			onfocus: function(ev) {
				this.tsartValue = this.value;
			},
			oninput: function(ev) {
				const node = this.editedNode;
				if (typeof this.editedNode?.ch != "string")
					throw new Error();
				this.editedNode.ch = this.value;
				self.domApi.codeField.el.textContent = _stringify(self.editStage.tOb);
			},
			onblur: function(ev) {
				if (this.tsartValue != this.value)
					editLoop.commit(self);
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
				codeField.el.textContent = codeField.el.oldValue = _stringify(self.editStage.tOb);
				editLoop(self);
			},
			updateBtn: function() {},
		},
		toClipboard         : {
			el: dFragment.querySelector(`.${pr}-to-clipboard`        ),
			onclick: function(ev) {
				const str = self.domApi.codeField.el.textContent;

				const tA = document.createElement("textarea");
				tA.value = str;
				document.body.appendChild(tA);
				tA.select();
				document.execCommand("copy");
				document.body.removeChild(tA);
			},
			updateBtn: function() {},
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

function _stringify(tOb) {
	return JSON.stringify(tOb, null, 4);
}