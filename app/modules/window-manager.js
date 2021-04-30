'use strict';

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
	constructor(callerId, hideKrunkerWindowsOnShow = true) {
		this.callerId = callerId;
		this.hideOnShow = hideKrunkerWindowsOnShow;
		this.shown = false;

		document.addEventListener('DOMContentLoaded', () => {
			const STYLES = `#settingsTabLayout{grid-template-columns:repeat(8, 1fr)}#settingsTabLayout > div:nth-child(7){display:none}#idkr-windowHolder{width:100%;height:100%;position:absolute}#idkr-menuWindow_${this.callerId}{position:absolute;left:50%;top:50%;border-radius:6px;max-height:calc(100% - 480px);transform:translate(-50%,-50%);z-index:2;overflow-y:auto;display:inline-block;text-align:left;pointer-events:auto;padding:20px;width:705px;font-size:20px;background-color:#fff;-webkit-box-shadow:0 9px 0 0 #a6a6a6;-moz-box-shadow:0 9px 0 0 #a6a6a6;box-shadow:0 9px 0 0 #a6a6a6}`;

			let w;
			if (!document.getElementById('idkr-windowHolder')) {
				w = document.createElement('div');
				w.setAttribute('id', 'idkr-windowHolder');
				w.setAttribute('style', 'display: block;');
				document.getElementsByTagName('body')[0].appendChild(w);
			} else {
				w = document.getElementById('idkr-windowHolder');
			}
			w.innerHTML += `<div id="idkr-menuWindow_${this.callerId}" style="display:none"></div>`;

			let s = document.createElement('style');
			s.innerHTML = STYLES;
			document.getElementsByTagName('body')[0].appendChild(s);

			document
				.getElementsByTagName('body')[0]
				.addEventListener('click', (e) => {
					// @ts-ignore
					!e.path.find(
						(p) =>
							p.id === 'idkr-menuWindow_' + this.callerId || p.id === this.callerId
					) && this.hide();
				});
		});
	}

	/**
	 * Set the innder HTML of the new PopUp
	 *
	 * @param {string} content
	 * @memberof WindowManager
	 */
	setContent(content) {
		document.getElementById('idkr-menuWindow_' + this.callerId).innerHTML = content;
	}

	/**
	 * Shows the PopUp (overrides style)
	 *
	 * @memberof WindowManager
	 */
	show() {
		let w = document.getElementById('idkr-windowHolder');

		if (this.hideOnShow) {
			document
				.getElementById('windowHolder')
				.setAttribute('style', 'display: none;');
		}
		document
			.getElementById('idkr-menuWindow_' + this.callerId)
			.setAttribute('style', 'display: block;');
		this.shown = true;

		  w.style.display == 'none' && w.setAttribute('style', 'display: block;');
	}

	/**
	 * Hides the PopUp (overrides style)
	 *
	 * @memberof WindowManager
	 */
	hide() {
		let w = document.getElementById('idkr-windowHolder');

		document
			.getElementById('idkr-menuWindow_' + this.callerId)
			.setAttribute('style', 'display: none;');
		this.shown = false;
		  w.style.display == 'block' && ![...w.children].some((e) => e.style.display == 'block')&& w.setAttribute('style', 'display: none;');
	}

	/**
	 * Detects whether or not the PopUp is opened
	 * and toggles accordingly
	 *
	 * @memberof WindowManager
	 */
	toggle() {
		this.shown ? this.hide() : this.show();
	}

	/**
	 * Returns true if the PopUp is currenty open, otherwise false.
	 *
	 * @returns {boolean} shown
	 * @memberof WindowManager
	 */
	isShown() {
		return this.shown;
	}
}

module.exports = WindowManager;
