// Modules
import _ from 'lodash';
// Types
import {
	ADD_KEY
} from '../types/KeyTypes';
// Globals
const INITIAL_STATE = [
	"EOS5vCdftk4hxj5ygrH6ZK8jkgoo1sm2JoppKvikATAN74b9Bfs2F",
	"EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
	"EOS72X3Mfco2nqLXwTr35bBhx71KKChN7kPqHAXeJ3jR8AqVHgjUU",
	"EOS7SJwUKkrCt5nEuVCv19ojE4ykKjoRN51fpQSe5rifS7iojWtqE"
];

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_KEY:
			return { ...state, [action.payload[KEY_ARGUMENT]]:action.payload };
		default:
			return state;
	}
}