"use strict";

/* eslint-disable no-new-func */

let IScriptExecutor = require("../script-executor.interface");

/**
 * @typedef {import("./types").IUserscript} IUserscript
 * @typedef {import("./types").IClientUtil} IClientUtil
 */

// TODO: Maybe find a better file-/ and classname for this

class ScriptExecutor10 extends IScriptExecutor {
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
				`return (function(){${this.#data.toString()}})();`
			)();
			this.#script.meta = this.#script.meta || {};
			this.#script.config = this.#script.config || {};

			const {meta, config} = this.#script;
			meta.name = meta.name || "Unnamed userscript";
			meta.version = meta.version || "Version unknown";
			meta.author = meta.author || "Unknown author";
			meta.description = meta.description || "No description provided";

			config.apiversion = config.apiversion || "1.0";
			config.locations = config.locations || ["all"];
			config.platforms = config.platforms || ["all"];
			config.settings = config.settings || {};

			const context = this.createContext();
			Object.assign(this.#script, context);
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
			&& Boolean(this.#script.load)
			&& Boolean(this.#script.unload)
			&& Boolean(this.#script.config)
			&& Boolean(this.#script.meta)
			&& this.#script.config.apiversion === "1.0";
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
		Object.assign(this.#clientUtils.settings, this.#script.config.settings);
	}

	/**
	 * Executes the loaded script
	 *
	 * @returns {Promise<Boolean>}
	 * @memberof Userscript
	 */
	async executeScript() {
		if(this.isLoaded) {
			await this.unloadScript();
		}

		let blockReason = this.shouldExecute();
		if(blockReason > 0) {
			const reasonMapping = [
				"Script is invalid",
				"Location is invalid",
				"Platform is invalid"
			];
			console.error(`[idkr] Blocked Script: ${this.#script.meta.name} by ${this.#script.meta.author}. Reason: ${[reasonMapping[blockReason - 1]]}`);
			return false;
		}

		console.log(`[idkr] Executing userscript: ${this.#script.meta.name} by ${this.#script.meta.author}`);
		this.#script.load(this.#config);
		this.isLoaded = true;
		return true;
	}

	/**
	 * Unloads a loaded script
	 *
	 * @returns {Promise<Boolean>}
	 * @memberof Userscript
	 */
	async unloadScript() {
		if(!this.isLoaded) {
			return false;
		}
		console.log(`[idkr] Unloading userscript: ${this.#script.meta.name} by ${this.#script.meta.author}`);
		this.#script.unload();
		this.isLoaded = false;
		return true;
	}

	/**
	 * Creates the script context for use by the loaded script
	 *
	 * @returns {any}
	 * @memberof Userscript
	 */
	createContext() {
		return {
			window,                          // Current Global Window
			document,                        // Current Global Document
			clientUtils: this.#clientUtils,  // Client Utilities API
			console: {                       // Re-bind console outside of VM
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
		return this.#script.config.locations.some(location => ["all", this.#windowType].includes(location));
	}

	/**
	 * Check if platform is supported
	 *
	 * @returns {boolean}
	 * @memberof Userscript
	 */
	isPlatformMatching(){
		return this.#script.config.platforms.some(platform => ["all", process.platform].includes(platform));
	}
}

module.exports = ScriptExecutor10;
