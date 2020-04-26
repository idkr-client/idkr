const fs = require('fs'),
	path = require('path'),
	{ remote } = require('electron'),
	Store = require('electron-store')

const config = new Store()

let settings = {
	disableFrameRateLimit: {
		name: 'Disable Frame Rate Limit',
		id: 'disableFrameRateLimit',
		cat: 'Performance',
		type: 'checkbox',
		val: true,
		html: function () { return clientUtil.genCSettingsHTML(this) }
	},
	angleBackend: {
		name: 'ANGLE Graphics Backend',
		id: 'angleBackend',
		cat: 'Chromium',
		platform: ['win32'],
		type: 'select',
		options: {
			default: 'Default',
			gl: 'OpenGL',
			d3d11: 'D3D11',
			d3d9: 'D3D9',
			d3d11on12: 'D3D11on12'
		},
		val: 'default',
		html: function () { return clientUtil.genCSettingsHTML(this) }
	},
	colorProfile: {
		name: 'Color Profile',
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
		html: function () { return clientUtil.genCSettingsHTML(this) },
		info: 'Force color profile.'
	},
	autoUpdate: {
		name: 'Auto Update Behavior',
		id: 'autoUpdate',
		cat: 'Maintenance',
		type: 'select',
		options: {
			download: 'Download',
			check: 'Check only',
			skip: 'Skip'
		},
		val: 'download',
		html: function () { return clientUtil.genCSettingsHTML(this) }
	},
	enableResourceSwapper: {
		name: 'Enable Resource Swapper',
		id: 'enableResourceSwapper',
		cat: 'Maintenance',
		type: 'checkbox',
		val: false,
		html: function () { return clientUtil.genCSettingsHTML(this) }
	},
	enableUserscripts: {
		name: 'Enable Userscripts',
		id: 'enableUserscripts',
		cat: 'Maintenance',
		type: 'checkbox',
		val: false,
		html: function () { return clientUtil.genCSettingsHTML(this) }
	}
}

if (config.get('enableUserscripts', false)) {
	let scriptsPath = path.join(remote.app.getPath('documents'), 'idkr/scripts')
	fs.readdirSync(scriptsPath).filter(filename => path.extname(filename).toLowerCase() == '.js').forEach(filename => {
		try {
			let script = require(path.join(scriptsPath, filename))
			Object.assign(settings, script.settings)
			console.log(`Loaded userscript (settings): ${script.name || 'Unnamed userscript'} by ${script.author || 'Unknown author'}`)
		} catch (err) { console.error('Failed to load userscript (settings):', err) }
	})
}

module.exports = settings
