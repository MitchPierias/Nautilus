import React from 'react';
import { getInfo } from '../actions/AccountActions';

export default class Header extends React.Component {

	state = {
		status:0
	}

	componentDidMount() {
		const info = getInfo();
		console.log(info);
	}
	
	render() {

		const statusStyle = {
			backgroundColor:(this.state.status>0)?'#00E676':'#FF1744',
			borderRadius:"50%",
			width:"10px",
			height:"10px",
			display:"inline-block"
		}

		const { style } = this.props;

		return (
			<aside style={{width:"55px",backgroundColor:"#1B1B1B",display:"flex",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",alignContent:"stretch",padding:"2.5px"}}>
				<span><h1 style={{color:"#ECD1A2",padding:0,margin:0,fontSize:"32px"}}>N</h1></span>
				<button style={{width:"36px",height:"36px",margin:"2.5px",border:"2px solid #ECD1A2",borderRadius:"50%",outline:"none",backgroundColor:"transparent"}}></button>
				<button style={{width:"36px",height:"36px",margin:"2.5px",border:"2px solid #ECD1A2",borderRadius:"50%",outline:"none",backgroundColor:"transparent"}}></button>
				<button style={{width:"36px",height:"36px",margin:"2.5px",border:"2px solid #ECD1A2",borderRadius:"50%",outline:"none",backgroundColor:"transparent"}}></button>
				<span style={{...statusStyle,margin:"0px 5px"}}></span>
			</aside>
		)
	}
}