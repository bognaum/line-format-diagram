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
		console.log(`getDomPath(rng.startContainer)`, getDomPath(rng.startContainer));
		console.log(`getDomPath(rng.endContainer)`, getDomPath(rng.endContainer));
		console.log(`pathFrom(rootPart).to(rng.startContainer)`, pathFrom(rootPart).to(rng.startContainer));
		console.log(`pathFrom(rootPart).to(rng.endContainer)`, pathFrom(rootPart).to(rng.endContainer));
		const
			serialN = rootPart && parseInt(rootPart.dataset.serialN),
			rootNode = self.editStage.tOb.getBySerial(serialN);
		self.editStage.rootPart = rootPart;
		self.editStage.rootNode = rootNode;
		self.editStage.range = rng;
		console.log(
			"\n5. rootNode", rootNode,
		);

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
		rootPart = $el(rootEl).part,
		rootNode = self.editStage.tOb.getBySerial(rootPart.dataset.serialN);

	let a, b;

	if (startEl == endEl) {
		a = range.startOffset;
		b = range.endOffset;
	} else {
		a = (function () {
			let el = startEl;
			do {
				if (el.parentElement == root)
					return el;
			} while (el = el.parentElement);
		})();
		b = (function () {
			let el = endEl;
			do {
				if (el.parentElement == root)
					return el;
			} while (el = el.parentElement);
		})();

		a = $el(a).chIndex;
		b = $el(b).chIndex;
	}
	self.editStage.selArgs = {
		rootNode,
		a,
		b,
	}
	console.log(`self.editStage`, self.editStage);
}

function pathFrom(elA) {
	return {
		to: function(elB) {
			const path = [];
			if (recur(elB))
				return path;
			else 
				return null;
			function recur(el) {
				path.unshift(el);
				if (el == elA)
					return true;
				else if (el.parentElement)
					return recur(el.parentElement);
				else
					return false;
			}
		}
	};
}

function $elem(self) {
	return function $el (elA) {
		return {
			$el,
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
			pathTo: function(elB) {
				const path = [];
				if (recur(elB))
					return path;
				else 
					return null;
				function recur(el) {
					path.unshift(el);
					if (el == elA)
						return true;
					else if (el.parentElement)
						return recur(el.parentElement);
					else
						return false;
				}
			},
			enableClass: function(...args) {elA.classList.add(...args)},
			disableClass: function(...args) {elA.classList.remove(...args)},
			setClass: function(className, status=true) {
				status ? elA.classList.add(className) : elA.classList.remove(className);
			},
			hasClass: function(...args) {return elA.classList.contains(...args)},
			get isPart() { return elA.classList?.contains(`${self.clPref}-part`); },
			get part() {
				const self = this;
				return recur(elA);
				function recur(el) {
					if (self.$el(el).isPart) 
						return el;
					if (el.parentElement)
						return recur(el.parentElement);
				}
			},
			get chIndex() {
				const 
					pEl = this.parentElement,
					len = pEl.length;
				for (let i = 0; i < len; i ++)
					if (pEl[i] == this)
						return i;
			},
		};
	}
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
		path.unshift(el);
		if (el.parentElement)
			recur(el.parentElement);
	}
}