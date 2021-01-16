const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
	const message = document.getElementById('message'),
		promptInput = document.getElementById('promptInput'),
		promptBody = document.getElementById('promptBody'),
		fileSelect = document.getElementById('fileSelect');

	ipcRenderer.on('prompt-data', (event, ipcMessage = '', ipcDefault = '') => {
		message.innerText = ipcMessage;
		promptInput.value = ipcDefault;
		ipcRenderer.invoke('set-bounds', { height: promptBody.getBoundingClientRect().height });
		promptInput.focus();
	});

	window.sendValue = value => {
		ipcRenderer.send('prompt-return', value);
		window.close();
	};

	window.importFile = () => {
		fileSelect.files[0].text().then(text => promptInput.value = text);
	};
});
