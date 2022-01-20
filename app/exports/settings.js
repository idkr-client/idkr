// @ts-nocheck
"use strict";
let UtilManager = require("../modules/util-manager");

module.exports = {
	disableFrameRateLimit: {
		name: "Disable Frame Rate Limit",
		id: "disableFrameRateLimit",
		cat: "Performance",
		type: "checkbox",
		val: true,
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	acceleratedCanvas: {
		name: "Accelerated Canvas",
		id: "acceleratedCanvas",
		cat: "Performance",
		type: "checkbox",
		val: true,
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		info: "Enables the use of the GPU to perform 2d canvas rendering instead of using software rendering."
	},
	angleBackend: {
		name: "ANGLE Graphics Backend",
		id: "angleBackend",
		cat: "Performance",
		platforms: ["win32", "linux", "darwin"],
		type: "select",
		// https://chromium.googlesource.com/angle/angle#platform-support-via-backing-renderers
		options: {
			"default": "Default",
			gl: "OpenGL (Windows, Linux, MacOS)",
			d3d11: "D3D11 (Windows-Only)",
			d3d9: "D3D9 (Windows-Only)",
			d3d11on12: "D3D11on12 (Windows, Linux)",
			vulkan: "Vulkan (Windows, Linux)",
			metal: "Metal (MacOS-Only)"
		},
		val: "default",
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		info: "Choose the graphics backend for ANGLE. D3D11 is used on most Windows computers by default. Using the OpenGL driver as the graphics backend may result in higher performance, particularly on NVIDIA GPUs. It can increase battery and memory usage of video playback."
	},
	colorProfile: {
		name: "Color Profile",
		id: "colorProfile",
		cat: "Chromium",
		type: "select",
		options: {
			"default": "Default",
			srgb: "sRGB",
			"display-p3-d65": "Display P3 D65",
			"color-spin-gamma24": "Color spin with gamma 2.4"
		},
		val: "default",
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		info: "Forces color profile."
	},
	inProcessGPU: {
		name: "In-Process GPU",
		id: "inProcessGPU",
		cat: "Chromium",
		type: "checkbox",
		val: false,
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		info: "Run the GPU process as a thread in the browser process. Using this may help with window capture."
	},
	chromiumFlags: {
		name: "Chromium Flags",
		id: "chromiumFlags",
		cat: "Chromium",
		type: "text",
		val: "",
		placeholder: "--flag=value",
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		info: "Additional Chromium flags."
	},
	showExitButton: {
		name: "Show Exit Button",
		id: "showExitButton",
		cat: "Interface",
		type: "checkbox",
		val: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		set: val => {
			let btn = document.getElementById("clientExit");
			if (btn) btn.style.display = val ? "flex" : "none";
		}
	},
	showAltManagerButton: {
		name: "Show Alt-Manager Button",
		id: "showAltManagerButton",
		cat: "Interface",
		type: "checkbox",
		val: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		},
		set: val => {
			let btn = document.getElementById("accManagerBtn");
			if (btn) btn.style.display = val ? "block" : "none";
		}
	},
	enableMenuTimer: {
		name: "Always show Menu-Timer",
		id: "enableMenuTimer",
		cat: "Interface",
		type: "checkbox",
		val: true,
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	discordRPC: {
		name: "Discord Rich Presence",
		id: "discordRPC",
		cat: "Discord",
		type: "checkbox",
		val: true,
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	autoUpdate: {
		name: "Auto Update Behavior",
		id: "autoUpdate",
		cat: "Maintenance",
		type: "select",
		options: {
			download: "Download",
			check: "Check only",
			skip: "Skip"
		},
		val: "download",
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	enableUserscripts: {
		name: "Enable Userscripts",
		id: "enableUserscripts",
		cat: "Maintenance",
		type: "checkbox",
		val: false,
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	userscriptsPath: {
		name: "Userscripts Path",
		id: "userscriptsPath",
		cat: "Maintenance",
		type: "text",
		val: "",
		placeholder: "Userscripts Folder Path",
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	resourceSwapperMode: {
		name: "Resource Swapper Mode",
		id: "resourceSwapperMode",
		cat: "Maintenance",
		type: "select",
		options: {
			normal: "Normal",
			advanced: "Advanced",
			disabled: "Disabled"
		},
		val: "normal",
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	},
	resourceSwapperPath: {
		name: "Resource Swapper Path",
		id: "resourceSwapperPath",
		cat: "Maintenance",
		type: "text",
		val: "",
		placeholder: "Resource Swapper Folder Path",
		needsRestart: true,
		html(){
			return UtilManager.instance.clientUtils.genCSettingsHTML(this);
		}
	}
};
