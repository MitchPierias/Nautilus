// Modules
import { ipcRenderer } from 'electron';
// Types
import {
	ADD_ACCOUNT,
	REMOVE_ALL_ACCOUNTS
} from './AccountTypes';

import {
	ADD_CONTRACT
} from './ContractTypes';

/**
 * Create Account
 * @desc Creates a new account
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param event <onclick> Button onclick event
 * @version 1.0.0
 * @return
 */
export const createAccount = name => dispatch => {

	const illegalChars = /[\W\d\_]/gi;
	if (illegalChars.test(name)) {
		console.error("Illegal chars in 'createAccount' action");
		return;
	}

	ipcRenderer.send('account:create', name.toLowerCase());

	ipcRenderer.on('account:created', (event, name) => {
		console.log("Account",name,"created");
		dispatch({ type:ADD_ACCOUNT,payload:{uuid:name,name,code:''} });
	});

	ipcRenderer.on('account:exists', (event, name) => {
		console.log("Account",name,"exits");
		dispatch({ type:ADD_ACCOUNT,payload:{uuid:name,name,code:''} });
	});
}

export const loadAccounts = () => dispatch => {

	ipcRenderer.send('account:load', 'EOS5vCdftk4hxj5ygrH6ZK8jkgoo1sm2JoppKvikATAN74b9Bfs2F');

	ipcRenderer.on('accounts:loaded', (event, accounts) => {
		accounts.forEach(name => {
			dispatch({type:ADD_ACCOUNT,payload:{uuid:name,name,code:''}});
		});
	});
}

export const convertAccount = code => dispatch => {

	console.log("Convert account '"+code+"' to contract");

	dispatch({type:ADD_CONTRACT,payload:{code,contract:'926A66B2'}});
}

export const getCode = name => dispatch => {

	ipcRenderer.send('account:code', name);
}