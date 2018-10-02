// Modules
import _ from 'lodash';
// Types
import {
	ADD_CONTRACT,
	REFRESH_CONTRACT,
	DEPLOYED_CONTRACT
} from '../actions/ContractTypes';

import {
	COMPILED_FILE
} from '../actions/FileTypes';
// Globals
const INITIAL_STATE = {
	'game': {
		code:'game',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		contract:'540C8F',
		entry:'game.cpp',
		wasm:'74B3D6',
		abi:'FFE31A',
		modified:true,
		compiled:1538049274593,
		deployed:false
	},
	'members': {
		code:'members',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		contract:'D3E168',
		entry:'members.cpp',
		wasm:false,
		abi:false,
		modified:true,
		compiled:1538049341144,
		deployed:false
	},
	'syndicate': {
		code:'syndicate',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		contract:'665BE6',
		entry:'syndicate.cpp',
		wasm:false,
		abi:false,
		modified:true,
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
			source.modified = false;
			return { ...state, [source[KEY_ARGUMENT_ID]]:source }
		case COMPILED_FILE:
			const contract = state[action.payload[KEY_ARGUMENT_ID]];
			contract[action.payload.type] = action.payload.value;
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