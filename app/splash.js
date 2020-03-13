const { remote, ipcRenderer } = require('electron')

const win = remote.getCurrentWindow()

document.addEventListener('DOMContentLoaded', () => {
	version.innerText = `${remote.app.name}@${remote.app.getVersion()}`
})

ipcRenderer.on('au-error', (event, err) => message.innerText = 'Error: ' + err.name)
ipcRenderer.on('au-checking-for-update', () => message.innerText = 'Checking for update')
ipcRenderer.on('au-update-available', (event, info) => {
	message.innerText = `Update v${info.version} available`
	details.innerText = `${info.releaseDate} / ${info.files.join(', ')}`
})
ipcRenderer.on('au-download-progress', (event, info) => {
	message.innerText = `Downloaded ${Math.floor(info.percent)}%`
	details.innerText = Math.floor(info.bytesPerSecond / 1000) + 'kB/s'
	win.setProgressBar(info.percent / 100)
})
ipcRenderer.on('au-update-downloaded', (event, info) => {
	details.innerText = 'Installing...'
})