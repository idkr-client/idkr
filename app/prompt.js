const { ipcRenderer } = require('electron')

ipcRenderer.on('prompt', (event, ipcMessage = '', ipcDefault = '') => {
	message.innerText = ipcMessage
	textInput.value = ipcDefault
	textInput.focus()
})