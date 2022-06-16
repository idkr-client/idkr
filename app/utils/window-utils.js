"use strict";

let { BrowserWindow } = require("electron");

/**
 * Collection of Window Utilities
 *
 * @class WindowUtils
 */
class WindowUtils {
	/**
	 * Attempt to open the devtools with
	 * a fallback if the regular method fails.
	 *
	 * @static
	 * @param {Electron.BrowserWindow} window
	 * @param {Electron.OpenDevToolsOptions["mode"]} mode
	 * @memberof WindowUtils
	 */
	static openDevtools(window, mode = "right") {
		window.webContents.openDevTools({ mode });

		// Fallback if openDevTools fails
		if (!window.webContents.isDevToolsOpened()) {
			window.webContents.closeDevTools();

			const devtoolsWindow = new BrowserWindow();
			devtoolsWindow.setMenuBarVisibility(false);

			window.webContents.setDevToolsWebContents(devtoolsWindow.webContents);
			window.webContents.openDevTools({ mode: "detach" });
			window.once("closed", () => devtoolsWindow.destroy());
		}
	}
}

module.exports = WindowUtils;
