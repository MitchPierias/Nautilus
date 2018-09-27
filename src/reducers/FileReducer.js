// Modules
import _ from 'lodash';
import createHash from 'create-hash';
// Types
import {
	ADD_FILES,
	UPDATE_FILE,
	REMOVE_FILE,
	REMOVE_ALL_FILES
} from '../actions/types';

import {
	COMPILED_FILE
} from '../actions/FileTypes';
// Globals
const INITIAL_STATE = {
	'926A66B24E': {
		id:'926A66B24E',
		contract:'game',
		type:'contract',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		file:'game.cpp',
		dependencies:['3556EE3097','0C26A9DD64'],
		modified:true,
		version:'version.hash',
		deployed:'version.hash'
	},
	'3556EE3097': {
		id:'3556EE3097',
		contract:'game',
		type:'wasm',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		file:'game.wasm',
		source:'game.cpp',
		dependencies:[],
		modified:true,
		version:'version.hash',
		deployed:'version.hash'
	},
	'0C26A9DD64': {
		id:'0C26A9DD64',
		contract:'game',
		type:'abi',
		path:'/Users/mitch/Contracts/Nautilus/contracts/',
		file:'game.abi',
		source:'game.cpp',
		dependencies:[],
		modified:true,
		version:'version.hash',
		deployed:'version.hash'
	}
};
const KEY_ARGUMENT_ID = 'id';

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE_FILE:
			return { ...state, [action.payload[KEY_ARGUMENT_ID]]: action.payload };
		case ADD_FILES:
			return { ...state, ..._.mapKeys(action.payload, KEY_ARGUMENT_ID)};
		case REMOVE_FILE:
			return _.omit(state, action.payload[KEY_ARGUMENT_ID]);
		case REMOVE_ALL_FILES:
			return INITIAL_STATE;
		case COMPILED_FILE:
			return { ...state, [action.payload[KEY_ARGUMENT_ID]]:action.payload }
		default:
			return state;
	}
}