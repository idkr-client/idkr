"use strict";

class Userscript {
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

	isLocationMatching(){
		return this.locations.some(location => ["all", this.windowType].includes(location));
	}

	isPlatformMatching(){
		return this.platforms.some(platform => ["all", process.platform].includes(platform));
	}
}

module.exports = Userscript;
