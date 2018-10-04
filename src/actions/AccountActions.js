// Modules
import { ipcRenderer } from 'electron';
// Types
import {
	ADD_ACCOUNT,
	REMOVE_ALL_ACCOUNTS
} from './AccountTypes';

/**
 * Create Account
 * @desc Creates a new account
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param event <onclick> Button onclick event
 * @version 1.0.0
 * @return
 */
export const createAccount = name => dispatch => {

	ipcRenderer.send('account:create', name);

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