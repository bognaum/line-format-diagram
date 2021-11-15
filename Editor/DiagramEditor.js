import * as lib          from "./../lib.js";
import buildDiagram      from "./../buildDiagram.js";
import JsonEHl           from "./../json-err-hl/json-err-hl.js";
import getSelArgs        from "./getSelArgs.js";
import components        from "./components.js";

export {editLoop};

export default class DiagramEditor {
	constructor (clPref, elem, tOb) { constructor(this, clPref, elem, tOb);}
}

function constructor(self, clPref, elem, tOb) {
	elem.innerHTML = "";

	self.clPref      = clPref;
	self.tOb         = tOb;
	[self.dom, self.domApi, self.updateButtons] = components(self); 
	self.editStage   = {
			tOb:     tOb.clone,
			selArgs: {
				r       : null,
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
			sel       = window.getSelection(),
			selectedR = sel.rangeCount ? sel.getRangeAt(0) : null,
			editorR = new Range();
		editorR.selectNodeContents(elem);

		if (selectedR) {
			const insideDiagram = 
				editorR.compareBoundaryPoints(Range.START_TO_START, selectedR) == -1
				&&
				editorR.compareBoundaryPoints(Range.END_TO_END,     selectedR) == 1;

			if (insideDiagram) {
				const 
					clPref = self.clPref,
					tOb    = self.editStage.tOb;
				self.editStage.selArgs = getSelArgs(clPref, tOb);
				selectLoop(self);
			}
		}
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
		createOnEditTdBd(self, v, "td");
	});
	self.domApi.diagram.el.querySelectorAll(`.${self.clPref}-bottom-descr`).forEach((v,i,a) => {
		createOnEditTdBd(self, v, "bd");
	});
	self.domApi.diagram.el.querySelectorAll(`.${self.clPref}-line-text`).forEach((v,i,a) => {
		createOnEditField(self, v, "ch");
	});
	selectLoop(self);
	self.updateButtons();
}

function selectLoop(self) {

	self.domApi.diagram.el.querySelectorAll(`.${self.clPref}-part`).forEach((v) => {
		v.style.boxShadow = "";
		v.style.background = "";
	});

	self.domApi.diagram.el.querySelectorAll(`*`).forEach((v) => {
		v.style.boxShadow = "";
		v.style.background = "";
	});

	const {r, a, b} = self.editStage.selArgs;
	const rootSelNode = self.editStage.tOb.getBySerial(r);
	if (rootSelNode) {
		const 
			rootSN = rootSelNode.getSerial(),
			rootPart = self.domApi.diagram.el.querySelector(`[data-serial-n="${rootSN}"]`);

		if (rootPart) {
			rootPart.style.boxShadow = "inset 0 0 5px #777, 0 0 5px #777";
		}

		if (typeof rootSelNode.ch != "string") {
			const selectedNodes = rootSelNode.ch.slice(a, b);
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
	el.onclick = function(ev) {
		el.setAttribute("contenteditable", "true");
		el.onfocus = function(ev) {
			this.oldValue = this.textContent;
		}
		el.onblur = function(ev) {
			if (this.oldValue != this.textContent) {
				editLoop.commit(self);
			} else {
				editLoop(self);
			}
		}
		el.oninput = function(ev) {
			const 
				part = lib.getPart(self, this),
				node = self.editStage.tOb.getBySerial(part.dataset.serialN);
			node[fieldName] = this.textContent;
			self.domApi.codeField.el.textContent = _stringify(self.editStage.tOb);
		}
	}
}

function createOnEditTdBd(self, el, fieldName) {
	el.style.cursor = "pointer";
	el.onclick = function(ev) {
		if (!this.isEdited) {
			const 
				part = lib.getPart(self, this),
				node = self.editStage.tOb.getBySerial(part.dataset.serialN),
				text = node[fieldName];
			el.innerHTML = `<textarea></textarea>`;
			const ta = el.children[0];
			ta.value = text;
			setTextareaDimensions(ta);
			el.oldValue = node[fieldName];
			ta.focus();
			ta.select();
			ta.onfocus = function(ev) {
				el.oldValue = node[fieldName];
			}
			ta.onblur = function(ev) {
				if (el.oldValue != ta.value) {
					editLoop.commit(self);
				} else {
					editLoop(self);
				}
			}
			ta.oninput = function(ev) {
				node[fieldName] = this.value;
				self.domApi.codeField.el.textContent = _stringify(self.editStage.tOb);

				setTextareaDimensions(this);
			}
		}
		this.isEdited = true;
	}

	function setTextareaDimensions(ta) {
		const 
			text = ta.value,
			lines = text.split("\n"),
			maxLineLength = Math.max(...lines.map((v) => v.length));
		ta.rows = lines.length || 1;
		ta.cols = maxLineLength || 1;
	}
}

function _stringify(tOb) {
	return JSON.stringify(tOb, null, 4);
}