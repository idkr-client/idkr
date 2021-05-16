"use strict";

let { BrowserWindow, ipcMain, app } = require("electron");

let BrowserLoader = require("./browser-loader");
let RPCHandler = require("../modules/rpc-handler");

class IpcLoader {
	/**
	 * Initializes IPC event handlers
	 *
	 * @param {import("electron-store")} config
	 */
	static load(config) {
		ipcMain.handle("get-app-info", () => ({
			name: app.name,
			version: app.getVersion(),
			documentsDir: app.getPath("documents")
		}));

		ipcMain.on("get-path", (event, name) => (event.returnValue = app.getPath(name)));

		ipcMain.on("prompt", (event, message, defaultValue) => {
			let promptWin = BrowserLoader.initPromptWindow(message, defaultValue, config);
			let returnValue = null;

			ipcMain.on("prompt-return", (_, value) => (returnValue = value));

			promptWin.on("closed", () => (event.returnValue = returnValue));
		});

		ipcMain.handle("set-bounds", (event, bounds) => BrowserWindow
			.fromWebContents(event.sender)
			.setBounds(bounds));
	}

	/**
	 * Initializes Discord RPC
	 *
	 * @param {import("electron-store")} config
	 */
	static initRpc(config) {
		let rpcHandler = new RPCHandler(
			"770954802443059220",
			/** @type {boolean} */
			(config.get("discordRPC", true))
		);

		// @TODO: This might deadlock!!!
		let lastSender = null;
		ipcMain.handle("rpc-activity", async(event, activity) => {
			if (rpcHandler.rpcEnabled()){
				if (lastSender !== event.sender){
					if (lastSender) lastSender.send("rpc-stop");
					lastSender = event.sender;
					lastSender.on("destroyed", () => (lastSender = null));
				}
				await rpcHandler.update(activity);
			}
		});

		app.once("ready", async() => await rpcHandler.start());
		app.on("quit", async() => await rpcHandler.end());
	}
}

module.exports = IpcLoader;
