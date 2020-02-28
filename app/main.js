require('v8-compile-cache')
const { app, BrowserWindow, shell, ipcMain } = require("electron")
const Store = require('electron-store')
const config = new Store()
const path = require('path')
const { URL } = require('url')
const argv = require('yargs').argv
const log = require('electron-log')
const shortcuts = require('electron-localshortcut')
Object.assign(console, log.functions)

const DEBUG = Boolean(argv.debug || config.get('debug'))
const AUTO_UPDATE = argv.update || config.get('autoUpdate', 'download')

if (config.get('disableFrameRateLimit', true)) app.commandLine.appendSwitch('disable-frame-rate-limit')

ipcMain.on('prompt', (event, message, defaultValue) => {
	let promptWin = initPromptWindow(message, defaultValue)
	let returnValue = null

	ipcMain.on('prompt-return', (event, value) => returnValue = value)

	promptWin.on('closed', () => {
		event.returnValue = returnValue
	})
})

function setupWindow(win) {
	let contents = win.webContents

	if (DEBUG) contents.toggleDevTools()
	win.removeMenu()
	win.once('ready-to-show', () => {
		if (locationType(contents.getURL()) == 'game') win.setFullScreen(config.get('fullScreen', false))
		win.show()
	})

	// "Global" shortcuts
	shortcuts.register(win, process.platform == 'darwin' ? 'Command+Option+I' : 'Control+Shift+I', () => contents.toggleDevTools())
	shortcuts.register(win, process.platform == 'darwin' ? 'Command+Left' : 'Alt+Left', () => { if (contents.canGoBack()) contents.goBack() })
	shortcuts.register(win, process.platform == 'darwin' ? 'Command+Right' : 'Alt+Right', () => { if (contents.canGoForward()) contents.goForward() })
	shortcuts.register(win, 'F5', () => contents.reload())
	shortcuts.register(win, 'Shift+F5', () => contents.reloadIgnoringCache())
	shortcuts.register(win, 'F11', () => {
		let full = win.isFullScreen()
		win.setFullScreen(!full)
		if (locationType(contents.getURL()) == 'game') config.set('fullScreen', !full)
	})
}

function initWindow(url) {
	let isGame = locationType(url) == 'game'
	let win = new BrowserWindow({
		width: isGame ? 1600 : 1280,
		height: isGame ? 900 : 720,
		show: false,
		webPreferences: {
			preload: path.join(__dirname, 'global.js')
		}
	})
	let contents = win.webContents
	setupWindow(win)
	contents.on("new-window", navigateNewWindow)
	contents.on("will-navigate", (event, url) => {
		if (locationType(url) == 'external') {
			event.preventDefault()
			shell.openExternal(url)
		} else if (locationType(url) != 'game' && locationType(contents.getURL()) == 'game') navigateNewWindow(event, url)
	})

	win.loadURL(url)

	return win

	function navigateNewWindow(event, url) {
		event.preventDefault()
		if (locationType(url) == 'external') shell.openExternal(url)
		else if (locationType(url) != 'unknown') event.newGuest = initWindow(url)
	}
}

function initSplashWindow() {
	let win = new BrowserWindow({
		width: 600,
		height: 300,
		center: true,
		resizable: false,
		show: false,
		frame: false,
		transparent: true,
		webPreferences: {
			preload: path.join(__dirname, 'splash.js')
		}
	})
	let contents = win.webContents

	contents.on("dom-ready", () => {
		const { autoUpdater } = require('electron-updater')
		autoUpdater.logger = log

		autoUpdater.on('error', err => {
			console.error(err)
			contents.send('au-error', err)
			launchGame()
		})
		autoUpdater.on('checking-for-update', () => contents.send('au-checking-for-update'))
		autoUpdater.on('update-available', info => {
			console.log(info)
			contents.send('au-update-available', info)
			if (AUTO_UPDATE != 'download') launchGame()
		})
		autoUpdater.on('update-not-available', info => {
			console.log(info)
			contents.send('au-update-not-available', info)
			launchGame()
		})
		autoUpdater.on('download-progress', info => contents.send('au-download-progress', info))
		autoUpdater.on('update-downloaded', info => contents.send('au-update-downloaded', info))

		autoUpdater.autoDownload = AUTO_UPDATE == 'download'
		autoUpdater.checkForUpdates()

		function launchGame() {
			initWindow('https://krunker.io')
			setTimeout(() => win.destroy(), 2000)
		}
	})

	setupWindow(win)
	win.loadFile("app/splash.html")
	return win
}

function initPromptWindow (message, defaultValue) {
	let win = new BrowserWindow({
		width: 480,
		height: 240,
		center: true,
		show: false,
		frame: false,
		resizable: false,
		transparent: true,
		webPreferences: {
			preload: path.join(__dirname, 'prompt.js')
		}
	})
	let contents = win.webContents

	setupWindow(win)
	win.once('ready-to-show', () => {
		contents.send('prompt-data', message, defaultValue)
	})

	win.loadFile('app/prompt.html')

	return win
}

function locationType(url = '') {
	if (!isValidURL(url)) return 'unknown'
	const target = new URL(url)
	if (/^(www\.)?krunker\.io$/.test(target.hostname)) {
		if (/^\/docs\/.+\.txt$/.test(target.pathname)) return 'docs'
		switch (target.pathname) {
			case '/': return 'game'
			case '/social.html': return 'social'
			case '/viewer.html': return 'viewer'
			case '/editor.html': return 'editor'
			default: return 'unknown'
		}
	} else return 'external'

	function isValidURL(url = '') {
		try {
			new URL(url)
			return true
		} catch (e) {
			return false
		}
	}
}

app.once("ready", () => {
	if (AUTO_UPDATE == 'skip') initWindow('https://krunker.io')
	else initSplashWindow()
})