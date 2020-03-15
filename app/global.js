const { ipcRenderer, remote } = require("electron"),
	log = require('electron-log'),
	fs = require('fs'),
	path = require('path'),
	Store = require('electron-store')

let config = new Store()

Object.assign(console, log.functions)

window.prompt = (message, defaultValue) => ipcRenderer.sendSync('prompt', message, defaultValue)

let windowType = locationType(location.href)

switch (windowType) {
	case 'game':
		require('./game.js')
		break
}

if (config.get('enableUserscripts', false)) {
	let scriptsPath = path.join(remote.app.getPath('documents'), 'idkr/scripts')
	fs.readdirSync(scriptsPath).filter(filename => path.extname(filename).toLowerCase() == '.js').forEach(filename => {
		try {
			let script = require(path.join(scriptsPath, filename))
			if (script.locations.findIndex(location => ['all', windowType].includes(location)) > -1) script.run()
			console.log(`Loaded userscript: ${script.name || 'Unnamed userscript'} by ${script.author || 'Unknown author'}`)
		} catch (err) { console.error('Failed to load userscript:', err) }
	})
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