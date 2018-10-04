// Modules
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// Reducers
import keyReducer from './KeyReducer';
import fileReducer from './FileReducer';
import contractReducer from './ContractReducer';
import accountReducer from './AccountReducer';

const rootReducer = combineReducers({
	keys:keyReducer,
	files:fileReducer,
	contracts:contractReducer,
	accounts:accountReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

export default store;