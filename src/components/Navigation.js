import React from 'react';
import { NavLink } from 'react-router-dom';

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
			minWidth:"36px",
			padding:"10px 16px",
			fontSize:"0.9em",
			margin:0,
			border:"none",
			borderBottom:"1px solid transparent",
			borderRadius:0,
			outline:"none",
			backgroundColor:"transparent",
			textAlign:"center",
			textDecoration:"none",
			color:"#B2B3B7",
			cursor:"pointer",
			fontWeight:500,
			border:"1px solid red",
			verticalAlign:"center"
		}

		const buttonStyleSelected = {
			borderBottom:"1px solid #ECD1A2"
		}

		const { style } = this.props;

		return (
			<div style={{flex:"none",height:"50px",backgroundColor:"#1B1B1B",display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
				<img style={{width:"34px",height:"34px",padding:0,margin:"7px"}} src="./logo.png"/>
				<NavLink to="/keys" activeStyle={buttonStyleSelected} style={buttonStyle}>Keys</NavLink>
				<NavLink to="/accounts" activeStyle={buttonStyleSelected} style={buttonStyle}>Accounts</NavLink>
				<NavLink to="/files" activeStyle={buttonStyleSelected} style={buttonStyle}>Files</NavLink>
				<NavLink to="/contracts" activeStyle={buttonStyleSelected} style={buttonStyle}>Contracts</NavLink>
				<span style={{...statusStyle,margin:"20px"}}></span>
			</div>
		)
	}
}