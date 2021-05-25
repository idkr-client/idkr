"use strict";

/* 200IQ */

module.exports = `
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
