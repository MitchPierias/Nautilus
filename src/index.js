import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './reducers/index';
// CSS
import './index.css';
// Components
import Navigation from './components/Navigation.js';
import Controllers from './views';

const App = (
	<Provider store={store}>
		<Router basename="/">
			<Fragment>
				<Route component={Navigation}/>
				<Controllers/>
			</Fragment>
		</Router>
	</Provider>
)

ReactDOM.render(App, document.getElementById('root'));