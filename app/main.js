"use strict";

require("v8-compile-cache");
let path = require("path");
let DiscordRPC = require("discord-rpc");
let { BrowserWindow, app, clipboard, dialog, ipcMain, protocol, shell } = require("electron");
let Store = require("electron-store");
let log = require("electron-log");
let shortcuts = require("electron-localshortcut");
let yargs = require("yargs");

let PathUtils = require("./utils/path-utils");
let UrlUtils = require("./utils/url-utils");
let Swapper = require("./modules/swapper");

Object.assign(console, log.functions);

const { argv } = yargs;
const config = new Store();

console.log(`idkr@${app.getVersion()} { Electron: ${process.versions.electron}, Node: ${process.versions.node}, Chromium: ${process.versions.chrome} }`);

const DEBUG = argv.debug;
const AUTO_UPDATE = argv.update || config.get("autoUpdate", "download");

if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

if (!config.get("acceleratedCanvas", true)) {
	app.commandLine.appendSwitch("disable-accelerated-2d-canvas", "true");
}
if (config.get("disableFrameRateLimit", false)) {
	app.commandLine.appendSwitch("disable-frame-rate-limit");
	app.commandLine.appendSwitch("disable-gpu-vsync");
}
if (config.get("inProcessGPU", false)) {
	app.commandLine.appendSwitch("in-process-gpu");
}
let angleBackend = config.get("angleBackend", "default");
let colorProfile = config.get("colorProfile", "default");
if (angleBackend !== "default") {
	app.commandLine.appendSwitch("use-angle", /** @type {string} */ (angleBackend));
}
if (colorProfile !== "default") {
	app.commandLine.appendSwitch("force-color-profile", /** @type {string} */ (colorProfile));
}

yargs.parse(config.get("chromiumFlags", ""), (err, argv) => Object.entries(argv).slice(1, -1).forEach(entry => app.commandLine.appendSwitch(entry[0], entry[1])));

ipcMain.handle("get-app-info", () => ({
	name: app.name,
	version: app.getVersion(),
	documentsDir: app.getPath("documents")
}));

ipcMain.on("get-path", (event, name) => (event.returnValue = app.getPath(name)));

ipcMain.on("prompt", (event, message, defaultValue) => {
	let promptWin = initPromptWindow(message, defaultValue);
	let returnValue = null;

	ipcMain.on("prompt-return", (_, value) => (returnValue = value));

	promptWin.on("closed", () => {
		event.returnValue = returnValue;
	});
});

ipcMain.handle("set-bounds", (event, bounds) => {
	BrowserWindow.fromWebContents(event.sender).setBounds(bounds);
});

const isRPCEnabled = config.get("discordRPC", true);

let lastSender = null;
ipcMain.handle("rpc-activity", (event, activity) => {
	if (isRPCEnabled) {
		if (lastSender !== event.sender) {
			if (lastSender) {
				lastSender.send("rpc-stop");
			}
			lastSender = event.sender;
			lastSender.on("destroyed", () => (lastSender = null));
		}
		rpc.setActivity(activity).catch(console.error);
	}
});

/** @type {string} */
let swapDirConfig = (config.get("resourceSwapperPath", ""));
/** @type {string} */
let userscriptsDirConfig = (config.get("userscriptsPath", ""));

const swapDir = PathUtils.isValidPath(swapDirConfig) ? swapDirConfig : path.join(app.getPath("documents"), "idkr/swap");
const userscriptsDir = PathUtils.isValidPath(userscriptsDirConfig) ? userscriptsDirConfig : path.join(app.getPath("documents"), "idkr/scripts");

