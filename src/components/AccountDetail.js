import React from 'react';
import { oneOfType, string, array, bool } from 'prop-types';
import { connect } from 'react-redux';
// Actions
import { convertAccount } from '../actions/AccountActions';

const mapDispatchToProps = {
	convertAccount
}

class AccountDetail extends React.Component {

	static defaultProps = {
		name:'',
		keys:[],
		accounts:[],
		waits:[]
	}

	static propTypes = {
		name:oneOfType([bool,string]),
		keys:array,
		accounts:array,
		waits:array
	}

	didSelectMakeContract(event) {
		event.preventDefault();
		console.log("Convert account '"+this.props.name+"' too contract")
		this.props.convertAccount(this.props.name);
	}
	
	render() {

		return (
			<section style={{flex:"8 2",backgroundColor:"transparent",color:"#BABABA",padding:"12px",...this.props.style}}>
				<div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
					<span>{(this.props.name||'').toCamelCase()} Auth</span>
					<button onClick={this.didSelectMakeContract.bind(this)} disabled={(!this.props.name)}>Make contract</button>
				</div>
				<h4>Keys</h4>
				<h4>Accounts</h4>
				<h4>Waits??</h4>
			</section>
		)
	}
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

export default connect(null, mapDispatchToProps)(AccountDetail);