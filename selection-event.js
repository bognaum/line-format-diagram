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
		rootPart = $el(rootEl).part,
		rootNode = self.editStage.tOb.getBySerial(rootPart.dataset.serialN);

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

		a = $el(aEl).chIndex;
		b = $el(bEl).chIndex;
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
	console.log(`self.editStage`, self.editStage);
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
					pEl = elA.parentElement,
					len = pEl.children.length;
				for (let i = 0; i < len; i ++)
					if (pEl.children[i] == elA)
						return i;
			},
		};
	}
}