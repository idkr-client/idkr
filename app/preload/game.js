const path = require('path'),
	Store = require('electron-store')

const config = new Store()

let settingsWindow = null

document.addEventListener('DOMContentLoaded', () => {
	let windowsObserver = new MutationObserver(() => {
		windowsObserver.disconnect()
		settingsWindow = windows[0]
		settingsWindow.getCSettings = function () {
			let tempHTML = '',
				lastCategory = null
			Object.values(clientUtil.settings).forEach(entry => {
				if (settingsWindow.settingSearch && !clientUtil.searchMatches(entry) || entry.hide) return
				if (lastCategory != entry.cat) {
					lastCategory = entry.cat
					tempHTML += `<div class='setHed'>${entry.cat}</div>`
				}
				tempHTML += `<div class='settName'${entry.info ? ` title='${entry.info}'` : ''}${entry.hide ? ` id='c_${entry.id}_div' style='display: none'` : ''}>${entry.name} ${entry.html()}</div>`
			})
			return tempHTML
		}
	})
	windowsObserver.observe(document.getElementById('instructions'), { childList: true })

	clientUtil.initSettings()
})

window.clientUtil = {
	settings: Object.assign(require('../exports/settings'), window.scriptSettings),
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
	searchMatches: entry => {
		let query = settingsWindow.settingSearch.toLowerCase() || ''
		return (entry.name.toLowerCase() || '').includes(query) || (entry.cat.toLowerCase() || '').includes(query)
	},
	genCSettingsHTML: options => {
		switch (options.type) {
			case 'checkbox': return `<label class='switch'><input type='checkbox' onclick='clientUtil.setCSetting("${options.id}", this.checked)'${options.val ? ' checked' : ''}><span class='slider'></span></label>`
			case 'slider': return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.val}' onkeypress='clientUtil.delaySetCSetting("${options.id}", this)' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.val}' class='sliderM' oninput='clientUtil.setCSetting("${options.id}", this.value)'></div>`
			case 'select': return `<select onchange='clientUtil.setCSetting("${options.id}", this.value)' class='inputGrey2'>${Object.entries(options.options).map(entry => `<option value='${entry[0]}'${entry[0] == options.val ? ' selected' : ''}>${entry[1]}</option>`).join('')}</select>`
			default: return `<input type='${options.type}' name='${options.id}' id='c_slid_${options.id}' ${options.type == 'color' ? 'style="float:right;margin-top:5px;"' : `class='inputGrey2' ${options.placeholder ? `placeholder='${options.placeholder}'` : ''}`} value='${options.val}' oninput='clientUtil.setCSetting("${options.id}", this.value)'/>`
		}
	},
	initSettings: function () {
		for (let [key, entry] of Object.entries(this.settings)) {
			if (entry.platform && !entry.platform.includes(process.platform)) return delete this.settings[key]
			if (entry.dontInit) return
			let savedVal = config.get(entry.id)
			if (savedVal != null) entry.val = savedVal
			if (entry.min || entry.max) entry.val = Math.max(entry.min, Math.min(entry.val, entry.max))
			if (entry.set) entry.set(entry.val, true)
		}
	}
}