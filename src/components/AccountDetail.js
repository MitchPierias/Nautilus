import React from 'react';
import { string, array } from 'prop-types';

export default class AccountDetail extends React.Component {

	static defaultProps = {
		code:'',
		keys:[],
		accounts:[],
		waits:[]
	}

	static propTypes = {
		code:string,
		keys:array,
		accounts:array,
		waits:array
	}
	
	render() {

		return (
			<section style={{flex:"8 2",backgroundColor:"#252525",color:"#BABABA",padding:"12px",...this.props.style}}>
				<h2>{this.props.code} Auth</h2>
				<h4>Keys</h4>
				<h4>Accounts</h4>
				<h4>Waits??</h4>
			</section>
		)
	}
}