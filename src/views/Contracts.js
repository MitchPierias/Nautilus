import React from 'react';
import fs from 'fs';

const cardStyle = {
	backgroundColor:"#3D4147",
	border:"1px solid #2F3136",
	padding:"5px",
	margin:"5px",
	borderRadius:"5px"
}

export default class Contracts extends React.Component {

	componentWillMount() {}

	didSelectDirectory(event) {
		const elem = event.target;
		console.log(elem.value);
	}
	
	render() {
		return (
			<section style={{flex:"5 5",backgroundColor:"#36393F"}}>
				<div>
					<input type="file" onChange={this.didSelectDirectory.bind(this)} webkitdirectory="true"/>
				</div>
					Contracts...
				<div style={cardStyle}>Test card</div>
			</section>
		)
	}
}