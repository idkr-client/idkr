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
	 * @param {import("electron").App} app
	 * @memberof UserscriptInitiator
	 */
	constructor(config, app){
		let userscriptsDirConfig = config.get("userscriptsPath", "");
		this.scriptsPath = PathUtils.isValidPath(userscriptsDirConfig)
			? userscriptsDirConfig
			: path.join(app.getPath("documents"), "idkr/scripts");
	}

	/**
	 * Execution context for the scripts
	 *
	 * @private
	 * @memberof UserscriptInitiator
	 */
	#context = {
		console: {
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
		try {
			fs.readdirSync(this.scriptsPath).filter(filename => path.extname(filename).toLowerCase() === ".js").forEach(filename => {
				try {
					let script = new Userscript(require(path.join(this.scriptsPath, filename)), windowType);
					if (!script.isLocationMatching()){
						console.log(`[USH] Ignored, location not matching: ${script.name}`);
					}
					else if (!script.isPlatformMatching()){
						console.log(`[USH] Ignored, platform not matching: ${script.name}`);
					}
					else {
						if (script.settings){
							Object.assign(window._clientUtil.settings, script.settings);
						}
						if (script.run){
							script.run(config);
						}
						console.log(`[USH] Loaded userscript: ${script.name} by ${script.author}`);
					}
				}
				catch (err){
					console.error("[USH] Failed to load userscript:", err);
				}
			});
		}
		catch (err){
			console.error("[USH] Failed to load scripts:", err);
		}
	}
}

module.exports = UserscriptInitiator;
