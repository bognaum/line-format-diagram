export default function setStyle(clPref) {

	const cssCode = `.line-format-diagram {
  font-size: 14px;
  white-space: nowrap;
  color: #333;
  margin: 10px 5px;
  padding: 10px 5px;
  user-select: none;
  font-family: consolas, courier, monospace;
  /*&.executed *{
  	display: inline-block;
  	text-align: center;
  }*/
  /*&:not(.executed) {
  	font-family: monospace;
  	white-space: pre;
  	text-align: left;
  }*/
}
.line-format-diagram .line-format-diagram-part {
  display: inline-block;
  text-align: center;
  border-right: 1px solid transparent;
  border-left: 1px solid transparent;
  margin-right: -1px;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-grid-v-liner {
  margin: 0 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-description:hover {
  user-select: text;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-h-line {
  border-top: 1px solid #999;
  flex-grow: 10;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-td-block {
  flex-grow: 1;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-line-text {
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
  user-select: text;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr {
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-color: #999;
  padding: 5px 1px;
  margin: -1px;
  display: block;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr .line-format-diagram-bottom-rel {
  text-align: center;
  display: block;
  position: relative;
  border-bottom: 1px solid #999;
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr .line-format-diagram-bottom-rel > .line-format-diagram-rel-line {
  display: inline-block;
  position: absolute;
  width: 10px;
  border-left: 1px solid #999;
  border-bottom: 1px solid #999;
  padding-bottom: calc(5px + .5em);
}
.line-format-diagram .line-format-diagram-part .line-format-diagram-bottom-rel-wr .line-format-diagram-bottom-rel > .line-format-diagram-rel-line > .line-format-diagram-bottom-descr {
  position: absolute;
  left: 100%;
  white-space: pre;
  border: 1px solid #999;
  text-align: left;
}
.line-format-diagram .line-format-diagram-part.show-borders {
  border-color: #999;
}
.line-format-diagram .line-format-diagram-part.show-borders .sps-line-text {
  border-color: #999;
}
.line-format-diagram .line-format-diagram-grid-v-liner + .line-format-diagram-part {
  margin-left: -1px;
}
.line-format-diagram .line-format-diagram-grid-bv-liner {
  padding: 5px;
  border: 4px solid transparent;
  display: block;
}
.line-format-diagram .line-format-diagram-copy-btn-wr {
  display: inline-block;
  vertical-align: top;
  text-align: right;
  position: relative;
  opacity: 0;
  transition: opacity 0.1s linear;
}
.line-format-diagram .line-format-diagram-copy-btn-wr .line-format-diagram-copy-btn {
  opacity: 0.4;
  transition: opacity 0.1s linear;
  cursor: pointer;
}
.line-format-diagram .line-format-diagram-copy-btn-wr .line-format-diagram-copy-btn:hover {
  opacity: 1;
}
.line-format-diagram .line-format-diagram-copy-btn-wr:hover {
  opacity: 1;
}
.line-format-diagram:hover .line-format-diagram-copy-btn-wr {
  opacity: 1;
}

.line-format-diagram.top-lines .line-format-diagram-part .line-format-diagram-grid-v-liner {
  margin-top: 5px;
  border-top: 1px solid transparent;
}
.line-format-diagram.top-lines .line-format-diagram-part .line-format-diagram-top-descr {
  border-top: 1px solid #999;
  align-items: flex-start;
}
.line-format-diagram.top-lines .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-h-line {
  border: none;
}

.line-format-diagram.bottom-lines .line-format-diagram-part .line-format-diagram-grid-v-liner {
  margin-bottom: 5px;
  border-bottom: 1px solid transparent;
}
.line-format-diagram.bottom-lines .line-format-diagram-part .line-format-diagram-top-descr {
  border-bottom: 1px solid #999;
  margin-top: -5px;
  align-items: flex-end;
}
.line-format-diagram.bottom-lines .line-format-diagram-part .line-format-diagram-top-descr .line-format-diagram-h-line {
  border: none;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlOi8vL0Q6L0dpdEh1Yi1teS9saW5lLWZvcm1hdC1kaWdyYW0vQ1NTL2xmZC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVlBO0VBQ0M7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTUE7RUFDQztFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0VBQ0M7RUFFQTtFQUNBO0VBQ0E7RUFDQTs7QUFNQTtFQUNDOztBQUtEO0VBQ0M7RUFDQTs7QUFFRDtFQUNDOztBQUdGO0VBQ0M7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFFRDtFQUNDO0VBQ0E7RUFDQSxjQXpFZTtFQTBFZjtFQUNBO0VBQ0E7O0FBQ0E7RUFDQztFQUNBO0VBQ0E7RUFDQTs7QUFDQTtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFDQTtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7O0FBTUw7RUFDQyxjQXJHZ0I7O0FBc0doQjtFQUNDLGNBdkdlOztBQTBHakI7RUFDQzs7QUFFRDtFQUNDLFNBL0d3QjtFQWdIeEI7RUFDQTs7QUFFRDtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFDQTtFQUNDO0VBQ0E7RUFDQTs7QUFDQTtFQUNDOztBQUdGO0VBQ0M7O0FBR0Y7RUFDQzs7O0FBTUE7RUFDQztFQUNBOztBQUVEO0VBQ0M7RUFDQTs7QUFDQTtFQUNDOzs7QUFTRjtFQUNDO0VBQ0E7O0FBRUQ7RUFDQztFQUNBO0VBQ0E7O0FBQ0E7RUFDQyIsImZpbGUiOiJsZmQuc2Nzcy5qcyJ9 */`.replaceAll(/\bline-format-diagram/g, clPref);

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