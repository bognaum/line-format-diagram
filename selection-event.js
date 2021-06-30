import * as lib     from "./lib.js";

export default function setSelectionEvent(self) {
	// document.onselectionchange = function (ev) {
	document.addEventListener("selectionchange", function (ev) {

		defineSelArgs(self);
	});
}

function defineSelArgs(self) {
	const $el = $elem(self);
	const 
		sel = window.getSelection(),
		range = sel.getRangeAt(0),
		{
			commonAncestorContainer :rootEl ,
			startContainer          :startEl,
			endContainer            :endEl  ,
		} = range;

	const 
		rootPart = getPart(self, rootEl),
		rootNode = rootPart ? 
			self.editStage.tOb.getBySerial(rootPart.dataset.serialN) : null;

	if (! rootPart)
		return;

	let a, b, aEl, bEl;

	if (startEl == endEl) {
		a = range.startOffset;
		b = range.endOffset;
	} else {
		aEl = (function () {
			let el = startEl;
			do {
				if (el.parentElement == rootPart)
					return el;
			} while (el = el.parentElement);
		})();
		bEl = (function () {
			let el = endEl;
			do {
				if (el.parentElement == rootPart)
					return el;
			} while (el = el.parentElement);
		})();

		a = parseInt(aEl.dataset.partChIndex);
		b = parseInt(bEl.dataset.partChIndex) + 1;
	}
	self.editStage.selArgs = {
		rootNode,
		rootPart,
		aEl,
		bEl,
		a,
		b,
	}

	self.diagram.querySelectorAll(`.${self.clPref}-part`).forEach((v) => {
		v.style.boxShadow = "";
	});
	rootPart.style.boxShadow = "inset 0 0 5px #777, 0 0 5px #777";
	let n = 0;
	console.log("");
	console.log(++ n, "range"   , range   );
	console.log(++ n, "rootPart", rootPart);
	console.log(++ n, "rootNode", rootNode);
	console.log(++ n, "aEl"     , aEl     );
	console.log(++ n, "a"       , a       );
	console.log(++ n, "bEl"     , bEl     );
	console.log(++ n, "b"       , b       );
}

function getPart(self, el) {
	return recur(el);
	function recur(el) {
		if (isPart(self, el)) 
			return el;
		if (el.parentElement)
			return recur(el.parentElement);
	}
}

function isPart(self, el) {
	return el.classList?.contains(`${self.clPref}-part`);
}