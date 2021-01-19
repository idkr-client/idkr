'use strict';

// Inspired by Sorte#0001

const HTML = {
	BTN_INNER: '<div id="accManagerBtn" class="button buttonB" style="height:78px;width:60px;vertical-align:bottom;margin-left:-5px;margin-right:10px"><img src="./img/menu-icons/profile.png" style="height:45px;margin-left:-10px"></div>',
	ALT_MENU: '<div id="altAccounts"></div><div id="buttons"><div class="accountButton" id="altAdd">Add new account</div></div>',
	FORM: '<input id="accName" type="text" placeholder="Enter Username" class="accountInput" style="margin-top:25px;" value=""><input id="accPass" type="password" placeholder="Enter Password" class="accountInput"><div id="accResp" style="margin-top:10px;font-size:18px;color:rgba(0,0,0,0.5);"><span style="color:rgba(0,0,0,0.8)"></span></div><div class="accountButton" id="addAccountButtonB" style="">Add Account</div></div></div>',
	STYLE: '.altAccountsLISTED{margin-right:10px;padding:0!important;background:0 0!important;box-shadow:unset!important}.altdeletebtn{display:inline-block;padding:10px 13px;color:#fff;background-color:#ff4747;box-shadow:inset 0 -7px 0 0 #992b2b}.altlistelement{display:inline-block;padding:10px 15px 10px 17px;color:#fff;background-color:#ffc147;box-shadow:inset 0 -7px 0 0 #b08531}.deleteColor{color:#000!important;background-color:#313131!important}'
};

class AccountManager {
	constructor(window, document, localStorage) {
		this.window = window;
		this.document = document;
		this.localStorage = localStorage;

		!this.localStorage.getItem('altAccounts') && this.localStorage.setItem('altAccounts', '[]');
	}

	addAccount(name, pass) {
		if (name.replace(/\s/, '') === '' || pass.replace(/\s/, '') === '') return alert('Username and Password must not be empty');
		this.localStorage.setItem('altAccounts', JSON.stringify(
			[].concat(JSON.parse(this.localStorage.getItem('altAccounts')), { username: name, password: pass })
		));
		this.window.showWindow(27);
		this.openPopup();
	}

	deleteAccount(name) {
		this.localStorage.setItem('altAccounts', JSON.stringify(
			JSON.parse(this.localStorage.getItem('altAccounts')).filter(e => e.username !== name)
		));
		this.window.showWindow(27);
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
		this.window.showWindow(27);
		this.document.getElementById('windowHeader').innerText = 'Account Manager';
		this.document.getElementById('menuWindow').innerHTML = HTML.ALT_MENU;
		this.watcher();
	}

	watcher() {
		let storage = JSON.parse(this.localStorage.getItem('altAccounts'));

		this.document.getElementById('altAdd').addEventListener('click', () => {
			this.document.getElementById('menuWindow').innerHTML = HTML.FORM;
			this.document.getElementById('addAccountButtonB').addEventListener('click', () => (
				this.addAccount(this.document.getElementById('accName').value, this.document.getElementById('accPass').value)
			));
		});

		storage.forEach(e => {
			const div = this.document.createElement('div');
			div.innerHTML = `<span class="altlistelement">${e.username}</span><span class="altdeletebtn">X</span>`;
			div.className = 'button altAccountsLISTED';
			this.document.getElementById('altAccounts').appendChild(div);
		});

		this.document.querySelectorAll('.altlistelement').forEach(i => i.addEventListener('click', (e) => {
			let selected = storage.filter(obj => obj.username === e.target.innerText)[0];
			this.login(selected.username, selected.password);
		}));

		this.document.querySelectorAll('.altdeletebtn')
			.forEach(i => i.addEventListener('click', (e) => this.deleteAccount(e.target.previousElementSibling.innerText)));
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
