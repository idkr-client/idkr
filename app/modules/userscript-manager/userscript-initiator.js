"use strict";

/* eslint-disable no-new-func */

let fs = require("fs");
let path = require("path");

let PathUtils = require("../../utils/path-utils");
let ScriptExecutor10 = require("./userscript-executors/1_0/1-0-script-executor");

/**
 * @typedef {import("./userscript-executors/script-executor.interface")} IScriptExecutor
 */

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

		/** @type {IScriptExecutor[]} */
		this.scripts = [];
	}

	/**
	 * Executes all loaded scripts
	 * @returns {Promise<Boolean>[]}
	 */
	executeScripts(){
		return this.scripts.map(script => script.executeScript());
	}

	/**
	 * Loads all scripts
	 *
	 * @public
	 * @param {string} windowType
	 * @returns {Promise<void>}
	 * @memberof UserscriptInitiator
	 */
	async loadScripts(windowType){
		console.log("loading scripts");
		await Promise.all(
			(await fs.promises.readdir(this.scriptsPath)).filter(filename => path.extname(filename).toLowerCase() === ".js")
				.map(filename => {
					try {
						let data = fs.readFileSync(path.join(this.scriptsPath, filename));
						let executor = new ScriptExecutor10(data, this.clientUtils, windowType);
						if(executor.isValidScript()) {
							this.#addScript(executor);
							return executor.preloadScript();
						}
					}
					catch(err) {
						console.error(`[idkr] Failed to load script [${filename}]`);
						console.error(err);
					}

					return null;
				})
		);
	}

	/**
	 * Adds a script to the scriptlist
	 *
	 * @param {IScriptExecutor} script
	 */
	#addScript = (script) => {
		this.scripts.push(script);
	}

	/**
	 * Removes a script from the script list
	 *
	 * @param {IScriptExecutor} script
	 */
	#removeScript = (script) => {
		this.scripts.splice(this.scripts.indexOf(script), 1);
	}
}

module.exports = UserscriptInitiator;
