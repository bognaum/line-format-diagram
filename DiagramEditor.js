import * as lib          from "./lib.js";
import buildDiagram      from "./buildDiagram.js";
import JsonEHl           from "./json-err-hl/json-err-hl.js";
import setSelectionEvent from "./selection-event.js";

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
	self.diagram     = lib.eHTML(`<div class=""><div>`);
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

	editLoop.commit(self);

	setSelectionEvent(self);

	// self.diagram.setAttribute("contenteditable", "true");
	// self.diagram.oninput = console.log;

}

editLoop.commit = commit;

function commit(self) {
	const {editStage, history} = self;
	this(self);

	history.i ++;
	history[history.i] = editStage.tOb.clone;
	history.splice(history.i + 1, Infinity);

	setBtnEnableDisable(self);
}

function editLoop(self) {
	buildDiagram(self, self.diagram, self.editStage.tOb);
	self.codeField.textContent = _stringify(self.editStage.tOb);
	self.diagram.querySelectorAll(`.${self.clPref}-td-block`).forEach((v,i,a) => {
		createOnEditField(self, v, "td");
	});
	self.diagram.querySelectorAll(`.${self.clPref}-bottom-descr`).forEach((v,i,a) => {
		createOnEditField(self, v, "bd");
	});
	self.diagram.querySelectorAll(`.${self.clPref}-line-text`).forEach((v,i,a) => {
		createOnEditField(self, v, "ch");
	});
}

function createOnEditField(self, el, fieldName) {
	el.setAttribute("contenteditable", "true");
	el.oninput = function(ev) {
		const 
			part = getPart(self, this),
			node = self.editStage.tOb.getBySerial(part.dataset.serialN);
		node[fieldName] = this.textContent;
		self.codeField.textContent = _stringify(self.editStage.tOb);
	}
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

function setBtnEnableDisable(self) {
	const {clPref :pr, history :hist, editPanel :pane} = self;

	pane.querySelector(`.${pr}-nav-undo`)[
		(hist.i <= 0) ? "setAttribute" : "removeAttribute"
	]("disabled", true);

	pane.querySelector(`.${pr}-nav-redo`)[
		(hist.i == hist.length - 1) ? "setAttribute" : "removeAttribute"
	]("disabled", true);
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
				<button class="${pr}-edit-join"      >join</button>
				&nbsp;
				<button class="${pr}-edit-wrap"      >wrap</button>
				<button class="${pr}-edit-strip"     >strip</button>
			</div>
			<div style="clear: both;"></div>
		</div>
	`);

	dom.querySelector(`.${pr}-edit-buttons`).onclick = function(ev) {
		const {rootNode, a, b} = self.editStage.selArgs;
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		if (tClass(`${pr}-edit-split`)) {
			rootNode.split(a, b);
		} else 
		if (ev.target.classList.contains(`${pr}-edit-wrap`)) {
			rootNode.wrap(a, b);
		} else 
		if (tClass(`${pr}-edit-strip`)) {
			rootNode.strip(a, b);
		} else 
		if (tClass(`${pr}-edit-join`)) {
			rootNode.join(a, b);
		}  
		editLoop.commit(self);
	};

	dom.querySelector(`.${pr}-history-buttons`).onclick = function (ev) {
		const {editStage, history} = self;
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		if        (tClass(`${pr}-nav-undo`)) {
			if (history[history.i - 1]) {
				editStage.tOb = history[-- history.i].clone;
				setBtnEnableDisable(self);
				editLoop(self);
			}
		} else if (tClass(`${pr}-nav-redo`)) {
			if (history[history.i + 1]) {
				editStage.tOb = history[++ history.i].clone;
				setBtnEnableDisable(self);
				editLoop(self);
			}
		}

	};

	dom.querySelector(`.${pr}-nav-buttons`).onclick = function (ev) {
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		if        (tClass(`${pr}-nav-left`)) {
			// ...
		} else if (tClass(`${pr}-nav-up`)) {
			// ...
		} else if (tClass(`${pr}-nav-right`)) {
			// ...
		} else if (tClass(`${pr}-nav-down`)) {
			// ...
		}

	};
	return dom;
}

function _getCodeEditBlockDom(self) {
	const pr = self.clPref;
	const dom = lib.eHTML(`
		<div class="${pr}-code-edit-block">
			<div class="${pr}-code-edit-panel">
				<div style="float: left;">
					<button class="${pr}-new-blank">New Blank</button>
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

	dom.onclick = function (ev) {
		const tClass = ev.target.classList.contains.bind(ev.target.classList);

		if        (tClass(`${pr}-new-blank`)) {
			const str = [
				`{`,
				`    "ch": [`,
				`        {`,
				`            "td": "main",`,
				`            "ch": ""`,
				`        }`,
				`    ]`,
				`}`,
			].join("\n");
			self.codeField.textContent = str;
			self.editStage.tOb = JSON.parse(str);
			editLoop.commit(self);
		} else if (tClass(`${pr}-apply`)) {
			const {object, error, text} = 
				lib.tryParseJSON(self.codeField.textContent);
			if (object) {
				self.editStage.tOb = object.clone;
				editLoop.commit(self);
			} else if (error) {
				const 
					hl = new JsonEHl("e-s-json-err-hl"),
					codeField = hl.getHighlighted(text);
				self.diagram.innerHTML = "";
				self.diagram.appendChild(codeField);
				hl.scrollToFirstError(codeField);
				console.error(`(!) \n`, self.diagram, "\n", jsonError);

			}
		} else if (tClass(`${pr}-discard`)) {
			self.codeField.textContent = _stringify(self.editStage.tOb);
		} else if (tClass(`${pr}-to-clipboard`)) {
			const str = self.codeField.textContent;

			const tA = document.createElement("textarea");
			tA.value = str;
			document.body.appendChild(tA);
			tA.select();
			document.execCommand("copy");
			document.body.removeChild(tA);
		}

	};

	return dom;
}


function _stringify(tOb) {
	return JSON.stringify(tOb, null, 4);
}