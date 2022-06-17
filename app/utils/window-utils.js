"use strict";

let { BrowserWindow } = require("electron");

/**
 * Collection of Window Utilities
 *
 * @class WindowUtils
 */
class WindowUtils {
	/**
	 * Attempt to toggle the devtools with
	 * a fallback if the regular method fails.
	 *
	 * @static
	 * @param {Electron.BrowserWindow} window
	 * @param {Electron.OpenDevToolsOptions} options
	 * @memberof WindowUtils
	 */
	static openDevtools(window, options) {
		window.webContents.openDevTools(options);

		// Checking for devToolsWebContents is more reliable than WebContents.isDevToolsOpened()
		if (!window.webContents.devToolsWebContents) {
			// Fallback if toggleDevTools fails
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
