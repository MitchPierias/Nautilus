import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import EOS, { modules } from 'eosjs';
const { ecc } = modules;
// Components
import AccountDetail from '../components/AccountDetail';
// Actions
import { loadAccounts, createAccount } from '../actions/AccountActions';

const cardStyle = {
	backgroundColor:"transparent",
	border:"none",
	color:"#BABABA",
	padding:"10px",
	borderBottom:"2px solid #313131",
	display:"flex",
	flexDirection:"row",
	justifyContent:"flex-start",
	alignItems:"center",
	alignContent:"stretch",
	cursor:"pointer"
}

function mapStateToProps({ accounts }) {
	return { accounts };
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

	didSelectAccount(code) {
		if (code === this.state.selected) code = false;
		this.setState({ selected:code });
	}
	
	render() {

		const menuStyle = {
			listStyle:"none",
			textAlign:"right",
			padding:"8px 26px"
		}

		const menuItemStyle = {
			fontSize:"9px",
			fontWeight:500,
			textTransform:"uppercase",
			padding:"26px 0px 10px 0px",
			borderWidth:0,
			borderStyle:"solid",
			borderColor:"rgba(255,255,255,0.2)",
			borderBottomWidth:"2px"
		}

		const accountList = Object.values(this.props.accounts).map((account, idx) => 
			<div key={idx} style={cardStyle} onClick={this.didSelectAccount.bind(this, account.uuid)}>
				<span>{account.name}</span>
			</div>
		);

		return (
			<div style={{flex:"3 10",backgroundColor:"rgba(33,33,33,0.8)",color:"#EDEDE5",height:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
				<aside style={{flex:"6 10",borderRight:"1px solid #313131",padding:"8px"}}>
					<h2>Accounts</h2>
					<span style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
						<input id="name" name="name" type="text" defaultValue={this.state.name} placeholder="Account name" onChange={this.didChangeNameField.bind(this)} style={{flex:"6 4"}}/>
						<button onClick={this.didSelectCreateAccount.bind(this)} style={{flex:"none"}}>Create Account</button>
					</span>
					<div>
						{accountList}
					</div>
				</aside>
				{(this.state.selected)?<AccountDetail code={this.state.selected}/>:null}
			</div>
		)
	}
}

export default connect(mapStateToProps, {loadAccounts,createAccount})(Accounts);