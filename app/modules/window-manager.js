"use strict";

const STYLES = "#settingsTabLayout{grid-template-columns:repeat(7, 1fr)}#idkr-windowHolder{width:100%;height:100%;position:absolute}#idkr-menuWindow{position:absolute;left:50%;top:50%;border-radius:6px;max-height:calc(100% - 480px);transform:translate(-50%,-50%);z-index:2;overflow-y:auto;display:inline-block;text-align:left;pointer-events:auto;padding:20px;width:705px;font-size:20px;background-color:#fff;-webkit-box-shadow:0 9px 0 0 #a6a6a6;-moz-box-shadow:0 9px 0 0 #a6a6a6;box-shadow:0 9px 0 0 #a6a6a6}";

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
				s.innerHTML = STYLES;
				document.getElementsByTagName("body")[0].appendChild(s);

				document.getElementsByTagName("body")[0].addEventListener("click", e => {
					// @ts-ignore
					(!e.path.find(p => p.id === "idkr-menuWindow" || p.id === this.callerId)) && this.hide();
				});
			}
		});
	}

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
