import * as lib from "./lib.js";

export default function editDiagram(self, elem, tOb) {
	// body...
}


function _getEditPanelDom(self) {
	const pr = self.clPref;
	return eHTML(`
		<div class="${pr}-edit-panel" style="white-space: normal;">
			<div class="${pr}-edit-panel__btn-block ${pr}-navi-buttons" style="float: left;">
				<button class="${pr}-nav-undo" >⤶</button>
				<button class="${pr}-nav-redo" >⤷</button>
				&nbsp;&nbsp;
				<button class="${pr}-nav-left" >⮜</button>
				<button class="${pr}-nav-up"   >⮝</button>
				<button class="${pr}-nav-right">⮞</button>
				<button class="${pr}-nav-down" >⮟</button>
			</div>
			<div class="-edit-panel__btn-block ${pr}-edit-buttons" style="float: right;">
				<button class="${pr}-edit-split"     >split</button>
				<button class="${pr}-edit-sub-div"   >subDiv</button>
				<button class="${pr}-edit-strip"     >strip</button>
				<button class="${pr}-edit-join"      >join</button>
			</div>
			<div style="clear: both;"></div>
		</div>
	`);
}