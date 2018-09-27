// Modules
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
// Reducers
import fileReducer from './FileReducer';
import contractReducer from './ContractReducer';

const rootReducer = combineReducers({
	files:fileReducer,
	contracts:contractReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk));

export default store;