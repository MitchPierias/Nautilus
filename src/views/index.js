import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Components
import Accounts from './Accounts';
import Files from './Files';
import Contracts from './Contracts';

export default function Routes(props) {
	return(
		<Switch>
			<Route path="/accounts" component={Accounts}/>
			<Route path="/files" component={Files}/>
			<Route path="/contracts" component={Contracts}/>
			<Route component={Contracts}/>
		</Switch>
	)
}