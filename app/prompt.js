const { ipcRenderer, remote } = require('electron')

ipcRenderer.on('prompt-data', (event, ipcMessage = '', ipcDefault = '') => {
	message.innerText = ipcMessage
	promptInput.value = ipcDefault
	remote.getCurrentWindow().setBounds({ height: promptBody.getBoundingClientRect().height })
	promptInput.focus()
})

window.sendValue = function sendValue(value) {
	ipcRenderer.send('prompt-return', value)
	window.close()
}