// Modules
import _ from 'lodash';
// Types
import {
	ADD_CONTRACT,
	REFRESH_CONTRACT
} from '../actions/ContractTypes';
// Globals
const INITIAL_STATE = {
	'game': {
		code:'game',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		entry:'game.cpp',
		wasm:'3556EE3097',
		abi:'0C26A9DD64',
		compiled:1538049274593,
		deployed:false
	},
	'members': {
		code:'members',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		entry:'',
		wasm:'',
		abi:'',
		compiled:1538049341144,
		deployed:false
	},
	'syndicate': {
		code:'syndicate',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		entry:'',
		wasm:'',
		abi:'',
		compiled:1538049362882,
		deployed:false
	}
}

const KEY_ARGUMENT_ID = 'code';

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_CONTRACT:
			return { ...state, ..._.mapKeys(action.payload, KEY_ARGUMENT_ID)};
		case REFRESH_CONTRACT:
			const source = state[action.payload.code];
			console.info("ContractReducer : Properly calculate if the wasm and abi have been updated");
			source.compiled = +new Date;
			return { ...state, [source[KEY_ARGUMENT_ID]]:source }
		default:
			return state;
	}
}