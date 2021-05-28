"use strict";

let Store = require("electron-store");

let { baseStyles } = require("./styles-injection");

const config = new Store();

/**
 * Creates a new controllable PopUp Element
 *
 * @class WindowManager
 */
class WindowManager {
	/**
	 * Creates an instance of WindowManager.
	 *
	 * @param {string} callerId - The ID of the Button element that called/triggered this Class
	 * @param {boolean} [hideKrunkerWindowsOnShow=true] - Should the created popup hide, when a krunker popup is opened? Default=Yes
	 * @memberof WindowManager
	 */
	constructor(callerId, hideKrunkerWindowsOnShow = true){
		this.callerId = callerId;
		this.hideOnShow = hideKrunkerWindowsOnShow;
		this.shown = false;

		document.addEventListener("DOMContentLoaded", () => {
			if (!document.getElementById("idkr-windowHolder")){
				let w = document.createElement("div");
				w.setAttribute("id", "idkr-windowHolder");
				w.setAttribute("style", "display: none;");
				w.innerHTML = '<div id="idkr-menuWindow"></div>';
				document.getElementsByTagName("body")[0].appendChild(w);

				let s = document.createElement("style");
				s.setAttribute("class", this.#randomStr(10));
				s.setAttribute("id", this.#randomStr(10));
				s.innerHTML = baseStyles;
				if (config.get("enableMenuTimer", true)) s.innerHTML += require("./styles-injection").menuTimerStyles;
				document.getElementsByTagName("body")[0].appendChild(s);

				document.getElementsByTagName("body")[0].addEventListener("click", e => {
					// @ts-ignore
					(!e.path.find(p => p.id === "idkr-menuWindow" || p.id === this.callerId)) && this.hide();
				});
			}
		});
	}

	/**
	 * Generate a random string with custom length
	 *
	 * @param {number} length
	 * @private
	 * @returns {string}
	 */
	#randomStr = (length) => {
		return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
	};

	/**
	 * Set the innder HTML of the new PopUp
	 *
	 * @param {string} content
	 * @memberof WindowManager
	 */
	setContent(content){
		document.getElementById("idkr-menuWindow").innerHTML = content;
	}

	/**
	 * Shows the PopUp (overrides style)
	 *
	 * @memberof WindowManager
	 */
	show(){
		if (this.hideOnShow) document.getElementById("windowHolder").setAttribute("style", "display: none;");
		document.getElementById("idkr-windowHolder").setAttribute("style", "display: block;");
		this.shown = true;
	}

	/**
	 * Hides the PopUp (overrides style)
	 *
	 * @memberof WindowManager
	 */
	hide(){
		document.getElementById("idkr-windowHolder").setAttribute("style", "display: none;");
		this.shown = false;
	}

	/**
	 * Detects whether or not the PopUp is opened
	 * and toggles accordingly
	 *
	 * @memberof WindowManager
	 */
	toggle(){
		this.shown ? this.hide() : this.show();
	}

	/**
	 * Returns true if the PopUp is currenty open, otherwise false.
	 *
	 * @returns {boolean} shown
	 * @memberof WindowManager
	 */
	isShown(){
		return this.shown;
	}
}

module.exports = WindowManager;
