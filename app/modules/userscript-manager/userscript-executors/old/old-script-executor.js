"use strict";

let IScriptExecutor = require("../script-executor.interface");

/* eslint-disable no-new-func */

/**
 * @typedef {import("./types").IUserscript} IUserscript
 * @typedef {import("./types").IClientUtil} IClientUtil
 */

class OldScriptExecutor extends IScriptExecutor {
	#data;
	#clientUtils;
	#windowType;
	/** @type {IUserscript} */
	#script;
	#config;
	isLoaded = false;

	/**
	 * @param {Buffer} data
	 * @param {IClientUtil} clientUtils
	 * @param {String} windowType
	 * @param {import("electron-store")} config
	 * @memberof Userscript
	 */
	constructor(data, clientUtils, windowType, config) {
		super();
		this.#data = data;
		this.#clientUtils = clientUtils;
		this.#windowType = windowType;
		this.#config = config;
		this.#loadScript();
	}

	/**
	 * Initializes the script and returns if it's valid
	 *
	 * @returns {Boolean}
	 * @memberof Userscript
	 */
	#loadScript = () => {
		try {
			this.#script = null;
			this.#script = Function(
				"clientUtil",
				"config",
				`return (function(){let module = {exports: {}}; ${this.#data.toString()}; return module.exports;})();`
			)(this.#clientUtils, this.#config);

			this.#script.name = this.#script.name || "Unnamed userscript";
			this.#script.version = this.#script.version || "Version unknown";
			this.#script.author = this.#script.author || "Unknown author";
			this.#script.description = this.#script.description || "No description provided";
			this.#script.locations = this.#script.locations || ["all"];
			this.#script.platforms = this.#script.platforms || ["all"];
			this.#script.settings = this.#script.settings || {};
		}
		catch {
			// We don't need to process anything here because
			// of the following isValidScript check
		}

		return this.isValidScript();
	}

	/**
	 * Checks if the loaded script is valid for this executor
	 *
	 * @returns {Boolean}
	 * @memberof Userscript
	 */
	isValidScript() {
		return Boolean(this.#script)
			&& Boolean(this.#script.run);
	}

	/**
	 * Returns if the script should execute in this current
	 * environment
	 *
	 * @returns {Number} > 0 = error
	 * @memberof Userscript
	 */
	shouldExecute() {
		if(!this.isValidScript()) return 1;
		if(!this.isLocationMatching()) return 2;
		if(!this.isPlatformMatching()) return 3;
		return 0;
	}

	/**
	 * @memberof Userscript
	 */
	async preloadScript() {
		Object.assign(this.#clientUtils.settings, this.#script.settings);
	}

	/**
	 * Executes the loaded script
	 *
	 * @returns {Promise<Boolean>}
	 * @memberof Userscript
	 */
	async executeScript() {
		let blockReason = this.shouldExecute();
		if(blockReason > 0) {
			const reasonMapping = [
				"Script is invalid",
				"Location is invalid",
				"Platform is invalid"
			];
			console.error(`[idkr] Blocked Script: ${this.#script.name} by ${this.#script.author}. Reason: ${[reasonMapping[blockReason - 1]]}`);
			return false;
		}

		console.log(`[idkr] Executing userscript: ${this.#script.name} by ${this.#script.author}`);
		const context = this.createContext();
		Object.assign(this.#script, context);
		this.#script.run.bind(context)(this.#config);
		this.isLoaded = true;
		return true;
	}

	/**
	 * Unloads a loaded script
	 * Warning: You can't unload old script files
	 *
	 * @returns {Promise<Boolean>}
	 * @memberof Userscript
	 */
	async unloadScript() {
		return false;
	}

	/**
	 * Creates the script context for use by the loaded script
	 *
	 * @returns {any}
	 * @memberof Userscript
	 */
	createContext() {
		return {
			window,                         // Current Global Window
			document,                       // Current Global Document
			clientUtil: this.#clientUtils,  // Client Utilities API
			console: {                      // Re-bind console outside of VM
				log: (...args) => console.log(...args)
			}
		};
	}

	/**
	 * Check if location is registered
	 *
	 * @returns {boolean}
	 * @memberof Userscript
	 */
	isLocationMatching(){
		return this.#script.locations.some(location => ["all", this.#windowType].includes(location));
	}

	/**
	 * Check if platform is supported
	 *
	 * @returns {boolean}
	 * @memberof Userscript
	 */
	isPlatformMatching(){
		return this.#script.platforms.some(platform => ["all", process.platform].includes(platform));
	}
}

module.exports = OldScriptExecutor;
