import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reducers/index';
// CSS
import './index.css';
// Components
import Navigation from './components/Navigation.js';
import Routes from './views';

const App = (
	<Provider store={store}>
		<Router basename="/">
			<div style={{position:"absolute",width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",alignContent:"stretch",margin:0,padding:0}}>
				<Route component={Navigation}/>
				<Routes/>
			</div>
		</Router>
	</Provider>
)

ReactDOM.render(App, document.getElementById('root'));