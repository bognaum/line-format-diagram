import * as lib from "./lib.js";

export default function editDiagram(self, elem, tOb) {
	elem.innerHTML = "";
	const 
		editPanel   = _getEditPanelDom(self),
		editButtons = editPanel.querySelector(`.${self.clPref}-edit-buttons`),
		navButtons  = editPanel.querySelector(`.${self.clPref}-nav-buttons`),
		diagram     = ,
		editStage   = {
			tOb
		},
		history   = [editStage];

	editButtons.onclick = function (ev) {
		const pr = self.clPref;
		const {node, range} = editState;

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

		diagram.innerHTML = getInnerHTML(self, tOb);
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
				forEachRecur(node => {
					console.log(`node`, node);
					if (node.serialN == serialN)
						finded = node;
				}, tOb);
				return finded;
			})();
		editState.part = part;
		editState.node = node;
		editState.range = sR;
		console.log(`\n1. part`, part, "\n2. region", sR, "\n3. node", node);
	};

}


function editLoop(self, editPanel, diagram, edirStage, history) {
	// body...
}


function _getEditPanelDom(self) {
	const pr = self.clPref;
	return eHTML(`
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