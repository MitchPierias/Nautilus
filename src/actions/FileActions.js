// Modules
import { ipcRenderer } from 'electron';
import createHash from 'create-hash';
import ElectronStore from 'electron-store';

const db = new ElectronStore({
	name:'files',
	defaults:{}
});
// Types
import {
	MERGE_FILE,
	FILE_ADDED,
	REMOVE_FILE,
	COMPILED_FILE,
	DEPLOYED_FILE,
	MODIFY_FILE,
	ADD_FILES
} from './FileTypes';

import {
	COMPILED_CONTRACT,
	REFRESH_CONTRACT,
	DEPLOYED_CONTRACT
} from './ContractTypes';

const HASH_LENGTH = 8;

export const loadFiles = () => dispatch => {
	
	dispatch({ type:ADD_FILES,payload:db.store });

	ipcRenderer.on('file:changed', (event, uid) => {
		console.log("Modified",uid)
		dispatch({ type:MODIFY_FILE,payload:uid});
	});
}

/**
 * Watch Directory
 * @desc Notifies the main process of a directory
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param path <string> Watch directory path
 * @version 0.1.0
 * @return
 */
export const watchDirectory = directory => dispatch => {

	ipcRenderer.send('directory:watch', directory);

	ipcRenderer.on('file:added', (event, { path, modified, size }) => {

		const dirPattern = /(.*\/).*/gi;
		const pathComponents = dirPattern.exec(path);
		const fileComponents = path.replace(pathComponents[1],'').split('.');
		
		const dir = pathComponents[1];
		const name = fileComponents[0];
		const extension = fileComponents[1];
		const uid = generateUid(path);

		dispatch({ type:MERGE_FILE,payload:{
			uid,
			name,
			extension,
			path:dir,
			file:name+'.'+extension,
			modified
		}});
	});

	ipcRenderer.on('file:changed', (event, uid) => {
		console.log("Modified",uid)
		dispatch({ type:MODIFY_FILE,payload:uid});
	});

	ipcRenderer.on('file:removed', (event, path) => {
		const uid = generateUid(path);
		dispatch({ type:REMOVE_FILE,payload:uid });
	});
}

export const compileFile = (file, type) => dispatch => {
	
	const input = file.path+file.name+'.'+file.extension;
	const output = file.path+file.name+'.'+type;

	console.log("Compile",input)

	ipcRenderer.send('compile:file', { input, output, type });

	ipcRenderer.on('compile:complete', (event, { input, output, type }) => {
		const code = file.name;
		const outputID = generateUid(output);
		console.log("Compiled",code,"with output",outputID,"path",output);
		// Dispatch complete notification
		dispatch({type:COMPILED_CONTRACT,payload:{code,type,value:outputID}});
		dispatch({type:COMPILED_FILE,payload:{uid:outputID,type,path:output}});
	});
}

export const deployFile = (code, wasm, abi) => dispatch => {

	const wasmPath = wasm.path+wasm.name+'.'+wasm.extension;
	const abiPath = abi.path+abi.name+'.'+abi.extension;

	console.log("Deploy",wasmPath)

	ipcRenderer.send('deploy:contract', { code, files:[{type:'wasm',fullPath:wasmPath},{type:'abi',fullPath:abiPath}] });

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
	return createHash('sha256').update(fullPath).digest('hex').substr(0,HASH_LENGTH).toUpperCase();
}