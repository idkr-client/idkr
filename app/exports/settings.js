module.exports = {
	// menuTimer: {
	// 	name: 'Show Menu Timer',
	// 	id: 'menuTimer',
	// 	cat: 'Interface',
	// 	type: 'checkbox',
	// 	val: true,
	// 	html: function () { return window.clientUtil.genCSettingsHTML(this) },
	// 	set: value => {
	// 		let menuTimer = document.getElementById('idkrMenuTimer')
	// 		if (menuTimer) { menuTimer.style.display = value ? 'flex' : 'none' }
	// 	}
	// },
	disableFrameRateLimit: {
		name: 'Disable Frame Rate Limit',
		id: 'disableFrameRateLimit',
		cat: 'Performance',
		type: 'checkbox',
		val: true,
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	},
	acceleratedCanvas: {
		name: 'Accelerated Canvas',
		id: 'acceleratedCanvas',
		cat: 'Chromium',
		type: 'checkbox',
		val: true,
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) },
		info: 'Enables the use of the GPU to perform 2d canvas rendering instead of using software rendering.'
	},
	angleBackend: {
		name: 'ANGLE Graphics Backend',
		id: 'angleBackend',
		cat: 'Chromium',
		platforms: ['win32'],
		type: 'select',
		options: {
			default: 'Default',
			gl: 'OpenGL',
			d3d11: 'D3D11',
			d3d9: 'D3D9',
			d3d11on12: 'D3D11on12'
		},
		val: 'default',
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
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
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) },
		info: 'Forces color profile.'
	},
	chromiumFlags: {
		name: 'Chromium Flags',
		id: 'chromiumFlags',
		cat: 'Chromium',
		type: 'text',
		val: '',
		placeholder: '--flag=value',
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) },
		info: 'Additional Chromium flags.'
	},
	discordRPC: {
		name: 'Discord RPC',
		id: 'discordRPC',
		cat: 'Discord',
		type: 'checkbox',
		val: true,
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	},
	// enablePointerLockOptions: {
	// 	name: 'Pointer Raw Input',
	// 	id: 'enablePointerLockOptions',
	// 	cat: 'Chromium',
	// 	type: 'checkbox',
	// 	val: false,
	// 	needsRestart: true,
	// 	html: function () { return window.clientUtil.genCSettingsHTML(this) }
	// },
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
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	},
	resourceSwapperMode: {
		name: 'Resource Swapper Mode',
		id: 'resourceSwapperMode',
		cat: 'Maintenance',
		type: 'select',
		options: {
			normal: 'Normal',
			advanced: 'Advanced',
			disabled: 'Disabled'
		},
		val: 'normal',
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	},
	resourceSwapperPath: {
		name: 'Resource Swapper Path',
		id: 'resourceSwapperPath',
		cat: 'Maintenance',
		type: 'text',
		val: '',
		placeholder: 'Resource Swapper Folder Path',
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	},
	enableUserscripts: {
		name: 'Enable Userscripts',
		id: 'enableUserscripts',
		cat: 'Maintenance',
		type: 'checkbox',
		val: false,
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	},
	userscriptsPath: {
		name: 'Userscripts Path',
		id: 'userscriptsPath',
		cat: 'Maintenance',
		type: 'text',
		val: '',
		placeholder: 'Userscripts Folder Path',
		needsRestart: true,
		html: function () { return window.clientUtil.genCSettingsHTML(this) }
	}
}
