import * as lib     from "./lib.js";

export default function setSelectionEvent(self) {
	// document.onselectionchange = function (ev) {
	document.addEventListener("selectionchange", function (ev) {

		const 
			sel = window.getSelection(),
			rng = sel.rangeCount ? sel.getRangeAt(0) : null,
			aC = rng?.commonAncestorContainer,
			part = (function () {
				let el = aC;
				do {
					if (el.classList?.contains(`${self.clPref}-part`))
						return el;
				} while (el = el.parentElement);
			})(),
			serialN = part && parseInt(part.dataset.serialN),
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
		self.editStage.range = rng;
		console.log(
			"\n1. sel", sel, 
			"\n2. region", rng, 
			`\n3. aC`, aC, 
			`\n4. part`, part, 
			"\n5. node", node,
		);
	});
}