export default class Node {
	constructor (ob) {
		Object.assign(this, ob);
	}
	
	split        (a, b) { return split       (this, a, b);}
	join         (a, b) { return join        (this, a, b);}
	wrap         (a, b) { return wrap        (this, a, b);}
	subdivide    (a, b) { return subdivide   (this, a, b);}
	wrapSubdiv   (a, b) { return wrapSubdiv  (this, a, b);}
	unwrap       (    ) { return unwrap      (this      );}

	isStr        (    ) { return isStr       (this      );}
	isArr        (    ) { return isArr       (this      );}

	toJSON       (    ) { return toJSON      (this      );}
	getSerial    (    ) { return getSerial   (this      );}
	getBySerial  (sN  ) { return getBySerial (this, sN  );}
	preRecIter   (    ) { return preRecIter  (this      );}
	postRecIter  (    ) { return postRecIter (this      );}
	get chIndex () { return getChIndex(this); }
	get clone   () { return getClone  (this); }
}

function unwrap (self) {
	if (self.parent) {
		if (isArr(self.ch)) {
			return function unwrap1(){
				self.parent.ch.splice(self.chIndex, 1, ...self.ch);
				initChildren(self.parent);
				const selRootEl = self.parent;
				return {
					r: self.parent.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		} else if (isStr(self.ch) && self.parent && self.parent.ch.length == 1) {
			return function unwrap2() {
				self.parent.ch = self.ch;
				initChildren(self.parent);
				const selRootEl = self.parent;
				return {
					r: self.parent.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		}
	}
}

function join (self, a, b) {
	if (isArr(self.ch)) {
		const joined = self.ch.slice(a, b);
		if (isArr(...joined.map(v => v.ch))) {
			return function join1() {
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
				const selRootEl = self;
				return {
					r: selRootEl.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		} else if (isStr(...joined.map(v => v.ch))) {
			return function join2() {
				const 
					startPoint = joined[0].chIndex,
					pastedStr = joined.reduce((a,v) => a += v.ch, ""),
					pastedNode = new Node({
						td: "J",
						ch: pastedStr,
						parent: self,
					});
				self.ch.splice(startPoint, joined.length, pastedNode);
				const selRootEl = self;
				return {
					r: selRootEl.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		}
	}
	/*const 
		n = self.chIndex + 1,
		right = self.parent.ch[n];
	if (right)
		if (isArr(self, right) || isStr(self, right)) {
			self.ch = self.ch.concat(right.ch);
			self.parent.ch.splice(n, 1);
		}*/

}


function split (self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = [self.td || "S", self.td || "S", self.td || "S"],
		newChildren = [];
	if (self.parent) {
		return function split1() {

			for (let p of parts) {
				const td = tds.shift();
				if (p.length) 
					newChildren.push(new self.constructor ({
							td,
							ch: p,
							parent: self.parent,
						})
					);
			}

			self.parent.ch.splice(self.chIndex, 1, ...newChildren);
			const selRootEl = self.parent;
			return {
				r: selRootEl.getSerial(), 
				a: 0, 
				b: selRootEl.ch.length
			};
		}
	} else {
		return function split2() {
			for (let part of parts) {
				const td = tds.shift();
				if (part.length)
					newChildren.push(new self.constructor ({
							td,
							ch: part,
							parent: self,
						})
					);
			}
			self.ch = newChildren;
			// return {r: self.getSerial(), a, b};
			const selRootEl = self;
			return {
				r: selRootEl.getSerial(), 
				a: 0, 
				b: selRootEl.ch.length
			};
		}
	}
}

function subdivide(self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = ["sd","sd","sd"],
		newChildren = [];

	return function subdivide1() {
		for (let part of parts) {
			const td = tds.shift();
			if (part.length)
				newChildren.push(new self.constructor ({
						td,
						ch: part,
						parent: self,
					}));
		}

		self.ch = newChildren;
		const selRootEl = self;
		return {
			r: selRootEl.getSerial(), 
			a: 0, 
			b: selRootEl.ch.length
		};
	}
		
}

function wrap(self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = ["X","W","X"],
		newChildren = [];


	if (isStr(self.ch)) {
		if (self.parent) {
			return function wrap1() {
				const wr = new self.constructor({
					td: "Wr",
					ch: [self],
					parent: self.parent,
				});
				self.parent.ch[self.chIndex] = wr;
				initChildren(wr);
				initChildren(self);
				const selRootEl = wr;
				return {
					r: selRootEl.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		} else {
			return function wrap2() {
				const clone = self.clone;
				self.ch = [clone];
				clone.td ||= "in";
				self.td ||= "Wr";
				initChildren(self);
				const selRootEl = self;
				return {
					r: selRootEl.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		}
	} else if (isArr(self.ch)) {
		if (parts[1].length) {
			return function wrap3() {
				const wrNode = new Node({
					td: "Wr",
					ch: parts[1],
					parent: self,
				});
				initChildren(wrNode);
				newChildren.push(...parts[0], wrNode, ...parts[2]);
				self.ch = newChildren;
				const selRootEl = wrNode;
				return {
					r: selRootEl.getSerial(), 
					a: 0, 
					b: selRootEl.ch.length
				};
			}
		} else if (a == 0 && b == 0) {
			if (self.parent) {
				return function wrap4() {
					const wr = new Node({
						td: "Wr",
						ch: [self],
						parent: self.parent,
					});
					self.parent.ch[self.chIndex] = wr;
					initChildren(wr);
					initChildren(self);
					const selRootEl = wr;
					return {
						r: selRootEl.getSerial(), 
						a: 0, 
						b: selRootEl.ch.length
					};
				}
			}
		}
	} else {
		throw new Error();
	}
}


function wrapSubdiv(self, a, b) {
	const 
		parts = [
			self.ch.slice(0, a),
			self.ch.slice(a, b),
			self.ch.slice(b   ),
		],
		tds = ["X","W","X"],
		newChildren = [];

	if (isStr(self.ch)) {
		return () => {
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
		}
	} else if (isArr(self.ch)) {
		return () => {
			const wrNode = new Node({
				td: "Wr",
				ch: parts[1],
				parent: self,
			});
			initChildren(wrNode);
			newChildren.push(...parts[0], wrNode, ...parts[2]);
			self.ch = newChildren;
		}
	} else {
		throw new Error();
	}
}

function * preRecIter(self) {
	yield * recur(self);
	function * recur(ob) {
		if (ob instanceof Array) {
			for (let v of ob)
					yield * recur(v);
		} else if (typeof ob == "object") {
			yield ob;
			yield * recur(ob.ch);
		}
	}
}

function * postRecIter(self) {
	yield * recur(self);
	function * recur(ob) {
		if (ob instanceof Array) {
			for (let v of ob)
					yield * recur(v);
		} else if (typeof ob == "object") {
			yield * recur(ob.ch);
			yield ob;
		}
	}
}

function getChIndex (self) {
	if (self.parent) {
		for (let [k,v] of self.parent.ch.entries()) {
			if (v == self)
				return k;
		}
		console.error(`(!)-USER'S `, `\n Invalid parent of`, self, "\n The invalid parent is", self.parent);
		throw new Error("Invalid parent");
	}

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
	if (isArr(self.ch))
		self.ch.forEach(v => v.parent = self);
}

function testToIntegrity(self) {
	recur(self);
	function recur(node) {
		if (!node.ch) {
			throw new Error();
		}
		if (!node.ch.length) {
			throw new Error();
		}
		if (typeof node.ch == "object") {
			for (const ch of node.ch) {
				if (ch.parent != node) {
					throw new Error();
				}
				recur(ch);
			}
		} else if (typeof node.ch == "string") {

		} else {
			throw new Error();
		}
	}
}