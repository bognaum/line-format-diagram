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
			tOb: tOb.clone,
		},
	self.history   = [self.editStage];

	elem.append(self.editPanel, self.diagram, self.codeField);
	editLoop(self);

	setEvents(self);

}


function editLoop(self) {
	buildDiagram(self, self.diagram, self.editStage.tOb.clone);
	self.codeField.textContent = JSON.stringify(self.editStage.tOb, null, 4);
}

function setEvents(self) {
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

		editLoop(self);
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
		console.log("\naC", aC, `\n1. part`, part, "\n2. region", sR, "\n3. node", node);
	};
}


function _getEditPanelDom(self) {
	const pr = self.clPref;
	return lib.eHTML(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-navi-buttons" style="float: left;">
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