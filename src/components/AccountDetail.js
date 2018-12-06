import React from 'react';
import { oneOfType, string, array, bool, object } from 'prop-types';
import { connect } from 'react-redux';
// Components
import AccountDetailPermission from './Account/AccountDetailPermission';
import AccountDetailIndicator from './Account/AccountDetailIndicator';
import AccountDetailPermissionCreate from './Account/AccountDetailPermissionCreate';
// Actions
import { getAccount } from '../actions/AccountActions';
// Colors
import {
	STATUS_COLOR_DEFAULT,
	STATUS_COLOR_MODIFIED,
	STATUS_COLOR_COMPILED,
	STATUS_COLOR_DEPLOYED,
	STATUS_COLOR_FAILED
} from '../globals/colors';

function mapStateToProps({ accounts }) {
	return { accounts };
}

const mapDispatchToProps = {
	getAccount
}

class AccountDetail extends React.Component {

	static defaultProps = {
		name:false
	}

	static propTypes = {
		name:oneOfType([bool,string])
	}

	componentDidMount() {
		this.props.getAccount(this.props.name);
	}

	componentWillReceiveProps(nextProps) {
		if ('string' === typeof nextProps.name && nextProps.name !== this.props.name) {
			this.props.getAccount(nextProps.name);
		}
	}

	didUpdateAuth(event) {
		console.log("Update auth", event)
	}
	
	render() {

		const account = this.props.accounts[this.props.name];

		return (
			<div>
				<div style={{display:"flex",flexDirection:"row",justifyContent:"space-around",padding:0,margin:"12px 0px"}}>
					<AccountDetailIndicator title="Ram" value={(account.ram||{}).usage} max={(account.ram||{}).quota}/>
					<AccountDetailIndicator title="CPU" value={152} max={784}/>
					<AccountDetailIndicator title="Net" value={10} max={17}/>
				</div>
				<span style={{display:"flex",flexDirection:"row",justifyContent:"space-between",padding:0,margin:0}}>
					<h4>Permissions</h4>
					<button>Add permission</button>
				</span>
				{(account.permissions||[]).map((permission, idx) => (
					<AccountDetailPermission key={idx} account={this.props.name} name={permission.perm_name} parent={permission.parent} auth={permission.required_auth} style={{margin:"12px 0px"}} onUpdate={this.didUpdateAuth.bind(this)}/>
				))}
			</div>
		)
	}
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetail);