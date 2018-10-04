import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
			<section className="full" style={{height:"100%",width:"100%",display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"stretch",alignContent:"stretch",border:"1px solid red"}}>
				<Route component={Navigation}/>
				<Routes/>
			</section>
		</Router>
	</Provider>
)

ReactDOM.render(App, document.getElementById('root'));