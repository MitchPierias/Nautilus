import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reducers/index';
// CSS
import './index.css';
// Components
import Navigation from './views/Navigation.js';
import Routes from './views';

const App = (
	<Provider store={store}>
		<Router basename="/">
			<section style={{height:"100%",display:"flex",flexDirection:"row",justifyContent:"space-around",alignItems:"stretch",alignContent:"stretch"}}>
				<Route component={Navigation}/>
				<Routes/>
			</section>
		</Router>
	</Provider>
)

ReactDOM.render(App, document.getElementById('root'));