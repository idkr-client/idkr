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
		this.name = initiator.name || "Unnamed userscript";
		this.version = initiator.version || "Version unknown";
		this.author = initiator.author || "Unknown author";
		this.description = initiator.discription || "No description provided";
		this.locations = initiator.locations || ["all"];
		this.platforms = initiator.platforms || ["all"];
		this.settings = initiator.settings || null;
		this.run = initiator.run || null;

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
