import React from 'react';
import { connect } from 'react-redux';
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
	alignContent:"stretch"
}

function mapStateToProps({ contracts }) {
	return { contracts };
}

class Files extends React.Component {

	componentWillMount() {
		
	}

	didSelectDirectory(event) {
		event.preventDefault();
		watchDirectory();
	}
	
	render() {

		const { style } = this.props;

		return (
			<section style={{flex:"3 5",...style}}>
				<div style={{width:"95%",padding:"2%"}}>
					<button onClick={this.didSelectDirectory.bind(this)} style={{width:"100%"}}>Select directory</button>
				</div>
				{Object.values(this.props.contracts).map((contract, idx) => {
					return (
						<div key={idx} style={cardStyle}>
							<span style={{width:"8px",height:"8px",margin:"5px",backgroundColor:"#ECD1A2",display:"inline-block",borderRadius:"50%"}}></span>
							<span style={{color:"#747579",fontWeight:600,margin:"5px"}}>{contract.code}</span>
						</div>
					)
				})}
			</section>
		)
	}
}

export default connect(mapStateToProps)(Files);