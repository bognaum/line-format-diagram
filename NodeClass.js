export default class Node {
	constructor (ob) {
		Object.assign(this, ob);
	}
	
	split        (a, b) { return split       (this, a, b);}
	subDiv       (a, b) { return subDiv      (this, a, b);}
	strip        (    ) { return strip       (this      );}
	join         (a, b) { return join        (this, a, b);}

	isStr        (    ) { return isStr       (this      );}
	isArr        (    ) { return isArr       (this      );}

	toJSON       (    ) { return toJSON      (this      );}
	get chIndex () { return getChIndex(this); }
	get clone   () { return getClone  (this); }
}

/*function wrap (self) {
	const wr = new Node({
		td: "X",
		ch: self
	});
	self.parent.ch.splice(self.chIndex, 1, wr);
}*/
function strip (self) {
	if (isArr(...self.ch))
		self.parent.ch.splice(self.chIndex, 1, self.ch);
}

function join (self, a, b) {
	if (isArr(self)) {
		const joined = self.ch.slice(a, b);
		if (isArr(...joined)) {
			const 
				startPoint = joined[0].chIndex,
				pasted = [];
			for (let v of joined)
				pasted.push(...v);
			for (let v of pasted)
				v.parent = self;
			self.ch.splice(startPoint, joined.length, ...pasted);
		} else if (isStr(...joined)) {
			const 
				startPoint = joined[0].chIndex,
				pastedStr = joined.reguce((a,v) => a += v.ch, ""),
				pastedNode = new Node({
					ch: pastedStr,
					parent: self,
				});
			self.ch.splice(startPoint, joined.length, pastedNode);
		}
	}
	const 
		n = self.chIndex + 1,
		right = self.parent.ch[n];
	if (right)
		if (isArr(self, right) || isStr(self, right)) {
			self.ch = self.ch.concat(right.ch);
			self.parent.ch.splice(n, 1);
		}

}

/*
function joinRight (self) {
	const 
		n = self.chIndex + 1,
		right = self.parent.ch[n];
	if (right)
		if (isArr(self, right) || isStr(self, right)) {
			self.ch = self.ch.concat(right.ch);
			self.parent.ch.splice(n, 1);
		}
}
function joinLeft (self) {
	const 
		n = self.chIndex - 1,
		left = self.parent.ch[n];
	if (left)
		if (isArr(self, left) || isStr(self, left)) {
			self.ch = left.ch.concat(self.ch);
			self.parent.ch.splice(n, 1);
		}
}*/

function split (self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		newChildren = [];

	for (let p of parts) 
		if (p.length)
			newChildren.push(new self.constructor ({
					td: "X",
					ch: p,
					parent: self.parent,
				}));

	self.parent.ch.splice(self.chIndex, 1, ...newChildren);
}

function subDiv (self, a, b) {
	const 
		strings = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		newChildren = [];

	for (let str of strings) 
		if (str.length)
			newChildren.push(new self.constructor ({
					td: "X",
					ch: str,
					parent: self,
				}));

	self.ch = newChildren;
}

/*function detachRight (self, a) {
	const 
		left  = self.ch.slice(0, a),
		right = self.ch.slice(a   );
	if (left.length && right.length) {
		self.ch = left;
		insertRight(self, new Node({
			td: "X",
			ch: right,
		}));
	}
}

function detachLeft (self, a) {
	const 
		left  = self.ch.slice(0, a),
		right = self.ch.slice(a   );
	if (left.length && right.length) {
		insertLeft(self, new Node({
			td: "X",
			ch: left,
		}));
		self.ch = right;
	}
}*/

/*function insertRight (self, ...nodes) {
	self.parent.ch.splice(self.chIndex + 1, 0, ...nodes)
}

function insertLeft (self, ...nodes) {
	self.parent.ch.splice(self.chIndex, 0, ...nodes)
}*/

function getChIndex (self) {
	if (self.parent) 
		for (let [k,v] of self.parent.ch.entries()) 
			if (v == self)
				return k;

	return null;
}

function getRoot(self) {
	return self.parent ? getRoot(self.parent) : self;
}

function isStr(...args) {
	for (let a of args) 
		if (! (typeof a == "string"))
			return false;
	return true;
}

function isArr(...args) {
	for (let a of args) 
		if (! (a instanceof Array))
			return false;
	return true;
}

function toJSON(self) {
	const ob = Object.assign({}, self);
	delete ob.parent;
	delete ob.serialN;

	return ob;
}

function getClone(self) {
	const  clone = new Node(self);
	delete clone.parent;
	delete clone.serialN;

	if(typeof self.ch == "object") {
		clone.ch = self.ch.map(getClone);
		clone.ch.forEach(v => v.parent = clone);
	}

	return clone;
}

function checkToParent(self) {
	const root = getRoot(self);
	forEachRecur((node) => {
		if (node.ch)
			for (let v of node.ch) {
				if (! v.parent)
					debugger;
				if (v.parent != node)
					debugger;
			}
	});
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

function initChildren(self) {
	if (isArr(self))
		self.ch.forEach(v => v.parent = self);
}