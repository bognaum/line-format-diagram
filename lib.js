import Node from "./NodeClass.js";

export {
	forEachRecur,
	tryParseJSON,
	fromJson,
	eHTML,
	eHTMLDF,
	getPart,
	isPart,
	copyToClipboard,
};

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

function setStatusMark(el, className) {
	const classes = ["executing", "executed", "exec-error"];
	if (classes.includes(className)) {
		el.classList.remove(...classes);
		el.classList.add(className);
	} else {
		throw new Error("Invalid className of diagram status: "+slassName);
	}
}


function forEachRecur(preCb, ob, postCb) {
	if (ob instanceof Array) 
		for (let v of ob)
				forEachRecur(preCb, v, postCb);
	else if (typeof ob == "object") {
		if (preCb)
			preCb(ob);
		forEachRecur(preCb, ob.ch, postCb);
		if (postCb)
			postCb(ob);
	}
}

function tryParseJSON (json) {
	try {
		const object = fromJson(json)
		return {object};
	} catch (err) {
		return {
			text: json,
			error: err,
		}
	}
}

function fromJson(json) {
	const ob =  JSON.parse(json, function(k, v) {
		if (typeof (k * 1) == "number" && typeof v == "object" && "ch" in v) {
			const node = new Node(v);
			if (node.ch instanceof Array)
				node.ch.forEach(v => v.parent = node);
			return node;
		} else
			return v;
	});

	if (typeof ob == "string")
		return new Node({ch: ob});
	else if (ob instanceof Array)
		return new Node({ch: ob});
	else 
		return ob;
}


function eHTML(code, shell=null) {
	const _shell = 
		! shell                  ? document.createElement("div") :
		typeof shell == "string" ? document.createElement(shell) :
		typeof shell == "object" ? shell :
			null;
	_shell.innerHTML = code;
	return _shell.children[0];
}

function eHTMLDF(code) {
	const _shell = document.createElement("template");
	return _shell.innerHTML = code, _shell.content;
}

function copyToClipboard(str) {
	const tA = document.createElement("textarea");
	tA.value = str;
	document.body.appendChild(tA);
	tA.select();
	document.execCommand("copy");
	document.body.removeChild(tA);
}