if (process.platform === "win32") {
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

function initWindow(url, webContents) {
	let win = new BrowserWindow({
		width: 1600,
		height: 900,
		show: false,
		// @ts-ignore
		webContents,
		webPreferences: {
			preload: path.join(__dirname, "preload/global.js"),
			contextIsolation: false
		}
	});
	// let contents = win.webContents
	// TODO: Fix co-dependency !!!
	setupWindow(win, true);

	if (!webContents) {
		win.loadURL(url);
	}

	return win;
}

function setupWindow(win, isWeb) {
	let contents = win.webContents;

	if (DEBUG) {
		contents.openDevTools();
	}
	win.removeMenu();
	win.once("ready-to-show", () => {
		let windowType = UrlUtils.locationType(contents.getURL());

		win.on("maximize", () => config.set(`windowState.${windowType}.maximized`, true));
		win.on("unmaximize", () => config.set(`windowState.${windowType}.maximized`, false));
		win.on("enter-full-screen", () => config.set(`windowState.${windowType}.fullScreen`, true));
		win.on("leave-full-screen", () => config.set(`windowState.${windowType}.fullScreen`, false));

		let windowStateConfig = config.get("windowState." + windowType, {});
		if (windowStateConfig.maximized) {
			win.maximize();
		}
		if (windowStateConfig.fullScreen) {
			win.setFullScreen(true);
		}

		win.show();
	});

	let isMac = process.platform === "darwin";
	shortcuts.register(win, isMac ? "Command+Option+I" : "Control+Shift+I", () => contents.toggleDevTools());
	shortcuts.register(win, isMac ? "Command+Left" : "Alt+Left", () => contents.canGoBack() && contents.goBack());
	shortcuts.register(win, isMac ? "Command+Right" : "Alt+Right", () => contents.canGoForward() && contents.goForward());
	shortcuts.register(win, "CommandOrControl+Shift+Delete", () => {
		contents.session.clearCache().then(() => {
			app.relaunch();
			app.quit();
		});
	});
	shortcuts.register(win, "Escape", () => contents.executeJavaScript("document.exitPointerLock()", true));
	shortcuts.register(win, "Control+F1", () => {
		config.clear();
		app.relaunch();
		app.quit();
	});
	shortcuts.register(win, "Shift+F1", () => config.openInEditor());

	if (!isWeb) {
		return win;
	}

	// Codes only runs on web windows

	win.once("ready-to-show", () => {
		let windowType = UrlUtils.locationType(contents.getURL());

		win.on("maximize", () => config.set(`windowState.${windowType}.maximized`, true));
		win.on("unmaximize", () => config.set(`windowState.${windowType}.maximized`, false));
		win.on("enter-full-screen", () => config.set(`windowState.${windowType}.fullScreen`, true));
		win.on("leave-full-screen", () => config.set(`windowState.${windowType}.fullScreen`, false));

		let windowStateConfig = config.get("windowState." + windowType, {});
		if (windowStateConfig.maximized) {
			win.maximize();
		}
		if (windowStateConfig.fullScreen) {
			win.setFullScreen(true);
		}
	});

	contents.on("dom-ready", () => {
		if (UrlUtils.locationType(contents.getURL()) === "game") {
			shortcuts.register(win, "F6", () => win.loadURL("https://krunker.io/"));
		}
	});

	contents.on("new-window", (event, url, frameName, disposition, options) => {
		event.preventDefault();
		if (UrlUtils.locationType(url) === "external") shell.openExternal(url);
		else if (UrlUtils.locationType(url) !== "unknown") {
			if (frameName === "_self") contents.loadURL(url);
			else initWindow(url, options.webContents);
		}
	});
	contents.on("will-navigate", (event, url) => {
		event.preventDefault();
		if (UrlUtils.locationType(url) === "external") shell.openExternal(url);
		else if (UrlUtils.locationType(url) !== "unknown") contents.loadURL(url);
	});

	contents.on("will-prevent-unload", event => {
		if (!dialog.showMessageBoxSync({
			buttons: ["Leave", "Cancel"],
			title: "Leave site?",
			message: "Changes you made may not be saved.",
			noLink: true
		})) {
			event.preventDefault();
		}
	});

	shortcuts.register(win, "F5", () => contents.reload());
	shortcuts.register(win, "Shift+F5", () => contents.reloadIgnoringCache());
	shortcuts.register(win, "F11", () => win.setFullScreen(!win.isFullScreen()));
	shortcuts.register(win, "CommandOrControl+L", () => clipboard.writeText(contents.getURL()));
	shortcuts.register(win, "CommandOrControl+N", () => initWindow("https://krunker.io/"));
	shortcuts.register(win, "CommandOrControl+Shift+N", () => initWindow(contents.getURL()));
	shortcuts.register(win, "CommandOrControl+Alt+R", () => {
		app.relaunch();
		app.quit();
	});

	let swapper = new Swapper(
		win,
		/** @type {string} */ (config.get("resourceSwapperMode", "normal")),
		/** @type {string} */ (swapDir)
	);
	swapper.init();

	return win;
}

function initSplashWindow() {
	let win = new BrowserWindow({
		width: 600,
		height: 300,
		center: true,
		resizable: false,
		show: false,
		frame: false,
		transparent: true,
		webPreferences: {
			preload: path.join(__dirname, "preload/splash.js")
		}
	});
	let contents = win.webContents;

	autoUpdate().finally(() => launchGame());

	async function autoUpdate() {
		return new Promise((resolve, reject) => {
			if (AUTO_UPDATE === "skip") return resolve();

			contents.on("dom-ready", () => {
				contents.send("message", "Initializing the auto updater...");
				const { autoUpdater } = require("electron-updater");
				autoUpdater.logger = log;

				autoUpdater.on("error", err => {
					console.error(err);
					contents.send("message", "Error: " + err.name);
					reject(`Error occurred: ${err.name}`);
				});
				autoUpdater.on("checking-for-update", () => contents.send("message", "Checking for update"));
				autoUpdater.on("update-available", info => {
					console.log(info);
					contents.send("message", `Update v${info.version} available`, info.releaseDate);
					if (AUTO_UPDATE !== "download") {
						resolve();
					}
				});
				autoUpdater.on("update-not-available", info => {
					console.log(info);
					contents.send("message", "No update available");
					resolve();
				});
				autoUpdater.on("download-progress", info => {
					contents.send("message", `Downloaded ${Math.floor(info.percent)}%`, Math.floor(info.bytesPerSecond / 1000) + "kB/s");
					win.setProgressBar(info.percent / 100);
				});
				autoUpdater.on("update-downloaded", info => {
					contents.send("message", null, `Installing v${info.version}...`);
					autoUpdater.quitAndInstall(true, true);
				});

				autoUpdater.autoDownload = AUTO_UPDATE === "download";
				autoUpdater.checkForUpdates();
			});
		});
	}

	setupWindow(win);
	win.loadFile("app/html/splash.html");
	return win;

	function launchGame() {
		initWindow("https://krunker.io/");
		setTimeout(() => win.destroy(), 2000);
	}
}

function initPromptWindow(message, defaultValue) {
	let win = new BrowserWindow({
		width: 480,
		height: 240,
		center: true,
		show: false,
		frame: false,
		resizable: false,
		transparent: true,
		webPreferences: {
			preload: path.join(__dirname, "preload/prompt.js")
		}
	});
	let contents = win.webContents;

	setupWindow(win);
	win.once("ready-to-show", () => contents.send("prompt-data", message, defaultValue));

	win.loadFile("app/html/prompt.html");

	return win;
}

let init = async function(){
	await PathUtils.ensureDirs(swapDir, userscriptsDir);

	// Workaround for Electron 8.x
	protocol.registerSchemesAsPrivileged([{
		scheme: "idkr-swap",
		privileges: { secure: true, corsEnabled: true }
	}]);

	const rpcClientId = "770954802443059220";

	DiscordRPC.register(rpcClientId);
	const rpc = new DiscordRPC.Client({ transport: "ipc" });

	rpc.on("ready", () => {
		console.log("Discord RPC ready");
	});

	app.once("ready", () => {
		protocol.registerFileProtocol("idkr-swap", (request, callback) => callback(decodeURI(request.url.replace(/^idkr-swap:/, ""))));
		// eslint-disable-next-line no-shadow
		app.on("second-instance", (e, argv) => {
			let instanceArgv = yargs.parse(argv);
			console.log("Second instance: " + argv);
			if (!["unknown", "external"].includes(locationType(String(instanceArgv["new-window"])))) {
				initWindow(instanceArgv["new-window"]);
			}
		});

		if (isRPCEnabled) {
			rpc.login({ clientId: rpcClientId }).catch(console.error);
		}

		initSplashWindow();
	});

	app.on("quit", async() => {
		if (isRPCEnabled) {
			await rpc.clearActivity();
			rpc.destroy();
		}
	});
};

init();
