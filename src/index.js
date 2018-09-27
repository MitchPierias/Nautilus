import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './reducers/index';
// CSS
import './index.css';
// Components
import Header from './views/Header.js';
import Accounts from './views/Accounts';
import Files from './views/Files';
import ContractDetail from './views/ContractDetail';

const App = (
	<Provider store={store}>
		<section style={{display:"flex",flexDirection:"row",justifyContent:"space-around",alignItems:"stretch",alignContent:"stretch"}}>
			<Header style={{flex:"none"}}/>
			<Files style={{backgroundColor:"#232323",color:"#E1C79B"}}/>
			<ContractDetail style={{backgroundColor:"transparent"}}/>
		</section>
	</Provider>
)

ReactDOM.render(App, document.getElementById('root'));