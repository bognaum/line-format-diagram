export default class Node {
	constructor (ob) {
		Object.assign(this, ob);
	}
	
	split        (a, b) { return split       (this, a, b);}
	subDiv       (a, b) { return subDiv      (this, a, b);}
	wrap         (a, b) { return wrap        (this, a, b);}
	strip        (    ) { return strip       (this      );}
	join         (a, b) { return join        (this, a, b);}

	isStr        (    ) { return isStr       (this      );}
	isArr        (    ) { return isArr       (this      );}

	toJSON       (    ) { return toJSON      (this      );}
	getSerial    (    ) { return getSerial   (this      );}
	getBySerial  (sN  ) { return getBySerial (this, sN  );}
	get chIndex () { return getChIndex(this); }
	get clone   () { return getClone  (this); }
}

function strip (self) {
	if (isArr(self.ch)) {
		self.parent.ch.splice(self.chIndex, 1, ...self.ch);
		initChildren(self.parent);
	}
}

function join (self, a, b) {
	if (isArr(self.ch)) {
		const joined = self.ch.slice(a, b);
		if (isArr(...joined.map(v => v.ch))) {
			const 
				startPoint = joined[0].chIndex,
				pasted = new Node({
					td: "J",
					parent: self,
					ch: [],
				});
			for (let v of joined)
				pasted.ch.push(...v.ch);
			for (let v of pasted.ch) 
				v.parent = pasted;
			self.ch.splice(startPoint, joined.length, pasted);
		} else if (isStr(...joined.map(v => v.ch))) {
			const 
				startPoint = joined[0].chIndex,
				pastedStr = joined.reduce((a,v) => a += v.ch, ""),
				pastedNode = new Node({
					td: "J",
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


function split (self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = [self.td || "X", "S", self.td || "X"],
		newChildren = [];

	for (let p of parts) {
		const td = tds.shift();
		if (p.length) 
			newChildren.push(new self.constructor ({
					td,
					ch: p,
					parent: self.parent,
				}));
	}
		

	self.parent.ch.splice(self.chIndex, 1, ...newChildren);
}

function wrap(self, a, b) {
	console.log(`a, b`, a, b);
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = ["X","W","X"],
		newChildren = [];

	if (isStr(self.ch)) {

		for (let str of parts) {
			const td = tds.shift();
			if (str.length)
				newChildren.push(new self.constructor ({
						td,
						ch: str,
						parent: self,
					}));
		}

		self.ch = newChildren;
	} else if (isArr(self.ch)) {
		const wrNode = new Node({
			td: "Wr",
			ch: parts[1],
			parent: self,
		});
		initChildren(wrNode);
		newChildren.push(...parts[0], wrNode, ...parts[2]);
		self.ch = newChildren;
	} else {
		throw new Error();
	}
}

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
	delete ob.topDescr;
	delete ob.bottomDescr;

	return ob;
}

function getClone(self) {
	const  clone = new Node(self);
	delete clone.parent;
	delete clone.serialN;
	delete clone.topDescr;
	delete clone.bottomDescr;

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

function getBySerial(self, serialN) {
	const root = getRoot(self);
	let node, sN = 0;
	forEachRecur((v) => {
		if (serialN == sN) 
			node = v;

		sN ++;
	}, root);
	return node;
}

function getSerial(self) {
	const root = getRoot(self);
	let serialN, sN = 0;
	forEachRecur((v) => {
		if (v == self)
			serialN = sN;
		else
			sN ++;
	}, root);
	return serialN;
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