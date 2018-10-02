// Modules
import { ipcRenderer, remote } from 'electron';
import EOS from 'eosjs';
import fs from 'fs';
// Types
import {
	ADD_EVENTS
} from './ContractTypes';

/**
 * Load Actions
 * @desc Retreives contract actions
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param code <string> Contract code
 * @version 0.1.0
 * @return
 */
export const loadActions = code => dispatch => {

	const eos = EOS({httpEndpoint:null});
	// Load and cache ABI
	const abi = fs.readFileSync(selectedABI.path+selectedABI.file);
	eos.fc.abiCache.abi(code, JSON.parse(abi))
	// Fetch the ABI and store actions
	eos.contract(code).then(contract => {
		let actions = {};
		Object.keys(contract).forEach(name => {
			if (name === 'fc' || name === 'transaction') return;
			actions[name] = contract[name];
		});
		// Update actions
		dispatch({type:ADD_EVENTS,payload:actions});
	});
}