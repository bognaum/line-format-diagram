import * as lib     from "./lib.js";
import buildDiagram from "./buildDiagram.js";

export default class DiagramEditor {
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
	self.diagram     = lib.eHTML(`<div class="executed"><div>`);
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

	console.log(`self.codeEditBlock`, self.codeEditBlock);

	editLoop.commit(self);

	setEditEvents(self);

}

editLoop.commit = commit;

function commit(self) {
	const {editStage, history} = self;
	this(self);

	history.i ++;
	history[history.i] = editStage.tOb.clone;
	history.splice(history.i + 1, Infinity);

	setBtnEnableDisable(self);
	console.log(`self.history`, self.history);
}

function editLoop(self) {
	buildDiagram(self, self.diagram, self.editStage.tOb);
	self.codeField.textContent = JSON.stringify(self.editStage.tOb, null, 4);

	console.log(`self.history`, self.history);
}

function setBtnEnableDisable(self) {
	const {clPref :pr, history :hist, editPanel :pane} = self;

	pane.querySelector(`.${pr}-nav-undo`)[
		(hist.i <= 0) ? "setAttribute" : "removeAttribute"
	]("disabled", true);

	pane.querySelector(`.${pr}-nav-redo`)[
		(hist.i == hist.length - 1) ? "setAttribute" : "removeAttribute"
	]("disabled", true);
}

function setEditEvents(self) {
	document.onselectionchange = function (ev) {
		// selWasChanged = true;

		const 
			sel = window.getSelection(),
			sR = sel.rangeCount ? sel.getRangeAt(0) : null,
			aC = sR?.commonAncestorContainer,
			part = (function () {
				let el = aC;
				do {
					if (el.classList?.contains(`${self.clPref}-part`))
						return el;
				} while (el = el.parentElement);
			})(),
			serialN = parseInt(part.dataset.serialN),
			node = (function () {
				let finded, sN = -1;
				lib.forEachRecur(node => {
					if (++ sN == serialN)
						finded = node;
				}, self.editStage.tOb);
				return finded;
			})();
		self.editStage.part = part;
		self.editStage.node = node;
		self.editStage.range = sR;
		console.log(
			"\n1. aC", aC, 
			`\n2. part`, part, 
			`\n3. part`, part, 
			"\n4. region", sR, 
			"\n5. node", node,
		);
	};
}

function _getEditPanelDom(self) {
	const pr = self.clPref;
	
	const dom = lib.eHTML(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-history-buttons" style="float: left;">
				<button class="${pr}-nav-undo" >⤶</button>
				<button class="${pr}-nav-redo" >⤷</button>
				&nbsp;&nbsp;
			</div>
			<div class="${pr}-edit-panel__btn-block ${pr}-nav-buttons" style="float: left;">
				<button class="${pr}-nav-left" >⮜</button>
				<button class="${pr}-nav-up"   >⮝</button>
				<button class="${pr}-nav-right">⮞</button>
				<button class="${pr}-nav-down" >⮟</button>
			</div>
			<div class="${pr}-edit-panel__btn-block ${pr}-edit-buttons" style="float: right;">
				<button class="${pr}-edit-split"     >split</button>
				<button class="${pr}-edit-sub-div"   >subDiv</button>
				<button class="${pr}-edit-strip"     >strip</button>
				<button class="${pr}-edit-join"      >join</button>
			</div>
			<div style="clear: both;"></div>
		</div>
	`);

	dom.querySelector(`.${pr}-edit-buttons`).onclick = function(ev) {
		const {node, range} = self.editStage;

		if (ev.target.classList.contains(`${pr}-edit-split`)) {
			node.split(range.startOffset, range.endOffset);
		} else 
		if (ev.target.classList.contains(`${pr}-edit-sub-div`)) {
			node.subDiv(range.startOffset, range.endOffset);
		} else 
		if (ev.target.classList.contains(`${pr}-edit-strip`)) {
			node.strip(range.startOffset, range.endOffset);
		} else 
		if (ev.target.classList.contains(`${pr}-edit-join`)) {
			node.join(range.startOffset, range.endOffset);
		}  
		editLoop.commit(self);
	};

	dom.querySelector(`.${pr}-history-buttons`).onclick = function (ev) {
		const {editStage, history} = self;

		if        (ev.target.classList.contains(`${pr}-nav-undo`)) {
			console.log("OK");
			if (history[history.i - 1]) {
				editStage.tOb = history[-- history.i].clone;
				setBtnEnableDisable(self);
				editLoop(self);
			}
		} else if (ev.target.classList.contains(`${pr}-nav-redo`)) {
			console.log("OK");
			if (history[history.i + 1]) {
				editStage.tOb = history[++ history.i].clone;
				setBtnEnableDisable(self);
				editLoop(self);
			}
		}

	};

	dom.querySelector(`.${pr}-nav-buttons`).onclick = function (ev) {

		if        (ev.target.classList.contains(`${pr}-nav-left`)) {
			// ...
		} else if (ev.target.classList.contains(`${pr}-nav-up`)) {
			// ...
		} else if (ev.target.classList.contains(`${pr}-nav-right`)) {
			// ...
		} else if (ev.target.classList.contains(`${pr}-nav-down`)) {
			// ...
		}

	};
	return dom;
}

function _getCodeEditBlockDom(self) {
	const pr = self.clPref;
	return lib.eHTML(`
		<div class="${pr}-code-edit-block">
			<div class="${pr}-code-edit-panel">
				<div style="float: left;">
					<button class="${pr}-blank">Blank</button>
					<button class="${pr}-apply">Apply</button>
					<button class="${pr}-discard">Discard</button>
				</div>
				<div style="float: right;">
					<button class="${pr}-to-clipboard">To Clipboard</button>
				</div>
				<div style="clear: both;"></div>
			</div>
			<pre class="${pr}-code-field" contenteditable="true"></pre>
		</div>
	`);
}
