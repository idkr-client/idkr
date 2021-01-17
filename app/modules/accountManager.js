'use strict';

// Inspired by Sorte#0001

const HTML = {
	BTN_INNER: '<div id="accManagerBtn" class="button buttonB" style="height:78px;width:60px;vertical-align:bottom;margin-left:-5px;margin-right:10px"><img src="./img/menu-icons/profile.png" style="height:45px;margin-left:-10px"></div>',
	ALT_MENU: '<div id="altAccounts"></div><div id="buttons"><div class="accountButton" id="altAdd">Add new account</div><div class="accountButton" id="altDelete">Delete account</div><div>',
	FORM: '<input id="accName" type="text" placeholder="Enter Username" class="accountInput" style="margin-top:25px;" value=""><input id="accPass" type="password" placeholder="Enter Password" class="accountInput"><div id="accResp" style="margin-top:10px;font-size:18px;color:rgba(0,0,0,0.5);"><span style="color:rgba(0,0,0,0.8)"></span></div><div class="accountButton" id="addAccountButtonB" style="">Add Account</div></div></div>',
	STYLE: '.deleteColor {color:black!important;background-color:#313131!important;} #deleteMode {-webkit-animation: shake 0.13s infinite;} @keyframes shake {0% {transform: rotate(5deg);} 100% {transform: rotate(-5deg);}}'
};

class AccountManager {
	constructor(window, document, localStorage) {
		this.window = window;
		this.document = document;
		this.localStorage = localStorage;
		this.deleteModeStatus = false;

		if (!this.localStorage.getItem('altAccounts')) {
			this.localStorage.setItem('altAccounts', '[]');
		}
	}

	deleteMode() {
		for (let account of this.document.getElementById('altAccounts').children) {
			account.id = this.deleteModeStatus ? 'altAccountsLISTED' : 'deleteMode';
			this.deleteModeStatus
				? this.document.getElementById('altDelete').classList.remove('deleteColor')
				: this.document.getElementById('altDelete').classList.add('deleteColor');
		}
		this.deleteModeStatus = !this.deleteModeStatus;
	}

	addAccount(name, pass) {
		if (name.replace(/\s/, '') === '' || pass.replace(/\s/, '') === '') {
			return alert('Username and Password must not be empty');
		}
		let arr = [];
		JSON.parse(this.localStorage.getItem('altAccounts')).forEach(e => arr.push(e));
		arr.push({ username: name, password: pass });
		this.localStorage.setItem('altAccounts', JSON.stringify(arr));
	}

	deleteAccount(name) {
		let accounts = JSON.parse(this.localStorage.getItem('altAccounts'));
		let empty = 0;
		for (let i = 0; i < accounts['length']; i++) {
			if (accounts[i].username === name) {
				empty = i;
				break;
			}
		}
		accounts.splice(empty, 1);
		this.localStorage.setItem('altAccounts', JSON.stringify(accounts));
		eval('showWindow(27)');
		this.openPopup();
		this.deleteModeStatus = false;
		this.deleteMode();
	}

	login(name, pass) {
		this.window.logoutAcc();
		this.document.getElementById('accName').value = name;
		this.document.getElementById('accPass').value = pass;
		this.window.loginAcc();
		this.document.getElementById('accName').style.display = 'none';
		this.document.getElementById('accPass').style.display = 'none';
		this.document.getElementsByClassName('accountButton')[0].style.display = 'none';
		this.document.getElementsByClassName('accountButton')[1].style.display = 'none';
	}

	watcher() {
		const altTemp = this.document.createElement('div');
		altTemp.className = 'button';
		altTemp.innerText = 'username';
		const altHolder = this.document.getElementById('altAccounts');

		this.document.getElementById('altAdd').addEventListener('click', () => {
			this.document.getElementById('menuWindow').innerHTML = HTML.FORM;
			this.document.getElementById('addAccountButtonB').addEventListener('click', () => {
				this.addAccount(this.document.getElementById('accName').value, this.document.getElementById('accPass').value);
			});
		});

		JSON.parse(this.localStorage.getItem('altAccounts')).forEach(e => {
			const div = altTemp.cloneNode(true);
			div.innerText = e.username;
			div.id = 'altAccountsLISTED';
			altHolder.appendChild(div);
			div.addEventListener('click', () => (this.deleteModeStatus ? this.deleteAccount(e.username) : this.login(e.username, e.password)));
		});
	}

	openPopup() {
		eval('showWindow(27)');
		this.document.getElementById('windowHeader').innerText = 'Account Manager';
		this.document.getElementById('menuWindow').innerHTML = HTML.ALT_MENU;
		this.document.getElementById('altDelete').addEventListener('click', () => this.deleteMode());
		this.watcher();
	}

	createDom(str) {
		let tmp = this.document.createElement('div');
		tmp.innerHTML = str.trim();
		return tmp.firstChild;
	}

	injectStyles() {
		this.document.head.appendChild(Object.assign(this.document.createElement('style'), { innerText: HTML.STYLE }));
		let tar = this.document.getElementById('customizeButton');
		tar.parentNode.insertBefore(this.createDom(HTML.BTN_INNER), tar);
		this.document.getElementById('accManagerBtn').addEventListener('click', () => this.openPopup());
	}
}

module.exports = AccountManager;
