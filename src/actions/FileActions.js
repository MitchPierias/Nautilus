// Modules
import { ipcRenderer, remote } from 'electron';
const { dialog } = remote;
// Types
import {
	FILE_ADDED,
	COMPILED_FILE
} from './FileTypes';

import {
	REFRESH_CONTRACT
} from './ContractTypes';

/**
 * Watch Directory
 * @desc Notifies the main process of a directory
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param path <string> Watch directory path
 * @version 0.1.0
 * @return
 */
export const watchDirectory = () => {
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (fileNames) => {
		if (!filenames || fileNames.length <= 0) return;
		ipcRenderer.send('directory:watch', fileNames[0]);
	});

	ipcRenderer.on('directory:file', (event, path) => {
		console.log('File', path, 'has been added from actions');
	})
}

export const compileFile = file => dispatch => {
	console.log("Compile file", file);

	ipcRenderer.send('compile:file',file);

	ipcRenderer.on('compile:complete', (event, file) => {
		
		dispatch({type:COMPILED_FILE,payload:file});

		dispatch({type:REFRESH_CONTRACT,payload:{code:file.contract}});
	});
}