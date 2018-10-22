// Modules
import _ from 'lodash';
// Types
import {
	ADD_CONTRACT,
	ADD_CONTRACTS,
	UPDATE_CONTRACT,
	REFRESH_CONTRACT,
	COMPILED_CONTRACT,
	DEPLOYED_CONTRACT
} from '../types/ContractTypes';
// Keys
const KEY_ARGUMENT_ID = 'name';
const KEY_ARGUMENT_TYPE = 'type';
// Globals
const INITIAL_STATE = {}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_CONTRACT:
			const defaultData = {path:'',contract:false,entry:false,wasm:false,abi:false,modified:true,deployed:false,compiled:false};
			const existingContract2 = state[action.payload[KEY_ARGUMENT_ID]];
			const data = {...defaultData,...existingContract2,...action.payload}
			return { ...state, [action.payload[KEY_ARGUMENT_ID]]:data }
		case UPDATE_CONTRACT:
			const existingContract = state[action.payload[KEY_ARGUMENT_ID]];
			existingContract[action.payload[KEY_ARGUMENT_TYPE]] = action.payload.file;
			return { ...state, [action.payload[KEY_ARGUMENT_ID]]:existingContract };
		case ADD_CONTRACTS:
			return { ...state, ..._.mapKeys(action.payload, KEY_ARGUMENT_ID)};
		case REFRESH_CONTRACT:
			const source = state[action.payload[KEY_ARGUMENT_ID]];
			console.info("ContractReducer : Properly calculate if the wasm and abi have been updated");
			source.compiled = +new Date;
			source.modified = false;
			return { ...state, [source[KEY_ARGUMENT_ID]]:source }
		case COMPILED_CONTRACT:
			const contract = state[action.payload[KEY_ARGUMENT_ID]];
			contract[action.payload[KEY_ARGUMENT_TYPE]] = action.payload.value;
			return { ...state, [action.payload[KEY_ARGUMENT_ID]]:contract }
		case DEPLOYED_CONTRACT:
			const contract2 = state[action.payload];
			contract2.modified = false;
			contract2.deployed = +new Date;
			return { ...state, [action.payload]:contract2};
		default:
			return state;
	}
}