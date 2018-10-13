import React from 'react';
import { string, array } from 'prop-types';
import { connect } from 'react-redux';
// Actions
import { convertAccount } from '../actions/AccountActions';

class AccountDetail extends React.Component {

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

	didSelectMakeContract(event) {
		event.preventDefault();
		console.log("Convert account '"+this.props.code+"' too contract")
		this.props.convertAccount(this.props.code);
	}
	
	render() {

		return (
			<section style={{flex:"8 2",backgroundColor:"#252525",color:"#BABABA",padding:"12px",...this.props.style}}>
				<div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
					<span>{this.props.code} Auth</span>
					<button onClick={this.didSelectMakeContract.bind(this)}>Make contract</button>
				</div>
				<h4>Keys</h4>
				<h4>Accounts</h4>
				<h4>Waits??</h4>
			</section>
		)
	}
}

export default connect(null, {convertAccount})(AccountDetail);