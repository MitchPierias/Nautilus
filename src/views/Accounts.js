import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
// Components
import AccountDetail from '../components/AccountDetail';
import AccountDetailCreate from '../components/AccountDetailCreate';
// Actions
import { loadAccounts, getCode } from '../actions/AccountActions';

function mapStateToProps({ accounts }) {
	return { accounts };
}

const mapDispatchToProps = {
	loadAccounts,
	getCode
}

class Accounts extends React.Component {

	state = {
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

	didSelectAccount(name) {
		if (name === this.state.selected || name === '') name = false;
		this.setState({ selected:name });
	}
	
	render() {

		const { selected } = this.state;

		return (
			<div style={{flex:"3 10",color:"#EDEDE5",height:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:"12px",margin:0}}>
				<aside style={{flex:"3 2",backgroundColor:"transparent",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",alignContent:"flex-start",border:"none",borderRight:"1px solid #212121",padding:0,margin:0}}>
					<AccountListItem title="+ Create Account" name={false} onClick={this.didSelectAccount.bind(this)} selected={!(selected && selected !== '')}/>
					{Object.values(this.props.accounts).map((account, idx) => {
						return <AccountListItem key={idx} title={account.name} name={account.name} onClick={this.didSelectAccount.bind(this)} selected={(selected && selected === account.name)} notifications={((idx==1)?3:false)}/>
					})}
				</aside>
				<section style={{flex:"8 2",backgroundColor:"transparent",color:"#BABABA",padding:"12px"}}>
					{(selected && selected !== '')
						? <AccountDetail name={selected}/>
						: <AccountDetailCreate/>
					}
				</section>
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
		justifyContent:"space-between",
		alignItems:"center",
		alignContent:"stretch",
		cursor:"pointer",
		border:"none",
		borderLeftWidth:"2px",
		borderLeftStyle:"solid",
		borderLeftColor:statusColor,
		margin:"0px 4px",
		padding:"6px 16px"
	}

	return (
		<div style={accountListItemStyle} onClick={props.onClick.bind(this, props.name)}>
			<h3 style={{fontSize:"1em",color:(props.selected)?"#BDBDBD":"#747579"}}>{(props.title||'').toCamelCase()}</h3>
			<span style={{fontSize:"0.7em",fontWeight:600,backgroundColor:"transparent",color:"#ECD1A2"}}>{props.notifications}</span>
		</div>
	)
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);