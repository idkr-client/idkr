"use strict";

let { ipcRenderer, contextBridge } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
	/** @type {HTMLInputElement} */
	const promptInput = (document.getElementById("promptInput"));

	ipcRenderer.on("prompt-data", (_, ipcMessage = "", ipcDefault = "") => {
		document.getElementById("message").innerText = ipcMessage;
		promptInput.value = ipcDefault;
		ipcRenderer.invoke("set-bounds", {
			height: document.getElementById("promptBody").getBoundingClientRect().height
		});
		promptInput.focus();
	});

	contextBridge.exposeInMainWorld("sendValue", value => {
		ipcRenderer.send("prompt-return", value);
		window.close();
	});

	contextBridge.exposeInMainWorld("importFile", () => (document.getElementById("fileSelect").files[0].text().then(text => (promptInput.value = text))));
});
