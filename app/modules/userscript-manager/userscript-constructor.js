"use strict";

/**
 * Create a UserScript meta-collection
 *
 * @class Userscript
 */
class Userscript {
	/**
	 * Creates an instance of Userscript.
	 *
	 * @param {object} initiator
	 * @param {string} windowType
	 * @memberof Userscript
	 */
	constructor(initiator, windowType){
		this.initiator = initiator;
		this.name = initiator.meta.name || "Unnamed userscript";
		this.version = initiator.meta.version || "Version unknown";
		this.author = initiator.meta.author || "Unknown author";
		this.description = initiator.meta.discription || "No description provided";

		this.apiversion = initiator.config.apiversion || "1.0";
		this.locations = initiator.config.locations || ["all"];
		this.platforms = initiator.config.platforms || ["all"];
		this.settings = initiator.config.settings || null;

		this.windowType = windowType;
	}

	/**
	 * Check if location is registered
	 *
	 * @returns {boolean}
	 * @memberof Userscript
	 */
	isLocationMatching(){
		return this.locations.some(location => ["all", this.windowType].includes(location));
	}

	/**
	 * Check if platform is supported
	 *
	 * @returns {boolean}
	 * @memberof Userscript
	 */
	isPlatformMatching(){
		return this.platforms.some(platform => ["all", process.platform].includes(platform));
	}
}

module.exports = Userscript;
