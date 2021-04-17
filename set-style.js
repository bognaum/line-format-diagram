export default function setStyle(clPref) {

	const cssCode = `
	.${clPref} {
	  font-size: 14px;
	  white-space: nowrap;
	  color: #333;
	  margin: 20px 5px;
	  padding: 20px 5px;
	  user-select: none;
	  font-family: consolas, courier, monospace; }
	  .${clPref}.executed * {
	    display: inline-block;
	    text-align: center; }
	  .${clPref}:not(.executed) {
	    font-family: monospace;
	    white-space: pre;
	    text-align: left; }
	  .${clPref} .${clPref}-part {
	    border-right: 1px solid transparent;
	    border-left: 1px solid transparent;
	    margin-right: -1px; }
	    .${clPref} .${clPref}-part .${clPref}-grid-v-liner {
	      margin: 0 1px;
	      margin-top: 5px;
	      display: flex;
	      align-items: center;
	      justify-content: center;
	      height: 50px; }
	    .${clPref} .${clPref}-part .${clPref}-description:hover {
	      user-select: text; }
	    .${clPref} .${clPref}-part .${clPref}-top-descr {
	      margin-top: -5px; }
	      .${clPref} .${clPref}-part .${clPref}-top-descr .${clPref}-h-line {
	        border-top: 1px solid #999;
	        flex-grow: 10; }
	      .${clPref} .${clPref}-part .${clPref}-top-descr .${clPref}-td-block {
	        flex-grow: 1; }
	    .${clPref} .${clPref}-part .${clPref}-line-text {
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
	    .${clPref} .${clPref}-part .${clPref}-bottom-rel-wr {
	      border-left: 1px solid transparent;
	      border-right: 1px solid transparent;
	      border-color: #999;
	      padding: 5px 1px;
	      margin: -1px;
	      display: block; }
	      .${clPref} .${clPref}-part .${clPref}-bottom-rel-wr .${clPref}-bottom-rel {
	        display: block;
	        position: relative;
	        border-bottom: 1px solid #999; }
	        .${clPref} .${clPref}-part .${clPref}-bottom-rel-wr .${clPref}-bottom-rel > .${clPref}-rel-line {
	          position: absolute;
	          width: 10px;
	          border-left: 1px solid #999;
	          border-bottom: 1px solid #999;
	          padding-bottom: calc(5px + .5em); }
	          .${clPref} .${clPref}-part .${clPref}-bottom-rel-wr .${clPref}-bottom-rel > .${clPref}-rel-line > .${clPref}-bottom-descr {
	            position: absolute;
	            left: 100%;
	            white-space: pre;
	            border: 1px solid #999;
	            text-align: left; }
	  .${clPref} .${clPref}-part.show-borders {
	    border-color: #999; }
	    .${clPref} .${clPref}-part.show-borders .sps-line-text {
	      border-color: #999; }
	  .${clPref} .${clPref}-grid-v-liner + .${clPref}-part {
	    margin-left: -1px; }
	  .${clPref} .${clPref}-grid-bv-liner {
	    padding: 5px;
	    border: 4px solid transparent;
	    display: block; }

	 `;

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