require('v8-compile-cache');
const events = require('events');
// const fs = require('fs');
// const path = require('path');
const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const log = require('electron-log');

const config = new Store();

Object.assign(console, log.functions);

window.prompt = (message, defaultValue) => ipcRenderer.sendSync('prompt', message, defaultValue);

// const documentsPath = ipcRenderer.sendSync('get-path', 'documents');

let windowType = locationType(location.href);

window._clientUtil = {
	events: new events(),
	settings: require('../exports/settings'),
	setCSetting: function (name, value) {
		let entry = Object.values(this.settings).find(entry => entry.id == name);
		if (entry.min && entry.max) {
			value = Math.max(entry.min, Math.min(value, entry.max));
		}
		config.set(name, value);
		entry.val = value;
		if (entry.set) {
			entry.set(value);
		}
		let element = document.getElementById('c_slid_' + entry.id);
		if (element) {
			element.value = value;
		}
		element = document.getElementById('c_slid_input_' + entry.id);
		if (element) {
			element.value = value;
		}
	},
	delayIDs: {},
	delaySetCSetting: function (name, target, delay = 600) {
		if (this.delayIDs[name]) {
			clearTimeout(this.delayIDs[name]);
		}
		this.delayIDs[name] = setTimeout(() => {
			this.setCSetting(name, target.value);
			delete this.delayIDs[name];
		}, delay);
	},
	loadScripts: function () {
		// class Userscript {
		// 	constructor(initiator) {
		// 		this.name = initiator.name || 'Unnamed userscript';
		// 		this.version = initiator.version || 'Version unknown';
		// 		this.author = initiator.author || 'Unknown author';
		// 		this.description = initiator.discription || 'No description provided';
		// 		this.locations = initiator.locations || ['all'];
		// 		this.platforms = initiator.platforms || ['all'];
		// 		this.settings = initiator.settings || null;
		// 		this.run = initiator.run || null;
		// 	}

		// 	isLocationMatching() {
		// 		return this.locations.some(location => ['all', windowType].includes(location));
		// 	}
		// 	isPlatformMatching() {
		// 		return this.platforms.some(platform => ['all', process.platform].includes(platform));
		// 	}
		// }

		// let userscriptsDirConfig = config.get('userscriptsPath', '');
		// let scriptsPath = isValidPath(userscriptsDirConfig) ? userscriptsDirConfig : path.join(documentsPath, 'idkr/scripts');
		// try {
		// 	fs.readdirSync(scriptsPath).filter(filename => path.extname(filename).toLowerCase() == '.js').forEach(filename => {
		// 		try {
		// 			let script = new Userscript(require(path.join(scriptsPath, filename)));
		// 			if (!script.isLocationMatching()) {
		// 				console.log(`[USH] Ignored, location not matching: ${script.name}`);
		// 			} else if (!script.isPlatformMatching()) {
		// 				console.log(`[USH] Ignored, platform not matching: ${script.name}`);
		// 			} else {
		// 				if (script.settings) {
		// 					Object.assign(window._clientUtil.settings, script.settings);
		// 				}
		// 				if (script.run) {
		// 					script.run(config);
		// 				}
		// 				console.log(`[USH] Loaded userscript: ${script.name} by ${script.author}`);
		// 			}
		// 		} catch (err) {
		// 			console.error('[USH] Failed to load userscript:', err);
		// 		}
		// 	});
		// } catch (err) {
		// 	console.error('[USH] Failed to load scripts:', err);
		// }
	},
	initUtil: function () {
		for (let [key, entry] of Object.entries(this.settings)) {
			if (!('name' in entry && 'id' in entry && 'cat' in entry && 'type' in entry && 'val' in entry && 'html' in entry)) {
				console.log(`Ignored a setting entry ${entry.id ? `"${entry.id}"` : 'with no ID'}, missing a required property`);
				delete this.settings[key];
				continue;
			}
			if (entry.platforms && !entry.platforms.includes(process.platform)) {
				delete this.settings[key];
				continue;
			}
			if (entry.dontInit) {
				continue;
			}
			let savedVal = config.get(entry.id);
			if (savedVal != null) {
				entry.val = savedVal;
			}
			if (entry.min && entry.max) {
				entry.val = Math.max(entry.min, Math.min(entry.val, entry.max));
			}
			if (entry.set) {
				entry.set(entry.val, true);
			}
		}
	}
};

