require('v8-compile-cache')
const events = require('events'),
	fs = require('fs'),
	path = require('path'),
	{ ipcRenderer, remote } = require("electron"),
	Store = require('electron-store'),
	log = require('electron-log')

const config = new Store()

Object.assign(console, log.functions)

window.prompt = (message, defaultValue) => ipcRenderer.sendSync('prompt', message, defaultValue)

let windowType = locationType(location.href)

window.clientUtil = {
	events: new events(),
	settings: require('../exports/settings'),
	setCSetting: function (name, value) {
		let entry = Object.values(this.settings).find(entry => entry.id == name)
		if (entry.min || entry.max) value = Math.max(entry.min, Math.min(value, entry.max))
		config.set(name, value)
		entry.val = value
		if (entry.set) entry.set(value)
		let element = document.getElementById('c_slid_' + entry.id)
		if (element) element.value = value
		element = document.getElementById('c_slid_input_' + entry.id)
		if (element) element.value = value
	},
	delayIDs: {},
	delaySetCSetting: function (name, target, delay = 600) {
		if (this.delayIDs.hasOwnProperty(name)) clearTimeout(this.delayIDs[name])
		this.delayIDs[name] = setTimeout(() => {
			setCSetting(name, target.value)
			delete this.delayIDs[name]
		}, delay)
	},
	loadScripts: function () {
		if (config.get('enableUserscripts', false)) {
			class Userscript {
				constructor(initiator) {
					this.name = initiator.name || 'Unnamed userscript'
					this.version = initiator.version || 'Version unknown'
					this.author = initiator.author || 'Unknown author'
					this.description = initiator.discription || 'No description provided'
					this.locations = initiator.locations || ['all']
					this.platforms = initiator.platforms || ['all']
					this.settings = initiator.settings || null
					this.run = initiator.run || null
				}

				isLocationMatching() { return this.locations.some(location => ['all', windowType].includes(location))}
				isPlatformMatching() { return this.platforms.some(platform => ['all', process.platform].includes(platform))}
			}

			let scriptsPath = path.join(remote.app.getPath('documents'), 'idkr/scripts')
			fs.readdirSync(scriptsPath).filter(filename => path.extname(filename).toLowerCase() == '.js').forEach(filename => {
				try {
					let script = new Userscript(require(path.join(scriptsPath, filename)))
					if (!script.isLocationMatching()) console.log(`[USH] Ignored, location not matching: ${script.name}`)
					else if (!script.isPlatformMatching()) console.log(`[USH] Ignored, platform not matching: ${script.name}`)
					else {
						if (script.hasOwnProperty('settings')) Object.assign(clientUtil.settings, script.settings)
						script.run(config)
						console.log(`[USH] Loaded userscript: ${script.name || 'Unnamed userscript'} by ${script.author || 'Unknown author'}`)
					}
				} catch (err) { console.error('[USH] Failed to load userscript:', err) }
			})
		}
	},
	initUtil: function () {
		for (let [key, entry] of Object.entries(this.settings)) {
			if (entry.platforms && !entry.platforms.includes(process.platform)) return delete this.settings[key]
			if (entry.dontInit) return
			let savedVal = config.get(entry.id)
			if (savedVal != null) entry.val = savedVal
			if (entry.min || entry.max) entry.val = Math.max(entry.min, Math.min(entry.val, entry.max))
			if (entry.set) entry.set(entry.val, true)
		}
	}
}

if (windowType == 'game') window.clientUtil.events.on('game-load', () => window.clientUtil.initUtil())
else window.clientUtil.initUtil()

window.clientUtil.loadScripts()

switch (windowType) {
	case 'game':
		require('./game.js')
		break
}

function locationType(url = '') {
	if (!isValidURL(url)) return 'unknown'
	const target = new URL(url)
	if (/^(www|comp\.)?krunker\.io$/.test(target.hostname)) {
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
		} catch (e) { return false }
	}
}