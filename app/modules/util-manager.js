"use strict";

/**
 * Global clientUtil manager
 *
 * @class UtilManager
 */
class UtilManager {
	/**
	 * Creates an instance of UtilManager.
	 *
	 * @memberof UtilManager
	 */
	constructor(){
		this._utilKey = `${UtilManager.randomString(10)}`;
	}

	/**
	 * @returns {UtilManager}
	 * @readonly
	 * @static
	 * @memberof UtilManager
	 */
	static get instance(){
		return (this._instance = this._instance || new UtilManager());
	}

	/**
	 * @memberof UtilManager
	 */
	get clientUtils(){
		return window[this._utilKey];
	}

	/**
	 * @memberof UtilManager
	 */
	set clientUtils(value){
		Object.assign(value, {
			key: this._utilKey
		});
		window[this._utilKey] = value;
	}

	/**
	 * Generate a random string for the global util attribute
	 *
	 * @param {number} length - length of the random string
	 * @param {string[]} validChars - array of valid chars or sequences
	 * @returns {string} random string of specified length
	 */
	static randomString(length, validChars = [..."abcdefghijklmnopqrstuvwxyz1234567890"]){
		return Array(length)
			.fill(null)
			.map(() => validChars[Math.floor(Math.random() * validChars.length)])
			.join("");
	}
}

module.exports = UtilManager;
