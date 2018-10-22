// Modules
import _ from 'lodash';
// Types
import {
	MERGE_FILE,
	ADD_FILES,
	UPDATE_FILE,
	REMOVE_FILE,
	REMOVE_ALL_FILES,
	COMPILED_FILE,
	DEPLOYED_FILE,
	MODIFY_FILE
} from '../types/FileTypes';
// Globals
const INITIAL_STATE = {};
const ARGUMENT_KEY = 'uid';
const FILE_SCHEMA = {
	uid:'',
	name:'',
	extension:'',
	path:'',
	file:'',
	source:'',
	modified:false,
	contract:'',
	dependencies:[],
	version:'',
	deployed:''
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_FILE:
			return { ...state, [action.payload[ARGUMENT_KEY]]: action.payload };
		case MERGE_FILE:
			let file = action.payload;
			const existing = state[file[ARGUMENT_KEY]] || FILE_SCHEMA;
			state= { ...state, [action.payload[ARGUMENT_KEY]]: {...existing,...file} };
			return state;
		case ADD_FILES:
			return { ...state, ..._.mapKeys(action.payload, ARGUMENT_KEY)};
		case REMOVE_FILE:
			return _.omit(state, action.payload[ARGUMENT_KEY]);
		case REMOVE_ALL_FILES:
			return INITIAL_STATE;
		case COMPILED_FILE:
			const existing2 = state[action.payload];
			console.log("Compiled", action.payload,"Existing",existing2);
			//return { ...state, [action.payload[ARGUMENT_KEY]]:action.payload }
		case DEPLOYED_FILE:
			let file2 = state[action.payload];
			if (file2) {
				file2.deployed = +new Date;
				file2.modified = false;
			}
			return { ...state, [action.payload]:file2 };
		case MODIFY_FILE:
			return { ...state, [action.payload[ARGUMENT_KEY]]:action.payload};
		default:
			return state;
	}
}