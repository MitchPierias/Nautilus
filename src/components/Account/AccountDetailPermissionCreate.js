import React from 'react';

export default class AccountDetailPermissionCreate extends React.Component {

	state = {
		actor:'',
		permission:'',
		weight:1
	}

	didChangeField(event) {
		const elem = event.target;
		this.setState({ [elem.name]:elem.value });
	}

	didSelectUpdatePermission(event) {
		event.preventDefault();
		console.log("Add permission '"+this.state.permission+"' for actor "+this.state.actor+" with weight "+this.state.weight);
	}

	render() {

		return (
			<div>
				<input type="text" name="actor" onChange={this.didChangeField.bind(this)} defaultValue={this.state.actor} placeholder="Actor"/>
				<input type="text" name="permission" onChange={this.didChangeField.bind(this)} defaultValue={this.state.permission} placeholder="Permission"/>
				<input type="number" name="weight" step="1" onChange={this.didChangeField.bind(this)} defaultValue={this.state.weight} placeholder="Weight"/>
				<button onClick={this.didSelectUpdatePermission.bind(this)}>Add permission</button>
			</div>
		)
	}
}