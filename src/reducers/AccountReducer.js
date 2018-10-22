// Modules
import _ from 'lodash';
// Types
import {
	ADD_ACCOUNT,
	ADD_ACCOUNTS,
	REMOVE_ALL_ACCOUNTS
} from '../types/AccountTypes';
// Globals
const INITIAL_STATE = {};
const KEY_ARGUMENT = 'name';

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_ACCOUNT:
			return { ...state, [action.payload[KEY_ARGUMENT]]:action.payload };
		case ADD_ACCOUNTS:
			return { ...state, ..._.mapKeys(action.payload, KEY_ARGUMENT)};
		case REMOVE_ALL_ACCOUNTS:
			return INITIAL_STATE;
		default:
			return state;
	}
}