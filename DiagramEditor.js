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
	self.editButtons = self.editPanel.querySelector(`.${self.clPref}-edit-buttons`);
	self.navButtons  = self.editPanel.querySelector(`.${self.clPref}-nav-buttons`);
	self.diagram     = lib.eHTML(`<div class="executed"><div>`);
	self.codeField   = lib.eHTML(`<pre></pre>`);
	self.editStage   = {
			tOb:     tOb.clone,
		};
	self.history   = [];
	self.history.i = -1;


	elem.append(
		self.editPanel, 
		self.diagram, 
		self.codeField
	);

	editLoop.commit(self);

	setEditEvents(self);
	setNavEvents(self);

}

editLoop.commit = commit;

function commit(self) {
	const {editStage, history} = self;
	this(self);

	const clone = editStage.tOb.clone;
	if (clone.ch == editStage.tOb.ch)
		throw new Error();

	history.i ++;
	history[history.i] = editStage.tOb.clone;
	history.splice(history.i + 1, Infinity);

	if (self.editStage.tOb.ch == self.history[0].ch)
		throw new Error();

	editStage.written = true;
	console.log(`self.history`, self.history);
}

function editLoop(self) {
	buildDiagram(self, self.diagram, self.editStage.tOb);
	self.codeField.textContent = JSON.stringify(self.editStage.tOb, null, 4);

	console.log(`self.history`, self.history);
}

function setEditEvents(self) {
	self.editButtons.onclick = function (ev) {
		const pr = self.clPref;
		const {node, range} = self.editStage;

		let t = ev.target;
		do {
			if (t.classList.contains(`${pr}-edit-split`)) {
				node.split(range.startOffset, range.endOffset);
			} else 
			if (t.classList.contains(`${pr}-edit-sub-div`)) {
				node.subDiv(range.startOffset, range.endOffset);
			} else 
			if (t.classList.contains(`${pr}-edit-strip`)) {
				node.strip(range.startOffset, range.endOffset);
			} else 
			if (t.classList.contains(`${pr}-edit-join`)) {
				node.join(range.startOffset, range.endOffset);
			} else 
				continue;
			break;

		} while (t != this && (t = t.parentElement));

		editLoop.commit(self);
	};

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
				let finded;
				lib.forEachRecur(node => {
					console.log(`node`, node);
					if (node.serialN == serialN)
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

function setNavEvents(self) {
	const pr = self.clPref;
	const {editStage, history} = self;
	self.navButtons.onclick = function (ev) {

		// not bubbled
		if        (ev.target.classList.contains(`${pr}-nav-undo`)) {
			if (history[history.i - 1]) {
				console.log("undo");
				editStage.tOb = history[-- history.i].clone;
				editLoop(self);
			}
		} else if (ev.target.classList.contains(`${pr}-nav-redo`)) {
			if (history[history.i + 1]) {
				console.log("redo");
				editStage.tOb = history[++ history.i].clone;
				editLoop(self);
			}

		} else if (ev.target.classList.contains(`${pr}-nav-left`)) {
			// ...
		} else if (ev.target.classList.contains(`${pr}-nav-up`)) {
			// ...
		} else if (ev.target.classList.contains(`${pr}-nav-right`)) {
			// ...
		} else if (ev.target.classList.contains(`${pr}-nav-down`)) {
			// ...
		}

		// parallel not bubbled
		if (ev.target.classList.contains('fff')) {}
	};
}


function _getEditPanelDom(self) {
	const pr = self.clPref;
	return lib.eHTML(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-nav-buttons" style="float: left;">
				<button class="${pr}-nav-undo" >⤶</button>
				<button class="${pr}-nav-redo" >⤷</button>
				&nbsp;&nbsp;
				<button class="${pr}-nav-left" >⮜</button>
				<button class="${pr}-nav-up"   >⮝</button>
				<button class="${pr}-nav-right">⮞</button>
				<button class="${pr}-nav-down" >⮟</button>
			</div>
			<div class="-edit-panel__btn-block ${pr}-edit-buttons" style="float: right;">
				<button class="${pr}-edit-split"     >split</button>
				<button class="${pr}-edit-sub-div"   >subDiv</button>
				<button class="${pr}-edit-strip"     >strip</button>
				<button class="${pr}-edit-join"      >join</button>
			</div>
			<div style="clear: both;"></div>
		</div>
	`);
}

function _getCodeFieldDom(self) {
	return lib.eHTML(`<pre></pre>`);
}