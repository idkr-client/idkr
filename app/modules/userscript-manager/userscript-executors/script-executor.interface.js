"use strict";

class IScriptExecutor {
	/** @returns {Promise<any>} */
	async preloadScript() { throw new Error("Method not implemented"); }
	/** @returns {Promise<boolean>} */
	async executeScript() { throw new Error("Method not implemented"); }
	/** @returns {Promise<boolean>} */
	async unloadScript() { throw new Error("Method not implemented"); }
	/** @returns {any} */
	isLocationMatching() { throw new Error("Method not implemented"); }
	/** @returns {any} */
	isPlatformMatching() {throw new Error("Method not implemented");  }
}

module.exports = IScriptExecutor;
