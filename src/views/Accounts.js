import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import EOS, { modules } from 'eosjs';
const { ecc } = modules;
// Components
import AccountDetail from '../components/AccountDetail';
// Actions
import { loadAccounts, createAccount, getCode } from '../actions/AccountActions';

function mapStateToProps({ accounts }) {
	return { accounts };
}

const mapDispatchToProps = {
	loadAccounts,
	createAccount,
	getCode
}

class Accounts extends React.Component {

	state = {
		name:null,
		selected:false
	}

	static defaultProps = {
		accounts:{}
	}

	static propTypes = {
		accounts:object
	}

	componentWillMount() {
		this.props.loadAccounts();
		this.props.getCode('game')
	}

	/**
	 * Name Field Changed
	 * @desc Fires when the account `name` input value changes
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @param event <onchange> Input value onchange event
	 * @version 1.0.0
	 * @return
	 */
	didChangeNameField(event) {
		const name = event.target.value;
		this.setState({ name });
	}

	didSelectCreateAccount(event) {
		console.log("Create account")
		return;
		event.preventDefault();
		const illegalChars = /[\W\d\_]/gi;
		const { name } = this.state;
		if (name && 'string' === typeof name && name.length > 0) {
			if (illegalChars.test(name)) {
				alert("Illegal chars");
			} else {
				this.props.createAccount(name.toLowerCase());
				event.target.value = '';
			}
		} else {
			alert("A valid name is required");
		}
	}

	didSelectAccount(name) {
		if (name === this.state.selected) name = false;
		this.setState({ selected:name });
	}
	
	render() {

		const { selected } = this.state;

		const accountList = Object.values(this.props.accounts).map((account, idx) => 
			<AccountListItem key={idx} name={account.name} selected={(selected===account.name)} onClick={this.didSelectAccount.bind(this)}/>
		);

		return (
			<div style={{flex:"3 10",color:"#EDEDE5",height:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:"12px",margin:0}}>
				<aside style={{flex:"3 2",backgroundColor:"transparent",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",alignContent:"flex-start",border:"none",borderRight:"1px solid #212121",padding:0,margin:0}}>
					{Object.values(this.props.accounts).map((account, idx) => {
						return <AccountListItem key={idx} name={account.name} onClick={this.didSelectAccount.bind(this)} selected={(this.state.selected && this.state.selected === account.name)} notifications={((idx==1)?3:false)}/>
					})}
					<AccountListItem name="Create Contract" onClick={this.didSelectCreateAccount.bind(this)} selected={false}/>
				</aside>
				<AccountDetail name={this.state.selected}/>
			</div>
		)
	}
}

function AccountListItem(props) {

	const statusColor = (props.selected) ? "#ECD1A2" : "#424242";

	const accountListItemStyle = {
		backgroundColor:"transparent",
		border:"none",
		color:(props.selected)?"#E0E0E0":"#BABABA",
		display:"flex",
		flexDirection:"row",
		justifyContent:"flex-start",
		alignItems:"center",
		alignContent:"stretch",
		cursor:"pointer",
		border:"none",
		borderLeftWidth:"2px",
		borderLeftStyle:"solid",
		borderLeftColor:statusColor,
		margin:"0px 4px",
		padding:"6px 16px",
		display:"flex",
		flexDirection:"row",
		justifyContent:"space-between",
		alignItems:"stretch",
		alignContent:"stretch"
	}

	return (
		<div style={accountListItemStyle} onClick={props.onClick.bind(this, props.name)}>
			<h3 style={{fontSize:"1em",color:(props.selected)?"#BDBDBD":"#747579"}}>{props.name.toCamelCase()}</h3>
			<span style={{fontSize:"0.7em",fontWeight:600,backgroundColor:"transparent",color:"#ECD1A2"}}>{props.notifications}</span>
		</div>
	)
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);