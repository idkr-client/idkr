let AccountManager = require('../modules/accountManager');
let settingsWindow = null;

Object.assign(window.clientUtil, {
	searchMatches: entry => {
		let query = settingsWindow.settingSearch.toLowerCase() || '';
		return (entry.name.toLowerCase() || '').includes(query) || (entry.cat.toLowerCase() || '').includes(query);
	},
	genCSettingsHTML: options => {
		switch (options.type) {
			case 'checkbox': return `<label class='switch'><input type='checkbox' onclick='clientUtil.setCSetting("${options.id}", this.checked)'${options.val ? ' checked' : ''}><span class='slider'></span></label>`;
			case 'slider': return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.val}' onkeypress='clientUtil.delaySetCSetting("${options.id}", this)' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.val}' class='sliderM' oninput='clientUtil.setCSetting("${options.id}", this.value)'></div>`;
			case 'select': return `<select onchange='clientUtil.setCSetting("${options.id}", this.value)' class='inputGrey2'>${Object.entries(options.options).map(entry => `<option value='${entry[0]}'${entry[0] == options.val ? ' selected' : ''}>${entry[1]}</option>`).join('')}</select>`;
			default: return `<input type='${options.type}' name='${options.id}' id='c_slid_${options.id}' ${options.type == 'color' ? 'style="float:right;margin-top:5px;"' : `class='inputGrey2' ${options.placeholder ? `placeholder='${options.placeholder}'` : ''}`} value='${options.val.replace(/'/g, '')}' oninput='clientUtil.setCSetting("${options.id}", this.value)'/>`;
		}
	}
});

// Workaround to avoid getting client popup
window.OffCliV = true;

let accoutManager = new AccountManager(window, document, localStorage);

document.addEventListener('DOMContentLoaded', () => {
	let windowsObserver = new MutationObserver(() => {
		windowsObserver.disconnect();
		window.clientUtil.events.emit('game-load');
	});
	windowsObserver.observe(document.getElementById('instructions'), { childList: true });

	accoutManager.injectStyles();

	let clientExit = document.getElementById('clientExit');
	if (clientExit) {
		clientExit.style = 'display: flex;';
	}

	// const gameCSS = Object.assign(document.createElement('link'), {
	// 	rel: 'stylesheet', href: 'idkr-swap:' + path.join(__dirname, '../css/game.css')
	// })
	// document.head.appendChild(gameCSS)
});

window.clientUtil.events.on('game-load', () => {
	window.closeClient = close;
	settingsWindow = window.windows[0];

	// Patch getSettings to fix custom tab bug
	let origGetSettings = settingsWindow.getSettings;
	settingsWindow.getSettings = (...args) => origGetSettings.call(settingsWindow, ...args).replace(/^<\/div>/, '');

	let clientTabIndex = settingsWindow.tabs.push({ name: 'idkr', categories: [] });
	settingsWindow.getCSettings = () => {
		if (clientTabIndex != settingsWindow.tabIndex + 1 && !settingsWindow.settingSearch) {
			return '';
		}
		let tempHTML = '';
		let previousCategory = null;
		Object.values(window.clientUtil.settings).forEach(entry => {
			if (settingsWindow.settingSearch && !window.clientUtil.searchMatches(entry) || entry.hide) {
				return;
			}
			if (previousCategory != entry.cat) {
				if (previousCategory) {
					tempHTML += '</div>';
				}
				previousCategory = entry.cat;
				tempHTML += `<div class='setHed' id='setHed_${btoa(entry.cat)}' onclick='window.windows[0].collapseFolder(this)'><span class='material-icons plusOrMinus'>keyboard_arrow_down</span> ${entry.cat}</div><div id='setBod_${btoa(entry.cat)}'>`;
			}
			tempHTML += `<div class='settName'${entry.needsRestart ? ' title="Requires Restart"' : ''}${entry.hide ? ` id='c_${entry.id}_div' style='display: none'` : ''}>${entry.name}${entry.needsRestart ? ' <span style="color: #eb5656">*</span>' : ''} ${entry.html()}</div>`;
		});
		return tempHTML ? tempHTML + '</div>' : '';
	};
});
