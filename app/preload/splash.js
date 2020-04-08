const { remote, ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
	version.innerText = `${remote.app.name || remote.app.getName()}@${remote.app.getVersion()}`;
});

ipcRenderer.on('message', (event, messageText = '', detailsText = '') => {
	if (messageText != null) message.innerText = messageText;
	if (detailsText != null) details.innerText = detailsText;
});