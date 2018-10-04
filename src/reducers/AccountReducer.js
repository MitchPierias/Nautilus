// Modules
import _ from 'lodash';
// Types
import {
	ADD_ACCOUNT,
	REMOVE_ALL_ACCOUNTS
} from '../actions/AccountTypes';
// Globals
const INITIAL_STATE = {};
const KEY_ARGUMENT = 'uuid';

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_ACCOUNT:
			return { ...state, [action.payload[KEY_ARGUMENT]]:action.payload };
		case REMOVE_ALL_ACCOUNTS:
			return INITIAL_STATE;
		default:
			return state;
	}
}