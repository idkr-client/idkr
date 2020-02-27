console.log('Global Preload Script')

const { remote } = require("electron")
const Store = require('electron-store')
const config = new Store()
const path = require('path')
const argv = require('yargs').argv // TODO: Apply main process arguments
const log = require('electron-log')
const shortcuts = require('electron-localshortcut')
Object.assign(console, log.functions)

const DEBUG = Boolean(argv.debug || config.get('debug'))

window.prompt = (message, defaultValue) => {
	let win = new remote.BrowserWindow({
		width: 480,
		height: 240,
		center: true,
		show: false,
		frame: false,
		resizable: false,
		webPreferences: {
			preload: path.join(__dirname, 'prompt.js')
		}
	})
	let contents = win.webContents

	if (DEBUG) contents.toggleDevTools()
	shortcuts.register(win, process.platform == 'darwin' ? 'Command+Option+I' : 'Control+Shift+I', () => contents.toggleDevTools())
	win.removeMenu()
	win.once('ready-to-show', () => {
		contents.send('prompt', message, defaultValue)
		win.show()
	})

	win.loadFile('app/prompt.html')
}