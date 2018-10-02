// Modules
import { ipcRenderer, remote } from 'electron';
import createHash from 'create-hash';
const { dialog } = remote;
// Types
import {
	MERGE_FILE,
	FILE_ADDED,
	REMOVE_FILE,
	COMPILED_FILE,
	DEPLOYED_FILE
} from './FileTypes';

import {
	REFRESH_CONTRACT,
	DEPLOYED_CONTRACT
} from './ContractTypes';

const HASH_LENGTH = 6;

/**
 * Watch Directory
 * @desc Notifies the main process of a directory
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param path <string> Watch directory path
 * @version 0.1.0
 * @return
 */
export const watchDirectory = directory => dispatch => {

	if (!directory && 'string' === typeof directory) {
		dialog.showOpenDialog({
			properties: ['openDirectory']
		}, (fileNames) => {
			console.log(fileNames)
			if (!fileNames || fileNames.length <= 0) return;
			ipcRenderer.send('directory:watch', fileNames[0]);
		});
	} else {
		ipcRenderer.send('directory:watch', directory);
	}

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

	ipcRenderer.on('file:removed', (event, path) => {
		const uid = generateUid(path);
		dispatch({ type:REMOVE_FILE,payload:uid });
	});
}

export const compileFile = (file, type) => dispatch => {
	
	const input = file.path+file.name+'.'+file.extension;
	const output = file.path+file.name+'.'+type;

	ipcRenderer.send('compile:file', { input, output, type });

	ipcRenderer.on('compile:complete', (event, { input, output, type }) => {
		const code = file.name;
		const outputID = generateUid(output);
		console.log("Compiled",code,"with outpute",outputID,"path",output);
		// Dispatch complete notification
		dispatch({type:COMPILED_FILE,payload:{code,type,value:outputID}});
	});
}

export const deployFile = (code, wasm, abi) => dispatch => {

	const wasmPath = wasm.path+wasm.name+'.'+wasm.extension;
	const abiPath = abi.path+abi.name+'.'+abi.extension;

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

function generateUid(fullPath, dateCreated) {
	return createHash('sha256').update(fullPath+':'+dateCreated).digest('hex').substr(0,HASH_LENGTH).toUpperCase();
}