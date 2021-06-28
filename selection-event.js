import * as lib     from "./lib.js";

export default function setSelectionEvent(self) {
	// document.onselectionchange = function (ev) {
	document.addEventListener("selectionchange", function (ev) {

		const 
			sel = window.getSelection(),
			rng = sel.rangeCount ? sel.getRangeAt(0) : null,
			cAC = rng?.commonAncestorContainer,
			rootPart = (function () {
				let el = cAC;
				do {
					if (el.classList?.contains(`${self.clPref}-part`))
						return el;
				} while (el = el.parentElement);
			})();
		console.log(
			"\n1. sel", sel, 
			"\n2. region", rng, 
			`\n3. cAC`, cAC, 
			`\n4. rootPart`, rootPart, 
		);
		if (! rootPart)
			return;
		const
			serialN = rootPart && parseInt(rootPart.dataset.serialN),
			node = (function () {
				let finded, sN = -1;
				lib.forEachRecur(node => {
					if (++ sN == serialN)
						finded = node;
				}, self.editStage.tOb);
				return finded;
			})();
		self.editStage.rootPart = rootPart;
		self.editStage.node = node;
		self.editStage.range = rng;
		console.log(
			"\n5. node", node,
		);
	});
}
/*
function domEl(elA) {
	return {
		isAncestorOf: function(elB) {
			return recur(elB);
			function recur(el) {
				if (elA == el) 
					return true;
				if (el.parentElement)
					return recur(el.parentElement);
			}
		},
		isDecendantOf: function(elB) {
			return recur(elA);
			function recur(el) {
				if (elB == el) 
					return true;
				if (el.parentElement)
					return recur(el.parentElement);
			}
		},
		iheritsTo: function(elB) {
			return recur(elA);
			function recur(el) {
				if (elB == el) 
					return true;
				if (el.parentElement)
					return recur(el.parentElement);
			}
		},
		enableClass: function(...args) {elA.classList.add(...args)},
		disableClass: function(...args) {elA.classList.remove(...args)},
		setClass: function(className, status=true) {
			status ? elA.classList.add(className) : elA.classList.remove(className);
		},
		hasClass: function(...args) {return elA.classList.contains(...args)},
	};
}

function getThisPart(el) {
	return recur(el);
	function recur(el) {
		if (isPart(el)) 
			return el;
		if (el.parentElement)
			return recur(el.parentElement);
	}
}

function isPart(el) {
	return el.classList.contains(`${self.clPref}-part`);
}

function getDomPath(el) {
	const path = [];
	recur(el);
	return path;
	function recur(el) {
		path.unchift(el);
		if (el.parentElement)
			recur(el.parentElement);
	}
}*/