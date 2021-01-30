'use strict';

let WindowManager = require('./window-manager');

const HTML = {
	BTN_INNER: '<div id="accManagerBtn" class="button buttonB bigShadowT" onmouseenter="playTick()" style="display:block;width:300px;text-align:center;padding:15px;font-size:23px;pointer-events:all;padding-bottom:22px;margin-left:-5px;margin-top:5px">Alt-Manager</div>',
	ALT_MENU: '<div id="altAccounts"></div><div id="buttons"><div class="accountButton" id="altAdd">Add new account</div></div>',
	FORM: '<input id="accName" type="text" placeholder="Enter Username" class="accountInput" style="margin-top:25px;" value=""><input id="accPass" type="password" placeholder="Enter Password" class="accountInput"><div id="accResp" style="margin-top:10px;font-size:18px;color:rgba(0,0,0,0.5);"><span style="color:rgba(0,0,0,0.8)"></span></div><div class="accountButton" id="addAccountButtonB" style="">Add Account</div></div></div>',
	STYLE: '#altAdd,#addAccountButtonB{width:100%}.altAccountsLISTED{margin-right:10px;padding:0!important;background:0 0!important;box-shadow:unset!important}.altdeletebtn{display:inline-block;padding:10px 13px;color:#fff;background-color:#ff4747;border-radius:0 4px 4px 0;box-shadow:inset 0 -7px 0 0 #992b2b}.altlistelement{display:inline-block;padding:10px 15px 10px 17px;color:#fff;background-color:#ffc147;border-radius:4px 0 0 4px;box-shadow:inset 0 -7px 0 0 #b08531}.deleteColor{color:#000!important;background-color:#313131!important}'
};

/**
 * Creates a new instance of the AccountManager.
 * This class should not be used anywhere else
 * other than the single instance in app/preload/game.js
 * thus, it is not further documented.
 *
 * @class AccountManager
 */
class AccountManager {
	constructor(window, document, localStorage) {
		this.window = window;
		this.document = document;
		this.localStorage = localStorage;
		this.managerWin = new WindowManager(document, 'accManagerBtn');
		this.addWin = new WindowManager(document, 'altAdd');

		!this.localStorage.getItem('altAccounts') && this.localStorage.setItem('altAccounts', '[]');
	}

	addAccount(name, pass) {
		if (name.replace(/\s/, '') === '' || pass.replace(/\s/, '') === '') return alert('Username and Password fields must not be empty.');
		let users = JSON.parse(this.localStorage.getItem('altAccounts'));
		if (users.find(e => e.username === name)) return alert('This Username has already been added.');
		this.localStorage.setItem('altAccounts', JSON.stringify(
			[].concat(users, { username: name, password: pass })
		));
		this.addWin.hide();
		this.openPopup();
	}

	deleteAccount(name) {
		this.localStorage.setItem('altAccounts', JSON.stringify(
			JSON.parse(this.localStorage.getItem('altAccounts')).filter(e => e.username !== name)
		));
		this.managerWin.hide();
		this.openPopup();
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

	openPopup() {
		this.managerWin.setContent(HTML.ALT_MENU);
		this.managerWin.toggle();
		this.watcher();
	}

	watcher() {
		let storage = JSON.parse(this.localStorage.getItem('altAccounts'));

		this.document.getElementById('altAdd').addEventListener('click', () => {
			this.managerWin.hide();
			this.addWin.setContent(HTML.FORM);
			this.addWin.show();
			this.document.getElementById('addAccountButtonB').addEventListener('click', () => (
				this.addAccount(this.document.getElementById('accName').value, this.document.getElementById('accPass').value)
			));
		});

		storage.forEach(e => {
			const div = this.document.createElement('div');
			div.innerHTML = `<span class="altlistelement" onmouseenter="playTick()">${e.username}</span><span class="altdeletebtn" onmouseenter="playTick()">X</span>`;
			div.className = 'button altAccountsLISTED';
			this.document.getElementById('altAccounts').appendChild(div);
		});

		this.document.querySelectorAll('.altlistelement').forEach(i => i.addEventListener('click', (e) => {
			let selected = storage.find(obj => obj.username === e.target.innerText);
			this.login(selected.username, selected.password);
			this.managerWin.hide();
		}));

		this.document.querySelectorAll('.altdeletebtn').forEach(i => i.addEventListener('click', (e) => {
			let tar = e.target.previousElementSibling.innerText;
			confirm(`Do you really want to remove the account "${tar}" from the Alt-Manager?`) && this.deleteAccount(tar);
		}));
	}

	injectStyles() {
		this.document.head.appendChild(Object.assign(this.document.createElement('style'), { innerText: HTML.STYLE }));
		let tar = this.document.getElementById('customizeButton');

		let tmp = this.document.createElement('div');
		tmp.innerHTML = HTML.BTN_INNER.trim();

		tar.parentNode.insertBefore(tmp.firstChild, tar.nextSibling);
		this.document.getElementById('accManagerBtn').addEventListener('click', () => this.openPopup());
	}
}

module.exports = AccountManager;
