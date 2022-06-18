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
	 * @param {Electron.OpenDevToolsOptions} [options]
	 * @memberof WindowUtils
	 */
	static openDevToolsWithFallback(window, options) {
		let assumeFallback = true;
		window.webContents.openDevTools(options);
		window.webContents.once("devtools-opened", () => { assumeFallback = false; });

		setTimeout(() => {
			if (assumeFallback) {
				// Fallback if openDevTools fails
				window.webContents.closeDevTools();

				const devtoolsWindow = new BrowserWindow();
				devtoolsWindow.setMenuBarVisibility(false);

				window.webContents.setDevToolsWebContents(devtoolsWindow.webContents);
				window.webContents.openDevTools({ mode: "detach" });
				window.once("closed", () => devtoolsWindow.destroy());
			}
		}, 500);
	}
}

module.exports = WindowUtils;
