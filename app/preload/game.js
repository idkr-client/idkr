let settingsWindow = null

Object.assign(window.clientUtil, {
	searchMatches: entry => {
		let query = settingsWindow.settingSearch.toLowerCase() ?? ''
		return (entry.name.toLowerCase() ?? '').includes(query) || (entry.cat.toLowerCase() ?? '').includes(query)
	},
	genCSettingsHTML: options => {
		switch (options.type) {
			case 'checkbox': return `<label class='switch'><input type='checkbox' onclick='clientUtil.setCSetting("${options.id}", this.checked)'${options.val ? ' checked' : ''}><span class='slider'></span></label>`
			case 'slider': return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.val}' onkeypress='clientUtil.delaySetCSetting("${options.id}", this)' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.val}' class='sliderM' oninput='clientUtil.setCSetting("${options.id}", this.value)'></div>`
			case 'select': return `<select onchange='clientUtil.setCSetting("${options.id}", this.value)' class='inputGrey2'>${Object.entries(options.options).map(entry => `<option value='${entry[0]}'${entry[0] == options.val ? ' selected' : ''}>${entry[1]}</option>`).join('')}</select>`
			default: return `<input type='${options.type}' name='${options.id}' id='c_slid_${options.id}' ${options.type == 'color' ? 'style="float:right;margin-top:5px;"' : `class='inputGrey2' ${options.placeholder ? `placeholder='${options.placeholder}'` : ''}`} value='${options.val}' oninput='clientUtil.setCSetting("${options.id}", this.value)'/>`
		}
	}
})

document.addEventListener('DOMContentLoaded', () => {
	let windowsObserver = new MutationObserver(() => {
		windowsObserver.disconnect()
		window.clientUtil.events.emit('game-load')
	})
	windowsObserver.observe(document.getElementById('instructions'), { childList: true })
})

window.clientUtil.events.on('game-load', () => {
	settingsWindow = window.windows[0]
	settingsWindow.getCSettings = function () {
		let tempHTML = '',
			previousCategory = null
		Object.values(clientUtil.settings).forEach(entry => {
			if (settingsWindow.settingSearch && !clientUtil.searchMatches(entry) || entry.hide) { return }
			if (previousCategory != entry.cat) {
				previousCategory = entry.cat
				tempHTML += `<div class='setHed'>${entry.cat}</div>`
			}
			tempHTML += `<div class='settName'${entry.info ? ` title='${entry.info}'` : ''}${entry.hide ? ` id='c_${entry.id}_div' style='display: none'` : ''}>${entry.name}${entry.needsRestart ? ' <span style="color: #eb5656">*</span>' : ''} ${entry.html()}</div>`
		})
		return tempHTML
	}
})