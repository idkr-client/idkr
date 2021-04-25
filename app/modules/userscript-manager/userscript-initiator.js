"use strict";

let fs = require("fs");
let path = require("path");
let vm = require("vm");

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
	 * @param {object} config
	 * @param {string} dest
	 * @param {object} clientUtils
	 * @memberof UserscriptInitiator
	 */
	constructor(config, dest, clientUtils){
		let userscriptsDirConfig = config.get("userscriptsPath", "");
		this.scriptsPath = PathUtils.isValidPath(userscriptsDirConfig)
			? userscriptsDirConfig
			: dest;
		this.clientUtils = clientUtils;
	}

	/**
	 * Execution context for the scripts
	 *
	 * @private
	 * @memberof UserscriptInitiator
	 */
	#context = {
		window,                         // Current Global Window
		document,                       // Current Global Document
		clientUtils: this.clientUtils,  // Client Utilities API
		console: {                      // Re-bind console outside of VM
			log: (...args) => console.log(...args)
		}
	}

	/**
	 * Create a VM instance per userscript
	 *
	 * @private
	 * @param {string} code
	 * @memberof UserscriptInitiator
	 */
	#createVm = (code) => {
		let script = new vm.Script(code);
		vm.createContext(this.#context);
		script.runInContext(this.#context);
	}

	/**
	 * Inject all scripts
	 *
	 * @public
	 * @param {string} windowType
	 * @memberof UserscriptInitiator
	 */
	inject(windowType){
		console.log("injecting...");
		try {
			fs.readdirSync(this.scriptsPath).filter(filename => path.extname(filename).toLowerCase() === ".js").forEach(filename => {
				let script = new Userscript(require(path.join(this.scriptsPath, filename)), windowType);
				if (!script.isLocationMatching()) return console.log(`[idkr] Ignored, location not matching: ${script.name}`);
				else if (!script.isPlatformMatching()) return console.log(`[idkr] Ignored, platform not matching: ${script.name}`);

				// if (script.settings) Object.assign(window._clientUtil.settings, script.settings);
				let executor = script.run;
				executor && this.#createVm(String(executor));

				return console.log(`[idkr] Loaded userscript: ${script.name} by ${script.author}`);
			});
		}
		catch (err){
			console.error("[idkr] Failed to load scripts:", err);
		}
	}
}

module.exports = UserscriptInitiator;
