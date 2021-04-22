"use strict";

/* eslint-disable no-new */

/**
 * Collection of URL Utilities
 *
 * @class UrlUtils
 */
class UrlUtils {
	/**
	 * Check for URL validity
	 *
	 * @static
	 * @private
	 * @param {string} [url=""]
	 * @returns
	 * @memberof UrlUtils
	 */ // @ts-ignore
	static #isValidURL = (url = "") => {
		try {
			new URL(url);
			return true;
		}
		catch (e){
			return false;
		}
	}

	/**
	 * Return page-type
	 *
	 * @static
	 * @param {string} [url=""]
	 * @returns {string}
	 * @memberof UrlUtils
	 */
	static locationType(url = ""){
		if (!this.#isValidURL(url)) return "unknown";
		const target = new URL(url);
		if (/^(www|comp\.)?krunker\.io$/.test(target.hostname)){
			if (/^\/docs\/.+\.txt$/.test(target.pathname)) return "docs";
			switch (target.pathname) {
				case "/": return "game";
				case "/social.html": return "social";
				case "/viewer.html": return "viewer";
				case "/editor.html": return "editor";
				default: return "unknown";
			}
		}
		return "external";
	}
}

module.exports = UrlUtils;
