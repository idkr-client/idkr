"use strict";

let { ipcRenderer } = require("electron");

/**
 * @typedef {Window & any} window
 */

window.addEventListener("DOMContentLoaded", () => {
	/** @type {HTMLInputElement} */
	const promptInput = (document.getElementById("promptInput"));

	ipcRenderer.on("prompt-data", (event, ipcMessage = "", ipcDefault = "") => {
		document.getElementById("message").innerText = ipcMessage;
		promptInput.value = ipcDefault;
		ipcRenderer.invoke("set-bounds", {
			height: document.getElementById("promptBody").getBoundingClientRect().height
		});
		promptInput.focus();
	});

	/** @type {window} */
	(window).sendValue = value => {
		ipcRenderer.send("prompt-return", value);
		window.close();
	};

	/** @type {window} */
	(window).importFile = () => {
		/**
		 * @type {HTMLInputElement}
		 */
		(document.getElementById("fileSelect")).files[0].text().then(text => (promptInput.value = text));
	};
});
