import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';

function mapStateToProps({ accounts }) {
	return { accounts };
}

class Project extends React.Component {

	state = {}

	static defaultProps = {}

	static propTypes = {}
	
	render() {

		return (
			<aside style={{flex:"3 10",backgroundColor:"rgba(33,33,33,0.8)",color:"#EDEDE5",height:"100%"}}>
				<h2>Project</h2>
				<h3>Environment</h3>
				<h3>Keys</h3>
			</aside>
		)
	}
}

export default connect(mapStateToProps)(Project);