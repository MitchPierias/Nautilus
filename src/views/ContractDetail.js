import React from 'react';

export default class ContractDetail extends React.Component {
	
	render() {
		return (
			<section style={{flex:"8 2",backgroundColor:"#EDEDE5"}}>
				<h2>Selected Contract</h2>
				<p>State (Deployed/Built/Modified)</p>
				<button>Build WASM</button>
				<button>Build ABI</button>
				<button>Deploy</button>
			</section>
		)
	}
}