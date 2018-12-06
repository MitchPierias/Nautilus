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

/**
 * Load Accounts
 * @desc Triggers the main process too load accounts and update the application store
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @version 1.0.0
 */
export const loadAccounts = () => dispatch => {

	ipcRenderer.send('accounts:load', process.env.EOS_PUBLIC_KEY);

	ipcRenderer.on('accounts:loaded', (event, accounts) => dispatch({ type:ADD_ACCOUNTS,payload:accounts }));
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
	// Validate arguments
	if (!isValidAccountName(name)) {
		console.error("Illegal chars in 'createAccount' action");
		return;
	}

	const account_name = name.toLowerCase();

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

/**
 * Get Account
 * @desc Fetches account data for the account with the specified name
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param name <String> Account name
 * @version 1.0.0
 * @return
 */
export const getAccount = name => dispatch => {

	ipcRenderer.send('account:get', name.toLowerCase());

	ipcRenderer.on('account:received', (event, { name, permissions, cpu, ram }) => {
		dispatch({ type:ADD_ACCOUNT,payload:{uuid:name,name,code:'',permissions,cpu,ram} });
	});
}

export const getCode = name => dispatch => {

	ipcRenderer.send('code:get', name.toLowerCase());

	ipcRenderer.on('code:received', (event, code) => {
		console.log("Recevied code",code,"for contract",name);
	});
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