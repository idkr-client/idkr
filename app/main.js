"use strict";

require("v8-compile-cache");

let path = require("path");
let { app, protocol } = require("electron");
let Store = require("electron-store");
let log = require("electron-log");
let yargs = require("yargs");

let PathUtils = require("./utils/path-utils");
let UrlUtils = require("./utils/url-utils");
let cliSwitches = require("./modules/cli-switches");

let BrowserLoader = require("./loaders/browser-loader");
let IpcLoader = require("./loaders/ipc-loader");

Object.assign(console, log.functions);

const { argv } = yargs;
const config = new Store();

console.log(`idkr@${app.getVersion()} { Electron: ${process.versions.electron}, Node: ${process.versions.node}, Chromium: ${process.versions.chrome} }`);

/** @type {any} */
const DEBUG = argv.debug;

const AUTO_UPDATE = argv.update || config.get("autoUpdate", "download");

if (!app.requestSingleInstanceLock()) app.quit();

cliSwitches(app, config);

/** @type {string} */
let userscriptsDirConfig = (config.get("userscriptsPath", ""));

const userscriptsDir = PathUtils.isValidPath(userscriptsDirConfig) ? userscriptsDirConfig : path.join(app.getPath("documents"), "idkr/scripts");

if (process.platform === "win32"){
	app.setUserTasks([{
		program: process.execPath,
		arguments: "--new-window=https://krunker.io/",
		title: "New game window",
		description: "Opens a new game window",
		iconPath: process.execPath,
		iconIndex: 0
	}, {
		program: process.execPath,
		arguments: "--new-window=https://krunker.io/social.html",
		title: "New social window",
		description: "Opens a new social window",
		iconPath: process.execPath,
		iconIndex: 0
	}]);
}

let init = async function(){
	BrowserLoader.load(DEBUG, config);
	IpcLoader.load();
	IpcLoader.initRpc(config);

	await PathUtils.ensureDirs(BrowserLoader.swapDir, userscriptsDir);

	// Workaround for Electron 8.x
	protocol.registerSchemesAsPrivileged([{
		scheme: "idkr-swap",
		privileges: {
			secure: true,
			corsEnabled: true
		}
	}]);

	app.once("ready", async() => {
		protocol.registerFileProtocol("idkr-swap", (request, callback) => callback(decodeURI(request.url.replace(/^idkr-swap:/, ""))));
		app.on("second-instance", (e, _argv) => {
			let instanceArgv = yargs.parse(_argv);
			console.log("Second instance: " + _argv);
			if (!["unknown", "external"].includes(UrlUtils.locationType(String(instanceArgv["new-window"])))){
				BrowserLoader.initWindow(instanceArgv["new-window"], config);
			}
		});

		BrowserLoader.initSplashWindow(AUTO_UPDATE, config);
	});
};

init();
