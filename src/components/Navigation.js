import React from 'react';

export default class Navigation extends React.Component {

	state = {
		status:0
	}

	didSelectKeys(event) {
		event.preventDefault();
		this.props.history.push('/keys');
	}

	didSelectAccounts(event) {
		event.preventDefault();
		this.props.history.push('/accounts');
	}

	didSelectFiles(event) {
		event.preventDefault();
		this.props.history.push('/files');
	}

	didSelectContracts(event) {
		event.preventDefault();
		this.props.history.push('/contracts');
	}
	
	render() {

		const statusStyle = {
			backgroundColor:(this.state.status>0)?'#00E676':'#FF5252',
			borderRadius:"50%",
			width:"10px",
			height:"10px",
			display:"inline-block"
		}

		const buttonStyle = {
			width:"36px",
			height:"36px",
			margin:"2.5px",
			border:"2px solid #ECD1A2",
			borderRadius:"50%",
			outline:"none",
			backgroundColor:"transparent",
			textAlign:"center",
			verticalAlign:"center"
		}

		const { style } = this.props;

		return (
			<div style={{flex:"none",width:"55px",backgroundColor:"#1B1B1B",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",alignContent:"stretch",padding:"2.5px"}}>
				<img style={{width:"40px",height:"40px",padding:0,margin:"5px"}} src="./logo.png"/>
				<button onClick={this.didSelectKeys.bind(this)} style={buttonStyle}>K</button>
				<button onClick={this.didSelectAccounts.bind(this)} style={buttonStyle}>A</button>
				<button onClick={this.didSelectFiles.bind(this)} style={buttonStyle}>F</button>
				<button onClick={this.didSelectContracts.bind(this)} style={buttonStyle}>C</button>
				<span style={{...statusStyle,margin:"20px"}}></span>
			</div>
		)
	}
}