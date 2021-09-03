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
	static #fileExists = p => {
		return new Promise((resolve, reject) => fs.access(p, fs.constants.F_OK, (err, result) => err
			? reject(err)
			: resolve(result))
		);
	}

	/**
	 * Create neccessary directories if
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
					if (await this.#fileExists(p)) await fs.promises.mkdir(p, { recursive: true });
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
