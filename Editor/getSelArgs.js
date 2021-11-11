export default function getSelArgs(clPref, tOb) {
	const 
		sel = window.getSelection();
	if (sel.rangeCount) {
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
			rootPart = getPart(clPref, rootEl),
			rootNode = rootPart ? tOb.getBySerial(rootPart.dataset.serialN) : null,
			r        = parseInt(rootPart?.dataset.serialN || null);

		if (rootPart) {
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

			/*let n = 0;
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
			console.groupEnd();*/

			return {r, a, b};
		}
	}

	return {};
}


function getPart(clPref, el) {
	return recur(el);
	function recur(el) {
		if (isPart(clPref, el)) 
			return el;
		if (el.parentElement)
			return recur(el.parentElement);
	}
}

function isPart(clPref, el) {
	return el.classList?.contains(`${clPref}-part`);
}