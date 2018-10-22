import React from 'react';
import { NavLink } from 'react-router-dom';
// Colors
import {
	STATUS_COLOR_DEFAULT,
	STATUS_COLOR_FAILED
} from '../globals/colors';

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
			backgroundColor:(this.state.status>0)?STATUS_COLOR_DEFAULT:STATUS_COLOR_FAILED,
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
			borderBottom:"1px solid #212121",
			borderRadius:0,
			outline:"none",
			backgroundColor:"transparent",
			textAlign:"center",
			textDecoration:"none",
			color:"#B2B3B7",
			cursor:"pointer",
			fontWeight:500,
			verticalAlign:"center",
			display:"flex",
			flexDirection:"row",
			justifyContent:"center",
			alignContent:"center",
			alignItems:"center"
		}

		const buttonStyleSelected = {
			color:"#FFFFFF",
			borderBottom:"1px solid #ECD1A2"
		}

		const { style } = this.props;

		return (
			<nav style={{flex:"none",height:"50px",backgroundColor:"transparent",display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
				<img style={{width:"34px",height:"34px",padding:0,margin:"7px"}} src="./logo.png"/>
				<NavLink to="/keys" activeStyle={buttonStyleSelected} style={buttonStyle}>Keys</NavLink>
				<NavLink to="/accounts" activeStyle={buttonStyleSelected} style={buttonStyle}>Accounts</NavLink>
				<NavLink to="/files" activeStyle={buttonStyleSelected} style={buttonStyle}>Files</NavLink>
				<NavLink to="/contracts" activeStyle={buttonStyleSelected} style={buttonStyle}>Contracts</NavLink>
				<span style={{flex:"10 5",borderBottom:"1px solid #212121",display:"flex",flexDirection:"row",justifyContent:"flex-end",alignContent:"center",alignItems:"center",marginRight:"10px"}}>
					<span style={{fontSize:"0.75em"}}>Network Status</span>
					<span style={{...statusStyle,margin:"10px"}}></span>
				</span>
			</nav>
		)
	}
}