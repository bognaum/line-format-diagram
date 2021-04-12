import JsonEHl from "./json-error-hl/json-error-hl.js";
export default class EScheme {
	build (container, template=null, clPref="e-scheme") {
		if (container.classList.contains("executed")) {
			console.error(`(!) Expression Scheme:`, `Dowble execution. \n`, container);
			return;
		}
		const 
			lineTextStyle = container.dataset.lineTextStyle || "",
			bdColor       = container.dataset.bdColor && 
				` border-color: ${container.dataset.bdColor};` || "";

		/*const 
			tLevels = [],
			bLevels = [];*/

		let tOb;

		if (! template)
			template = container.textContent;

		if (typeof template == "string") {
			try {
				tOb = JSON.parse(template);
			} catch (err) {
				const firstLineNum = (container.dataset.lineNum + 1) || 1;
				showJsonError(template, firstLineNum);
				return;
			}
		} else {

		}

		function showJsonError(json, firstLineNum) {
			const 
				hlter = new JsonEHl("e-s-json-err-hl");
				pre = document.createElement("pre");
			pre.classList.add("e-s-json-err-hl");
			hlter.highlight(pre, json, firstLineNum);
		}


		getLevels(templ);
		const linesHtmlStr = getLinersHtmlStr();

		function getTempl(json) {
			try {
				return JSON.parse(templ);
			} catch(err) {
				console.error(err);
				// console.log(`err`);console.dir(err);
				if (self.jsonErrorHl) {
					const codePre = document.createElement("pre");
					codePre.className = "json-error-hl";
					container.parentElement.insertBefore(codePre, container);
					self.jsonErrorHl.highlight(codePre, json, container.dataset.lineNum || 1);
					self.jsonErrorHl.highlight.scrollToFirstError(codePre);
				} else if (window.findJsonError) {
					return window.findJsonError(json).getMarkedStr();
				}
			}
		}
	}
}