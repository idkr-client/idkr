"use strict";

let { ipcRenderer } = require("electron");

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

	/** @type {Window & any} */
	(window).sendValue = value => {
		ipcRenderer.send("prompt-return", value);
		window.close();
	};

	// @ts-ignore
	window.importFile = () => (document.getElementById("fileSelect").files[0].text().then(text => (promptInput.value = text)));
});
