"use strict";

/* eslint-disable no-new-func */

let fs = require("fs");
let path = require("path");

let Userscript = require("./userscript-constructor");
let PathUtils = require("../../utils/path-utils");

/**
 * Initiate and inject usescripts
 *
 * @class UserscriptInitiator
 */
class UserscriptInitiator {
	/**
	 * Creates an instance of UserscriptInitiator.
	 *
	 * @param {import("electron-store")} config
	 * @param {string} dest
	 * @param {object} clientUtils
	 * @memberof UserscriptInitiator
	 */
	constructor(config, dest, clientUtils){
		/** @type {string} */
		let userscriptsDirConfig = (config.get("userscriptsPath", ""));
		this.scriptsPath = PathUtils.isValidPath(userscriptsDirConfig)
			? userscriptsDirConfig
			: dest;
		this.clientUtils = clientUtils;
	}

	/**
	 * Execute the sandboxed code
	 *
	 * @private
	 * @param {Userscript} script
	 * @returns {any}
	 * @memberof UserscriptInitiator
	 */
	#executeScript = (script) => {
		const context = {
			window,                         // Current Global Window
			document,                       // Current Global Document
			clientUtils: this.clientUtils,  // Client Utilities API
			console: {                      // Re-bind console outside of VM
				log: (...args) => console.log(...args)
			}
		};

		return Function(`(${script.run})();`).bind(context)();
	}

	/**
	 * Inject all scripts
	 *
	 * @public
	 * @param {string} windowType
	 * @returns {any}
	 * @memberof UserscriptInitiator
	 */
	inject(windowType){
		try {
			return fs.promises
				.readdir(this.scriptsPath)
				.then(arr => arr.filter(filename => path.extname(filename).toLowerCase() === ".js")
					.forEach(filename => {
						let script = new Userscript(Function(
							`return (function() {${fs.readFileSync(path.join(this.scriptsPath, filename))}})();`
						)(), windowType);

						if (!script.isLocationMatching()) return console.log(`[idkr] Ignored, location not matching: ${script.name}`);
						else if (!script.isPlatformMatching()) return console.log(`[idkr] Ignored, platform not matching: ${script.name}`);

						// if (script.settings) Object.assign(window._clientUtil.settings, script.settings);
						this.#executeScript(script);

						return console.log(`[idkr] Loaded userscript: ${script.name} by ${script.author}`);
					})
				);
		}
		catch (err){
			return console.error("[idkr] Failed to load scripts:", err);
		}
	}
}

module.exports = UserscriptInitiator;
