'use strict';

const STYLES = '#idkr-windowHolder{width:100%;height:100%;position:absolute}#idkr-menuWindow{position:absolute;left:50%;top:50%;border-radius:6px;max-height:calc(100% - 480px);transform:translate(-50%,-50%);z-index:2;overflow-y:auto;display:inline-block;text-align:left;pointer-events:auto;padding:20px;width:705px;font-size:20px;background-color:#fff;-webkit-box-shadow:0 9px 0 0 #a6a6a6;-moz-box-shadow:0 9px 0 0 #a6a6a6;box-shadow:0 9px 0 0 #a6a6a6}';

// TODO: This currently doesnt hide popups that have been created by krunker

class WindowManager {
	/**
	 * Creates an instance of WindowManager.
	 * @param {HTMLDocument} document
	 * @param {String} callerId - The ID of the Button element that called this Class
	 * @memberof WindowManager
	 */
	constructor(document, callerId) {
		this.$ = document;
		this.callerId = callerId;
		this.shown = false;

		document.addEventListener('DOMContentLoaded', () => {
			if (!document.getElementById('idkr-windowHolder')) {
				let w = document.createElement('div');
				w.setAttribute('id', 'idkr-windowHolder');
				w.setAttribute('style', 'display: none;');
				w.innerHTML = '<div id="idkr-menuWindow"></div>';
				document.getElementsByTagName('body')[0].appendChild(w);

				let s = document.createElement('style');
				s.innerHTML = STYLES;
				document.getElementsByTagName('body')[0].appendChild(s);

				document.getElementsByTagName('body')[0].addEventListener('click', e => {
					// @ts-ignore
					(!e.path.find(p => p.id === 'idkr-menuWindow' || p.id === this.callerId)) && this.hide();
				});
			}
		});
	}

	setContent(content) {
		this.$.getElementById('idkr-menuWindow').innerHTML = content;
	}

	show() {
		this.$.getElementById('idkr-windowHolder').setAttribute('style', 'display: block;');
		this.shown = true;
	}

	hide() {
		this.$.getElementById('idkr-windowHolder').setAttribute('style', 'display: none;');
		this.shown = false;
	}

	toggle() {
		this.$.getElementById('idkr-windowHolder').setAttribute('style', 'display: ' + (this.shown ? 'none' : 'block') + ';');
		this.shown = !this.shown;
	}

	isShown() {
		return this.shown;
	}
}

module.exports = WindowManager;
