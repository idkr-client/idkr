const { ipcRenderer } = require("electron"),
	log = require('electron-log')

Object.assign(console, log.functions)

window.prompt = (message, defaultValue) => ipcRenderer.sendSync('prompt', message, defaultValue)

switch (locationType(location.href)) {
	case 'game':
		require('./game.js')
		break
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