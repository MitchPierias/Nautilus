// Modules
import { ipcRenderer } from 'electron';
import ElectronStore from 'electron-store';
// Types
import {
	ADD_ACCOUNT,
	ADD_ACCOUNTS,
	REMOVE_ALL_ACCOUNTS
} from '../types/AccountTypes';

import {
	ADD_CONTRACT
} from '../types/ContractTypes';
// Account Database
const accounts = new ElectronStore({
	name:'accounts',
	defaults:{}
});
// Contract Database
const contracts = new ElectronStore({
	name:'contracts',
	defaults:{}
});

export const loadAccounts = () => dispatch => {

	//ipcRenderer.send('account:load', 'EOS5vCdftk4hxj5ygrH6ZK8jkgoo1sm2JoppKvikATAN74b9Bfs2F');
	dispatch({ type:ADD_ACCOUNTS,payload:accounts.store });

	ipcRenderer.on('accounts:loaded', (event, accounts) => {
		accounts.forEach(name => {
			dispatch({type:ADD_ACCOUNT,payload:{name,code:''}});
		});
	});
}

/**
 * Create Account
 * @desc Creates a new account
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param event <onclick> Button onclick event
 * @version 1.0.0
 * @return
 */
export const createAccount = name => dispatch => {

	if (isValidAccountName(name)) return console.error("Illegal chars in 'createAccount' action");

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

export const convertAccount = code => dispatch => {

	console.log("Convert account '"+code+"' to contract");

	ipcRenderer.send('contract:create', code);

	ipcRenderer.on('contract:created', (event, contract) => {
		dispatch({
			type:ADD_CONTRACT,
			payload:contract
		});
	});
}

export const getCode = name => dispatch => {

	ipcRenderer.send('account:code', name);
}

/**
 * Validate Account Name
 * @desc Determines if the provided string is a valid EOS account_name
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param account_name <String> Account Name String
 * @version 1.0.0
 * @return isValidAccountName <Boolean> Validation result
 */
function isValidAccountName(account_name) {
	const illegalChars = /[\W\d\_]/gi;
	return !illegalChars.test(account_name);
}