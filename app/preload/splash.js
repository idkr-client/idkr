const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
	const version = document.getElementById('version');
	const message = document.getElementById('message');
	const details = document.getElementById('details');

	ipcRenderer.invoke('get-app-info').then(info => version.innerText = `${info.name}@${info.version}`);

	ipcRenderer.on('message', (event, messageText = '', detailsText = '') => {
		if (messageText != null) {
			message.innerText = messageText;
		}
		if (detailsText != null) {
			details.innerText = detailsText;
		}
	});
});
