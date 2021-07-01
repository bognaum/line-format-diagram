import * as lib     from "./lib.js";

export default function setSelectionEvent(self) {
	// document.onselectionchange = function (ev) {
	document.addEventListener("selectionchange", function (ev) {

		defineSelArgs(self);
	});
}

function defineSelArgs(self) {
	const 
		sel = window.getSelection();
	if (! sel.rangeCount) {
		self.editStage.selArgs = {};
		return;
	}
	const
		rangeA = sel.getRangeAt(0),
		rangeB = sel.getRangeAt(sel.rangeCount - 1),
		{
			commonAncestorContainer :rootEl ,
			startContainer          :startEl,
		} = rangeA,
		{
			endContainer            :endEl  ,
		} = rangeB;

	const 
		rootPart = getPart(self, rootEl),
		rootNode = rootPart ? 
			self.editStage.tOb.getBySerial(rootPart.dataset.serialN) : null;

	if (! rootPart) {
		self.editStage.selArgs = {};
		return;
	}

	let a, b, aEl, bEl;

	if (startEl == endEl) {
		a = rangeA.startOffset;
		b = rangeB.endOffset;
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
		v.style.background = "";
	});

	self.diagram.querySelectorAll(`*`).forEach((v) => {
		v.style.boxShadow = "";
		v.style.background = "";
	});
	rootPart.style.boxShadow = "inset 0 0 5px #777, 0 0 5px #777";
	if (aEl) {
		let el = aEl;
		do {
			el.style.background = "rgba(100,200,100,.3";
		} while (el != bEl && (el = el.nextElementSibling));
	}
	/*if (aEl) 
		aEl.style.background = "rgba(100,200,100,.3";
	if (bEl) 
		bEl.style.background = "rgba(100,200,100,.3";*/

	let n = 0;
	console.groupCollapsed("defineSelArgs");
	console.log("");
	console.log(++ n, "rangeA"  , rangeA  );
	console.log(++ n, "rangeB"  , rangeB  );
	console.log(++ n, "rootPart", rootPart);
	console.log(++ n, "rootNode", rootNode);
	console.log(++ n, "aEl"     , aEl     );
	console.log(++ n, "a"       , a       );
	console.log(++ n, "bEl"     , bEl     );
	console.log(++ n, "b"       , b       );
	console.groupEnd();
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