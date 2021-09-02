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
	background-color: #353535;
	box-shadow: 0 9px 0 0 #a6a6a6
}

/* Temporal workaround for "No settings found" appearing in idkr tab all the time */
div.setHed:first-child:not(:only-child) {
	display: none;
}
`;

const menuTimerStyles = `
#uiBase.onMenu #spectateUI {
	display: block !important;
}

#uiBase.onMenu #spectateUI > :not(#spectateHUD) {
	display: none !important;
}

#uiBase.onMenu #spectateHUD > :not(.spectateInfo, #specGMessage) {
	display: none !important;
}

#uiBase.onMenu #specTimer {
	font-size: 28px;
	text-align: center;
	position: fixed;
	transform: translateX(-50%);
	left: 50%;
	top: 20px;
	width: 221px;
	height: 89px;
	padding: 20px;
	margin:0;
	border-radius: 0;
	background-color: transparent;
	will-change: unset;
	text-shadow: 2px 2px 3px rgba(30, 30, 30, .5);
}

#uiBase.onMenu #spectateHUD {
	transform:translate(-50%,-50%);
	position:fixed;
	top:55%;
}
`;

module.exports = {
	baseStyles,
	menuTimerStyles
};
