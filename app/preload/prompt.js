const { ipcRenderer } = require('electron')

ipcRenderer.on('prompt-data', (event, ipcMessage = '', ipcDefault = '') => {
	message.innerText = ipcMessage
	promptInput.value = ipcDefault
	ipcRenderer.invoke('set-bounds', { height: promptBody.getBoundingClientRect().height })
	promptInput.focus()
})

window.sendValue = value => {
	ipcRenderer.send('prompt-return', value)
	window.close()
}

window.importFile = () => {
	fileSelect.files[0].text().then(text => promptInput.value = text)
}