import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// Components
import ContractDetail from '../components/ContractDetail';
// Actions
import { watchDirectory } from '../actions/FileActions';

const cardStyle = {
	backgroundColor:"transparent",
	border:"none",
	color:"#BABABA",
	padding:"6px 10px",
	borderBottom:"2px solid #313131",
	display:"flex",
	flexDirection:"row",
	justifyContent:"flex-start",
	alignItems:"center",
	alignContent:"stretch",
	cursor:"pointer"
}

function mapStateToProps({ contracts }) {
	return { contracts };
}

class Contracts extends React.Component {

	state = {
		code:false
	}

	componentWillMount() {
		// Everytime we view or reload this component, we start a new observer
		this.props.watchDirectory('/Users/mitch/Contracts/Nautilus/contracts');
		console.log(this.props.contracts)
	}

	didSelectContract({ code }) {
		this.setState({ code });
	}
	
	render() {

		const { style } = this.props;
		const { code } = this.state;
		const selected = this.props.contracts[code] || {};
		console.log(selected)

		return (
			<section style={{flex:"10 5",display:"flex",flexDirection:"row",justifyContent:"space-around",alignItems:"stretch",alignContent:"stretch"}}>
				<section style={{backgroundColor:"#252525",flex:"3 5",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"stretch",alignContent:"flex-start",border:"none",borderRight:"1px solid #313131"}}>
					<h2>Contracts</h2>
					{Object.values(this.props.contracts).map((contract, idx) => {
						const updated = (contract.modified)?"#747579":"#ECD1A2";
						return (
							<div key={idx} style={cardStyle} onClick={this.didSelectContract.bind(this, contract)}>
								<span style={{width:"8px",height:"8px",margin:"5px",backgroundColor:updated,display:"inline-block",borderRadius:"50%"}}></span>
								<span style={{color:"#747579",fontWeight:600,margin:"5px"}}>{contract.code}</span>
							</div>
						)
					})}
				</section>
				<ContractDetail code={selected.code} contract={selected.contract} abi={selected.abi} wasm={selected.wasm} selected={selected.modified}/>
			</section>
		)
	}
}

export default connect(mapStateToProps, {watchDirectory})(Contracts);