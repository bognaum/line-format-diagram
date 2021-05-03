export default function setStyle(clPref) {

	const cssCode = `
	.lit-lay {
	  font-size: 14px;
	  white-space: nowrap;
	  color: #333;
	  margin: 20px 5px;
	  padding: 20px 5px;
	  user-select: none;
	  font-family: consolas, courier, monospace; }
	  .lit-lay.executed * {
	    display: inline-block;
	    text-align: center; }
	  .lit-lay:not(.executed) {
	    font-family: monospace;
	    white-space: pre;
	    text-align: left; }
	  .lit-lay .lit-lay-part {
	    border-right: 1px solid transparent;
	    border-left: 1px solid transparent;
	    margin-right: -1px; }
	    .lit-lay .lit-lay-part .lit-lay-grid-v-liner {
	      margin: 0 1px;
	      display: flex;
	      align-items: center;
	      justify-content: center;
	      height: 50px; }
	    .lit-lay .lit-lay-part .lit-lay-description:hover {
	      user-select: text; }
	    .lit-lay .lit-lay-part .lit-lay-top-descr .lit-lay-h-line {
	      border-top: 1px solid #999;
	      flex-grow: 10; }
	    .lit-lay .lit-lay-part .lit-lay-top-descr .lit-lay-td-block {
	      flex-grow: 1; }
	    .lit-lay .lit-lay-part .lit-lay-line-text {
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
	    .lit-lay .lit-lay-part .lit-lay-bottom-rel-wr {
	      border-left: 1px solid transparent;
	      border-right: 1px solid transparent;
	      border-color: #999;
	      padding: 5px 1px;
	      margin: -1px;
	      display: block; }
	      .lit-lay .lit-lay-part .lit-lay-bottom-rel-wr .lit-lay-bottom-rel {
	        display: block;
	        position: relative;
	        border-bottom: 1px solid #999; }
	        .lit-lay .lit-lay-part .lit-lay-bottom-rel-wr .lit-lay-bottom-rel > .lit-lay-rel-line {
	          position: absolute;
	          width: 10px;
	          border-left: 1px solid #999;
	          border-bottom: 1px solid #999;
	          padding-bottom: calc(5px + .5em); }
	          .lit-lay .lit-lay-part .lit-lay-bottom-rel-wr .lit-lay-bottom-rel > .lit-lay-rel-line > .lit-lay-bottom-descr {
	            position: absolute;
	            left: 100%;
	            white-space: pre;
	            border: 1px solid #999;
	            text-align: left; }
	  .lit-lay .lit-lay-part.show-borders {
	    border-color: #999; }
	    .lit-lay .lit-lay-part.show-borders .sps-line-text {
	      border-color: #999; }
	  .lit-lay .lit-lay-grid-v-liner + .lit-lay-part {
	    margin-left: -1px; }
	  .lit-lay .lit-lay-grid-bv-liner {
	    padding: 5px;
	    border: 4px solid transparent;
	    display: block; }

	.lit-lay.top-lines .lit-lay-part .lit-lay-grid-v-liner {
	  margin-top: 5px;
	  border-top: 1px solid transparent; }

	.lit-lay.top-lines .lit-lay-part .lit-lay-top-descr {
	  border-top: 1px solid #999;
	  align-items: flex-start; }
	  .lit-lay.top-lines .lit-lay-part .lit-lay-top-descr .lit-lay-h-line {
	    border: none; }

	.lit-lay.bottom-lines .lit-lay-part .lit-lay-grid-v-liner {
	  margin-bottom: 5px;
	  border-bottom: 1px solid transparent; }

	.lit-lay.bottom-lines .lit-lay-part .lit-lay-top-descr {
	  border-bottom: 1px solid #999;
	  margin-top: -5px;
	  align-items: flex-end; }
	  .lit-lay.bottom-lines .lit-lay-part .lit-lay-top-descr .lit-lay-h-line {
	    border: none; }

	 `.replace(/\blit-lay/g, clPref);

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