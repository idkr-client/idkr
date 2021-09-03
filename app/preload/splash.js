"use strict";

const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
	ipcRenderer
		.invoke("get-app-info")
		.then(info => (document.getElementById("version").innerText = `${info.name}@${info.version}`));

	ipcRenderer.on("message", (_, messageText = "", detailsText = "") => {
		!!messageText && (document.getElementById("message").innerText = messageText);
		!!detailsText && (document.getElementById("details").innerText = detailsText);
	});
});
