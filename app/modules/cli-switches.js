"use strict";

let yargs = require("yargs");

/**
 * Append the correct CLI Switches to
 * the underlying Chrome instance
 *
 * @param {import("electron").App} app
 * @param {import("electron-store")} config
 */
let cliSwitchHandler = function(app, config){
	const angleBackend = /** @type {string} */ (config.get("angleBackend", "default"));
	const colorProfile = /** @type {string} */ (config.get("colorProfile", "default"));

	app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

	if (!config.get("acceleratedCanvas", true)) app.commandLine.appendSwitch("disable-accelerated-2d-canvas", "true");
	if (config.get("disableFrameRateLimit", false)){
		app.commandLine.appendSwitch("disable-frame-rate-limit");
		app.commandLine.appendSwitch("disable-gpu-vsync");
	}
	if (config.get("inProcessGPU", false)) app.commandLine.appendSwitch("in-process-gpu");
	if (angleBackend !== "default") app.commandLine.appendSwitch("use-angle", angleBackend);
	if (colorProfile !== "default") app.commandLine.appendSwitch("force-color-profile", colorProfile);

	yargs.parse(
		/** @type {string} */
		(config.get("chromiumFlags", "")),
		(_, argv) => Object.entries(argv).slice(1, -1).forEach(entry => app.commandLine.appendSwitch(entry[0], entry[1]))
	);
};

module.exports = cliSwitchHandler;
