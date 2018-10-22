// Modules
import { ipcRenderer, remote } from 'electron';
import ElectronStore from 'electron-store';
import createHash from 'create-hash';
// Types
import {
	ADD_CONTRACT,
	ADD_CONTRACTS,
	UPDATE_CONTRACT,
	ADD_EVENTS,
	COMPILED_CONTRACT,
	DEPLOYED_CONTRACT
} from '../types/ContractTypes';
// Contract Database
const contracts = new ElectronStore({
	name:'contracts',
	defaults:{}
});

/**
 * Load Contracts
 * @desc Loads all cached contract data
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @version 0.1.0
 * @return
 */
export const loadContracts = () => dispatch => {
	// Pass the contract store to the reducer
	dispatch({ type:ADD_CONTRACTS, payload:contracts.store });
}

/**
 * Link File
 * @desc Linkes file to a specified contract
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param name <string> Contract code
 * @param type <string> File type
 * @param uid <string> File identifier
 * @version 0.1.0
 * @return
 */
export const linkFile = (name, type, uid) => dispatch => {

	ipcRenderer.send('contract:link', { name, type, file:uid });

	ipcRenderer.on('contract:linked', (event, { name, type, file }) => {
		console.log(name, type, file)
		dispatch({
			type: UPDATE_CONTRACT,
			payload: {
				code:name,
				type,
				file
			}
		});
	});
}

/**
 * Compile Contract
 * @desc Linkes file to a specified contract
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param name <string> Contract code
 * @param type <string|optional> File type
 * @version 0.1.0
 * @return
 */
export const compile = (name, type) => dispatch => {

	if ('string' !== typeof type) type = false;

	if (type) {
		console.log("Compile "+type+" for "+name);
	} else {
		console.log("Compile all files for "+name);
	}

	ipcRenderer.send('compile:contract', { name, type });

	return;

	ipcRenderer.on('compile:complete', (event, { input, output, type }) => {
		const code = file.name;
		const outputID = generateUid(output);
		console.log("Compiled",code,"with output",outputID,"path",output);
		// Dispatch complete notification
		dispatch({type:COMPILED_CONTRACT,payload:{code,type,value:outputID}});
	});
}

export const deploy = (code, wasm, abi) => dispatch => {

	const wasmPath = wasm.path+wasm.name+'.'+wasm.extension;
	const abiPath = abi.path+abi.name+'.'+abi.extension;

	console.log("Deploy WASM",wasmPath);
	console.log("Deploy ABI",abiPath);

	ipcRenderer.send('deploy:contract', { code, files:[{uid:wasm.uid,type:'wasm',fullPath:wasmPath},{uid:abi.uid,type:'abi',fullPath:abiPath}] });

	ipcRenderer.on('deploy:success', (event, fullPath) => {
		const uid = generateUid(fullPath);
		console.log("Deployed",uid);
		dispatch({type:DEPLOYED_FILE,payload:uid});
	});

	ipcRenderer.on('deploy:complete', (event, code) => {
		dispatch({type:DEPLOYED_CONTRACT,payload:code});
	});
}

function generateUid(fullPath) {
	return createHash('sha1').update(fullPath).digest('hex');
}