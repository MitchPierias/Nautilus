import React from 'react';
import { connect } from 'react-redux';
// Actions
import { createAccount } from '../actions/AccountActions';

const mapDispatchToProps = {
	createAccount
}

class AccountDetailCreate extends React.Component {

	state = {
		name:''
	}

	/**
	 * Name Field Changed
	 * @desc Fires when the account `name` input value changes
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @param event <onchange> Input value onchange event
	 * @version 1.0.0
	 * @return
	 */
	didChangeNameField(event) {
		const name = event.target.value;
		this.setState({ name });
	}

	didSelectCreateAccount(event) {
		//event.preventDefault();
		const illegalChars = /[\W\d\_]/gi;
		const { name } = this.state;
		if (name && 'string' === typeof name && name.length > 0) {
			if (illegalChars.test(name)) {
				alert("Illegal chars");
			} else {
				this.props.createAccount(name.toLowerCase());
				event.target.value = '';
				this.setState({ name:'' });
			}
		} else {
			alert("A valid name is required");
		}
	}
	
	render() {

		return (
			<div>
				<input type="text" defaultValue={this.state.name} onChange={this.didChangeNameField.bind(this)}/>
				<button onClick={this.didSelectCreateAccount.bind(this)}>Create Account</button>
				<div>
					<h4>Permissions</h4>
					<span></span>
				</div>
			</div>
		)
	}
}

export default connect(null, mapDispatchToProps)(AccountDetailCreate);