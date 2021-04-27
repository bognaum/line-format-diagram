export default function setStyle(clPref) {

	const cssCode = `
	.e-scheme {
	  font-size: 14px;
	  white-space: nowrap;
	  color: #333;
	  margin: 20px 5px;
	  padding: 20px 5px;
	  user-select: none;
	  font-family: consolas, courier, monospace; }
	  .e-scheme.executed * {
	    display: inline-block;
	    text-align: center; }
	  .e-scheme:not(.executed) {
	    font-family: monospace;
	    white-space: pre;
	    text-align: left; }
	  .e-scheme .e-scheme-part {
	    border-right: 1px solid transparent;
	    border-left: 1px solid transparent;
	    margin-right: -1px; }
	    .e-scheme .e-scheme-part .e-scheme-grid-v-liner {
	      margin: 0 1px;
	      display: flex;
	      align-items: center;
	      justify-content: center;
	      height: 50px; }
	    .e-scheme .e-scheme-part .e-scheme-description:hover {
	      user-select: text; }
	    .e-scheme .e-scheme-part .e-scheme-top-descr .e-scheme-h-line {
	      border-top: 1px solid #999;
	      flex-grow: 10; }
	    .e-scheme .e-scheme-part .e-scheme-top-descr .e-scheme-td-block {
	      flex-grow: 1; }
	    .e-scheme .e-scheme-part .e-scheme-line-text {
	      font-size: 20px;
	      font-weight: bold;
	      color: #333;
	      white-space: pre;
	      background-clip: padding-box;
	      border-left: 1px solid transparent;
	      border-right: 1px solid transparent;
	      margin: -1px;
	      margin-top: 5px;
	      font-family: consolas, courier, monospace;
	      user-select: text; }
	    .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr {
	      border-left: 1px solid transparent;
	      border-right: 1px solid transparent;
	      border-color: #999;
	      padding: 5px 1px;
	      margin: -1px;
	      display: block; }
	      .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr .e-scheme-bottom-rel {
	        display: block;
	        position: relative;
	        border-bottom: 1px solid #999; }
	        .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr .e-scheme-bottom-rel > .e-scheme-rel-line {
	          position: absolute;
	          width: 10px;
	          border-left: 1px solid #999;
	          border-bottom: 1px solid #999;
	          padding-bottom: calc(5px + .5em); }
	          .e-scheme .e-scheme-part .e-scheme-bottom-rel-wr .e-scheme-bottom-rel > .e-scheme-rel-line > .e-scheme-bottom-descr {
	            position: absolute;
	            left: 100%;
	            white-space: pre;
	            border: 1px solid #999;
	            text-align: left; }
	  .e-scheme .e-scheme-part.show-borders {
	    border-color: #999; }
	    .e-scheme .e-scheme-part.show-borders .sps-line-text {
	      border-color: #999; }
	  .e-scheme .e-scheme-grid-v-liner + .e-scheme-part {
	    margin-left: -1px; }
	  .e-scheme .e-scheme-grid-bv-liner {
	    padding: 5px;
	    border: 4px solid transparent;
	    display: block; }

	.e-scheme.top-lines .e-scheme-part .e-scheme-grid-v-liner {
	  margin-top: 5px;
	  border-top: 1px solid transparent; }

	.e-scheme.top-lines .e-scheme-part .e-scheme-top-descr {
	  border-top: 1px solid #999;
	  align-items: flex-start; }
	  .e-scheme.top-lines .e-scheme-part .e-scheme-top-descr .e-scheme-h-line {
	    border: none; }

	.e-scheme.bottom-lines .e-scheme-part .e-scheme-grid-v-liner {
	  margin-bottom: 5px;
	  border-bottom: 1px solid transparent; }

	.e-scheme.bottom-lines .e-scheme-part .e-scheme-top-descr {
	  border-bottom: 1px solid #999;
	  margin-top: -5px;
	  align-items: flex-end; }
	  .e-scheme.bottom-lines .e-scheme-part .e-scheme-top-descr .e-scheme-h-line {
	    border: none; }

	 `.replace(/e-scheme/g, clPref);

	const styleClassName = `${clPref}__theme-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = eHTML(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		document.head.appendChild(style);
	}
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