if (windowType == 'game') {
	window._clientUtil.events.on('game-load', () => window._clientUtil.initUtil());
} else {
	window._clientUtil.initUtil();
}

// if (config.get('enableUserscripts', false)) {
// 	window._clientUtil.loadScripts();
// }

switch (windowType) {
	case 'game':
		require('./game.js');
		break;
}

// function isValidPath(pathstr = '') {
// 	return Boolean(path.parse(pathstr).root);
// }

function locationType(url = '') {
	if (!isValidURL(url)) {
		return 'unknown';
	}
	const target = new URL(url);
	if (/^(www|comp\.)?krunker\.io$/.test(target.hostname)) {
		if (/^\/docs\/.+\.txt$/.test(target.pathname)) {
			return 'docs';
		}
		switch (target.pathname) {
			case '/': return 'game';
			case '/social.html': return 'social';
			case '/viewer.html': return 'viewer';
			case '/editor.html': return 'editor';
			default: return 'unknown';
		}
	} else {
		return 'external';
	}

	function isValidURL(url = '') {
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	}
}

let rpcIntervalId;

function setFocusEvent() {
	window.addEventListener('focus', () => {
		function sendRPCGamePresence() {
			try {
				let gameActivity = window.getGameActivity();

				Object.assign(rpcActivity, {
					state: gameActivity.map,
					details: gameActivity.mode
				});

				if (gameActivity.time) {
					rpcActivity.endTimestamp = Date.now() + gameActivity.time * 1e3;
				}
				ipcRenderer.invoke('rpc-activity', rpcActivity);
			} catch (error) {
				// console.log(error)
				ipcRenderer.invoke('rpc-activity', Object.assign(rpcActivity, {
					state: 'Playing',
					startTimestamp: Math.floor(Date.now() / 1e3)
				}));
			}
		}

		let rpcActivity = {
			largeImageKey: 'idkr-logo',
			largeImageText: 'idkr client'
		};
		let isIntervalSet = false;
		switch (windowType) {
			case 'game':
				sendRPCGamePresence();
				if (rpcIntervalId) {
					clearInterval(rpcIntervalId);
				}
				rpcIntervalId = setInterval(sendRPCGamePresence, 5e3);
				isIntervalSet = true;
				break;
			case 'docs':
				rpcActivity.state = 'Reading Docs';
				break;
			case 'social':
				rpcActivity.state = 'In the Hub';
				break;
			case 'viewer':
				rpcActivity.state = 'In the Texture Viewer';
				break;
			case 'editor':
				rpcActivity.state = 'In the Editor';
				break;
			default:
				rpcActivity.state = 'Unknown';
				break;
		}

		if (!isIntervalSet) {
			ipcRenderer.invoke('rpc-activity', Object.assign(rpcActivity, {
				startTimestamp: Math.floor(performance.timeOrigin / 1e3)
			}));
		}
	}, { once: true });
}

ipcRenderer.on('rpc-stop', () => {
	setFocusEvent();
	if (rpcIntervalId) {
		clearInterval(rpcIntervalId);
	}
});

setFocusEvent();

window.addEventListener('unload', () => {
	ipcRenderer.invoke('rpc-activity', {
		state: 'Idle',
		startTimestamp: Math.floor(Date.now() / 1e3),
		largeImageKey: 'idkr-logo',
		largeImageText: 'idkr client'
	});
});
