"use strict";

let fs = require("fs");
let path = require("path");

/**
 * Collection of Path Utilities
 *
 * @class PathUtils
 */
class PathUtils {
	/**
	 * Async check if file exists
	 *
	 * @static
	 * @private
	 * @param {string} p
	 * @returns {Promise<boolean>}
	 * @memberof PathUtils
	 */ // @ts-ignore
	static #fileExists = p => fs.promises.access(p, fs.constants.F_OK);


	/**
	 * Create necessary directories if
	 * they don't exist yet
	 *
	 * @static
	 * @param {array} paths
	 * @returns {Promise<string|void>}
	 * @memberof PathUtils
	 */
	static async ensureDirs(...paths){
		return new Promise((resolve, reject) => {
			paths.forEach(async p => {
				try {
					await this.#fileExists(p).catch(async() => await fs.promises.mkdir(p, { recursive: true }));
					return resolve();
				}
				catch (err){
					return reject(err);
				}
			});
		});
	}

	/**
	 * Check if a given path is valid
	 *
	 * @static
	 * @param {string} [p=""]
	 * @returns {boolean}
	 * @memberof PathUtils
	 */
	static isValidPath(p = ""){
		return Boolean(path.parse(p).root);
	}
}

module.exports = PathUtils;
