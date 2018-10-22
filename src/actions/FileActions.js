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
} from '../types/FileTypes';

/**
 * Load Files
 * @desc Loads the cached files into memory
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @version 0.1.0
 * @return
 */
export const loadFiles = () => dispatch => {
	// Add cached files
	dispatch({ type:ADD_FILES,payload:db.store });
	// Subscribe to file changes
	ipcRenderer.on('file:changed', (event, fullPath) => {
		
		const uid = generateUid(fullPath);
		const file = db.get(uid);
		dispatch({ type:MODIFY_FILE,payload:file });

		let updatedFileNotification = new Notification('File changed', {
			body:"The file at '"+fullPath+"' was recently changed"
		});
	});

	ipcRenderer.on('file:removed', (event, fullPath) => {
		const uid = generateUid(fullPath);
		dispatch({ type:REMOVE_FILE,payload:{ uid } });
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

	/* ipcRenderer.on('file:changed', (event, uid) => {
		console.log("Modified",uid)
		dispatch({ type:MODIFY_FILE,payload:uid});
	}); */

	ipcRenderer.on('file:removed', (event, path) => {
		const uid = generateUid(path);
		dispatch({ type:REMOVE_FILE,payload:uid });
	});
}

function generateUid(fullPath) {
	return createHash('sha1').update(fullPath).digest('hex');
}