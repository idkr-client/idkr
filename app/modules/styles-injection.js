"use strict";

/* 200IQ */

const baseStyles = `
#settingsTabLayout {
	grid-template-columns: repeat(8, 1fr)
}

#settingsTabLayout>div:nth-child(7) {
	display: none
}

#idkr-windowHolder {
	width: 100%;
	height: 100%;
	position: absolute
}

#idkr-menuWindow {
	position: absolute;
	left: 50%;
	top: 50%;
	border-radius: 6px;
	max-height: calc(100% - 480px);
	transform: translate(-50%, -50%);
	z-index: 2;
	overflow-y: auto;
	display: inline-block;
	text-align: left;
	pointer-events: auto;
	padding: 20px;
	width: 705px;
	font-size: 20px;
	background-color: #fff;
	-webkit-box-shadow: 0 9px 0 0 #a6a6a6;
	-moz-box-shadow: 0 9px 0 0 #a6a6a6;
	box-shadow: 0 9px 0 0 #a6a6a6
}
`;

const menuTimerStyles = `
#aHolder {
	display:none !important;
}

#spectateUI {
	display: block !important;
}

#specNames, #specGameInfo, #spec0, #spectateInfo, #spec1, #specStats, #specSUS, #specContr, #specKPDContr {
	display: none !important;
}

#specTimer {
	font-size: 28px;
	text-align: center;
	position: fixed;
	transform: translateX(-50%);
	left: 50%;
	top: 20px;
	width: 221px;
	height: 89px;
	padding: 0;
	margin:0;
	border-radius: 0;
	background-color: transparent;
	will-change: unset;
	text-shadow: 2px 2px 3px rgba(30, 30, 30, .5);
}

#spectateHUD {
	transform:translate(-50%,-50%);
	position:fixed;
	top:55%;
}

#uiBase.onMenu #specTimer {
	display:block !important;
	color:red;
	background-color:transparent;
	opacity: 1;
}

#instructionHolder {
	z-index: -2;
}
`;

module.exports = {
	baseStyles,
	menuTimerStyles
};
