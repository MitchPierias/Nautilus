import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// Components
import ContractDetail from '../components/ContractDetail';
// Actions
import { loadContracts } from '../actions/ContractActions';
import { watchDirectory } from '../actions/FileActions';

function mapStateToProps({ contracts }) {
	return { contracts };
}

const mapDispatchToProps = {
	loadContracts,
	watchDirectory
}

class Contracts extends React.Component {

	state = {
		name:false
	}

	componentWillMount() {
		// Everytime we view or reload this component, we start a new observer
		this.props.watchDirectory('/Users/mitch/Contracts/Nautilus/contracts');
		this.props.loadContracts();
	}

	didSelectContract({ name }) {
		this.setState({ name });
	}

	didSelectCreateContract() {
		console.log("Create new contract");
	}
	
	render() {

		const { style } = this.props;
		const { name } = this.state;
		const selected = this.props.contracts[name] || {};

		return (
			<section style={{flex:"10 5",display:"flex",flexDirection:"row",justifyContent:"space-around",alignItems:"stretch",alignContent:"stretch",padding:"12px"}}>
				<aside style={{flex:"3 2",backgroundColor:"transparent",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",alignContent:"flex-start",border:"none",borderRight:"1px solid #212121",padding:0,margin:0}}>
					<ContractListItem name="+ Create Contract" onClick={this.didSelectCreateContract.bind(this)} selected={false}/>
					{Object.values(this.props.contracts).map((contract, idx) => {
						return <ContractListItem key={idx} name={contract.name} modified={contract.modified} onClick={this.didSelectContract.bind(this, contract)} selected={(this.state.name && this.state.name === contract.name)} notifications={((idx==1)?3:false)}/>
					})}
				</aside>
				<ContractDetail name={selected.name} contract={selected.contract} abi={selected.abi} wasm={selected.wasm} selected={selected.modified}/>
			</section>
		)
	}
}

function ContractListItem(props) {

	const statusColor = (props.selected) ? "#ECD1A2" : "#424242";

	const contractListItemStyle = {
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
		<div style={contractListItemStyle} onClick={props.onClick.bind(this)}>
			<h3 style={{fontSize:"1em",color:(props.selected)?"#BDBDBD":"#747579"}}>{props.name.toCamelCase()}</h3>
			<span style={{fontSize:"0.7em",fontWeight:600,backgroundColor:"transparent",color:"#ECD1A2"}}>{props.notifications}</span>
		</div>
	)
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

export default connect(mapStateToProps, mapDispatchToProps)(Contracts);