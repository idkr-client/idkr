"use strict";

let path = require("path");

require("v8-compile-cache");

let Events = require("events");
let { ipcRenderer } = require("electron");
let Store = require("electron-store");
let log = require("electron-log");

let UrlUtils = require("../utils/url-utils");
let UserscriptInitiator = require("../modules/userscript-manager/userscript-initiator");
let UtilManager = require("../modules/util-manager");

const config = new Store();

Object.assign(console, log.functions);
localStorage.setItem("logs", "true");

window.prompt = (message, defaultValue) => ipcRenderer.sendSync("prompt", message, defaultValue);

let windowType = UrlUtils.locationType(location.href);

UtilManager.instance.clientUtils = {
	events: new Events(),
	settings: require("../exports/settings"),
	setCSetting(name, value){
		let entry = Object.values(this.settings).find(_entry => _entry.id === name);
		let newValue = entry.min && entry.max ? Math.max(entry.min, Math.min(value, entry.max)) : value;

		config.set(name, newValue);
		entry.val = newValue;
		if (entry.set) entry.set(newValue);

		/** @type {HTMLInputElement} */
		let element = (document.getElementById("c_slid_" + entry.id));
		if (element) element.value = newValue;

		/** @type {HTMLInputElement} */
		element = (document.getElementById("c_slid_input_" + entry.id));
		if (element) element.value = newValue;
	},
	delayIDs: {},
	delaySetCSetting(name, target, delay = 600){
		if (this.delayIDs[name]) clearTimeout(this.delayIDs[name]);
		this.delayIDs[name] = setTimeout(() => {
			this.setCSetting(name, target.value);
			delete this.delayIDs[name];
		}, delay);
	},
	initUtil(){
		for (let [key, entry] of Object.entries(this.settings)) {
			if (!("name" in entry && "id" in entry && "cat" in entry && "type" in entry && "val" in entry && "html" in entry)){
				console.log(`Ignored a setting entry ${entry.id ? `"${entry.id}"` : "with no ID"}, missing a required property`);
				delete this.settings[key];
				continue;
			}
			if (entry.platforms && !entry.platforms.includes(process.platform)){
				delete this.settings[key];
				continue;
			}
			if (entry.dontInit) continue;

			let savedVal = config.get(entry.id);

			if (savedVal !== null) entry.val = savedVal;
			if (entry.min && entry.max) entry.val = Math.max(entry.min, Math.min(entry.val, entry.max));
			if (entry.set) entry.set(entry.val, true);
		}
	}
};

switch (windowType){
	case "game": {
		// @ts-ignore
		process.dlopen = () => {
			throw new Error("Load native module is not safe");
		};
		// let worker = new Worker("./game.js");
		// worker.addEventListener("error", console.log);
		require("./game.js");
		break;
	}
	default: () => {};
}

let rpcIntervalId;

function setFocusEvent(){
	window.addEventListener("focus", () => {
		let rpcActivity = {
			largeImageKey: "idkr-logo",
			largeImageText: "idkr client"
		};

		function sendRPCGamePresence(){
			try {
				let gameActivity = /** @type {object} */ (window).getGameActivity();

				Object.assign(rpcActivity, {
					state: gameActivity.map,
					details: gameActivity.mode
				});

				if (gameActivity.time) rpcActivity.endTimestamp = Date.now() + gameActivity.time * 1000;
				ipcRenderer.invoke("rpc-activity", rpcActivity);
			}
			catch (error){
				ipcRenderer.invoke("rpc-activity", Object.assign(rpcActivity, {
					state: "Playing",
					startTimestamp: Math.floor(Date.now() / 1000)
				}));
			}
		}

		let isIntervalSet = false;
		switch (windowType){
			case "game": {
				sendRPCGamePresence();
				if (rpcIntervalId) clearInterval(rpcIntervalId);
				rpcIntervalId = setInterval(sendRPCGamePresence, 5e3);
				isIntervalSet = true;
				break;
			}
			case "docs":
				rpcActivity.state = "Reading Docs";
				break;
			case "social":
				rpcActivity.state = "In the Hub";
				break;
			case "viewer":
				rpcActivity.state = "In the Texture Viewer";
				break;
			case "editor":
				rpcActivity.state = "In the Editor";
				break;
			default:
				rpcActivity.state = "Unknown";
				break;
		}

		if (!isIntervalSet){
			ipcRenderer.invoke("rpc-activity", Object.assign(rpcActivity, {
				startTimestamp: Math.floor(performance.timeOrigin / 1000)
			}));
		}
	}, { once: true });
}

ipcRenderer.on("rpc-stop", () => {
	setFocusEvent();
	if (rpcIntervalId) clearInterval(rpcIntervalId);
});

ipcRenderer.invoke("get-app-info")
	.then(info => {
		// let oldConsole = {};
		// Object.assign(oldConsole, console);
		const initalize = async() => {
			// Object.assign(console, oldConsole);
			UtilManager.instance.clientUtils.initUtil();
			if (config.get("enableUserscripts", true)){
				const initiator = new UserscriptInitiator(
					config,
					String(config.get("userscriptsPath", null) ?? path.join(info.documentsDir, "idkr", "scripts")),
					UtilManager.instance.clientUtils
				);

				await initiator.loadScripts(windowType);
				initiator.executeScripts();
			}
		};

		(windowType === "game")
			? UtilManager.instance.clientUtils.events.on("game-load", () => initalize())
			: initalize();
	});

setFocusEvent();

window.addEventListener("unload", () => {
	ipcRenderer.invoke("rpc-activity", {
		state: "Idle",
		startTimestamp: Math.floor(Date.now() / 1000),
		largeImageKey: "idkr-logo",
		largeImageText: "idkr client"
	});
});
