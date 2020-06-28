const { ipcRenderer, remote } = require('electron')

ipcRenderer.on('prompt-data', (event, ipcMessage = '', ipcDefault = '') => {
	message.innerText = ipcMessage
	promptInput.value = ipcDefault
	remote.getCurrentWindow().setBounds({ height: promptBody.getBoundingClientRect().height })
	promptInput.focus()
})

window.sendValue = value => {
	ipcRenderer.send('prompt-return', value)
	window.close()
}

window.importFile = () => {
	fileSelect.files[0].text().then(text => promptInput.value = text)
}