"use strict";

/* eslint-disable no-new-func */

let fs = require("fs");
let path = require("path");

let Userscript = require("./userscript-constructor");
let PathUtils = require("../../utils/path-utils");
const { Object } = require("globalthis/implementation");

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

		/** @type {Userscript[]} */
		this.scripts = [];
	}

	/**
	 * Executes all loaded scripts
	 */
	executeScripts(){
		this.scripts.forEach(script => this.#executeScript(script));
	}

	/**
	 * Loads all scripts
	 *
	 * @public
	 * @param {string} windowType
	 * @returns {Promise|any}
	 * @memberof UserscriptInitiator
	 */
	 loadScripts(windowType){
		try {
			return fs.promises
				.readdir(this.scriptsPath)
				.then(arr => arr.filter(filename => path.extname(filename).toLowerCase() === ".js")
					.forEach(filename => {
						let script = new Userscript(Function(
							`return (function(){${fs.readFileSync(path.join(this.scriptsPath, filename))}})();`
						)(), windowType);

						if (!script.isLocationMatching()) return console.log(`[idkr] Ignored, location not matching: ${script.name}`);
						else if (!script.isPlatformMatching()) return console.log(`[idkr] Ignored, platform not matching: ${script.name}`);

						this.#addScript(script);
						this.#preloadScript(script);

						return console.log(`[idkr] Initialized userscript: ${script.name} by ${script.author}`);
					})
				);
		}
		catch (err){
			return console.error("[idkr] Failed to load scripts:", err);
		}
	}

	/**
	 * Adds a script to the scriptlist
	 *
	 * @param {Userscript} script
	 */
	#addScript = (script) => {
		this.scripts.push(script);
	}

	/**
	 * Removes a script from the script list
	 *
	 * @param {Userscript} script
	 */
	#removeScript = (script) => {
		this.scripts.splice(this.scripts.indexOf(script), 1);
	}

	/**
	 * Preloads a script
	 * Used to preload settings before the actual load
	 * function gets called
	 *
	 * @param {Userscript} script
	 */
	#preloadScript = (script) => {
		Object.assign(this.clientUtils.settings, script.settings);
	}

	/**
	 * Unloads a given Userscript
	 *
	 * @param {Userscript} script
	 */
	#unloadScript = (script) => {
		script.initiator.unload && script.initiator.unload();
	}

	/**
	 * Execute the given userscript
	 *
	 * @private
	 * @param {Userscript} script
	 * @returns {any}
	 * @memberof UserscriptInitiator
	 */
	#executeScript = (script) => {
		console.log(`[idkr] Executing userscript: ${script.name} by ${script.author}`);
		const context = {
			window,                         // Current Global Window
			document,                       // Current Global Document
			clientUtils: this.clientUtils,  // Client Utilities API
			console: {                      // Re-bind console outside of VM
				log: (...args) => console.log(...args)
			}
		};

		Object.assign(script.initiator, context);
		return script.initiator.load && script.initiator.load();
	}
}

module.exports = UserscriptInitiator;
