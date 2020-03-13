const path = require('path')
const Store = require('electron-store')

const config = new Store()

let settingsWindow = null

document.addEventListener('DOMContentLoaded', () => {
	// Temp
	let windowsObserver = new MutationObserver(() => {
		windowsObserver.disconnect()
		settingsWindow = windows[0]
		settingsWindow.getCSettings = function () {
			let tempHTML = '',
				categories = []
			for (let [key, entry] of Object.entries(clientUtil.settings)) {
				settingsWindow.settingSearch && (!searchMatches(entry) || entry.hide) || (!categories.includes(entry.cat) && (categories.push(entry.cat),
					tempHTML += `<div class='setHed'>${entry.cat}</div>`),
					tempHTML += '<div class=\'settName\' title=\'' + (entry.info || '') + '\'' + (entry.hide ? 'id=\'' + key + '_div\' style=\'display:' + (entry.hide ? 'none' : 'block') + '\'' : '') + '>' + entry.name + ' ' + entry.html() + '</div>')
			}
			return tempHTML
		}
	})
	windowsObserver.observe(document.getElementById('instructions'), { childList: true })

	let gameCSS = Object.assign(document.createElement('link'), {
		rel: 'stylesheet',
		type: 'text/css',
		href: path.join(__dirname, 'css/game.css')
	})
	document.head.appendChild(gameCSS)
})

function searchMatches(entry) {
	let query = settingsWindow.settingSearch.toLowerCase() || ''
	return (entry.name.toLowerCase() || '').includes(query) || (entry.cat.toLowerCase() || '').includes(query)
}

// Temp
function genCSettingsHTML(options) {
	switch (options.type) {
		case 'checkbox': return `<label class='switch'><input type='checkbox' onclick='clientUtil.setCSetting("${options.id}", this.checked)'${options.val ? ' checked' : ''}><span class='slider'></span></label>`
		case 'slider': return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.val}' onkeypress='clientUtil.delaySetCSetting("${options.id}", this)' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.val}' class='sliderM' oninput='clientUtil.setCSetting("${options.id}", this.value)'></div>`
		case 'select':
			let selectHTML = `<select onchange='clientUtil.setCSetting("${options.id}", this.value)' class='inputGrey2'>`
			for (let [optionKey, optionName] of Object.entries(options.options))
				selectHTML += '<option value=\'' + optionKey + '\' ' + (optionKey == options.val ? 'selected' : '') + '>' + optionName + '</option>'
			return selectHTML += '</select>'
		default: return `<input type='${options.type}' name='${options.id}' id='c_slid_${options.id}' ${options.type == 'color' ? 'style="float:right;margin-top:5px;"' : `class='inputGrey2' ${options.placeholder ? `placeholder='${options.placeholder}'` : ''}`} value='${options.val}' oninput='clientUtil.setCSetting("${options.id}", this.value)'/>`
	}
}

window.clientUtil = {
	settings: {
		disableFrameRateLimit: {
			name: "Disable Frame Rate Limit",
			id: 'disableFrameRateLimit',
			cat: 'Performance',
			type: 'checkbox',
			val: true,
			html: function () { return genCSettingsHTML(this) }
		},
		colorProfile: {
			name: "Color Profile",
			id: 'colorProfile',
			cat: 'Chromium',
			type: 'select',
			options: {
				default: 'Default',
				srgb: 'sRGB',
				'display-p3-d65': 'Display P3 D65',
				'color-spin-gamma24': 'Color spin with gamma 2.4'
			},
			val: 'default',
			html: function () { return genCSettingsHTML(this) },
			info: 'Force color profile.'
		}
	},
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
	initSettings: function () {
		Object.values(this.settings).forEach(entry => {
			if (entry.dontInit) return
			let savedVal = config.get(entry.id)
			if (savedVal != null) entry.val = savedVal
			if (entry.min || entry.max) entry.val = Math.max(entry.min, Math.min(entry.val, entry.max))
			if (entry.set) entry.set(entry.val, true)
		})
		console.log(this)
	}
}

clientUtil.initSettings()