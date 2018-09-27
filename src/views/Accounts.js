import React from 'react';

const listStyle = {
	listStyle:"none",
	padding:0,
	margin:0
}

const listItemStyle = {
	backgroundColor:"#42464D",
	padding:"5px",
	margin:"5px",
	borderRadius:"5px"
}

const cardStyle = {
	backgroundColor:"#3D4147",
	border:"1px solid #2F3136",
	padding:"5px",
	margin:"5px",
	borderRadius:"5px"
}

export default class Accounts extends React.Component {

	state = {
		pairs:[],
		name:'',
		ownerKey:'',
		activeKey:'',
		creator:'eosio',
		accounts:[]
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
		const elem = event.target;
		const name = elem.value;
		this.setState({ name });
	}

	createAccount() {

	}

	generateKeyPair() {

	}
	
	render() {

		const menuStyle = {
			listStyle:"none",
			textAlign:"right",
			padding:"8px 26px"
		}

		const menuItemStyle = {
			fontSize:"9px",
			fontWeight:500,
			textTransform:"uppercase",
			padding:"26px 0px 10px 0px",
			borderWidth:0,
			borderStyle:"solid",
			borderColor:"rgba(255,255,255,0.2)",
			borderBottomWidth:"2px"
		}

		const accountList = this.state.accounts.map((account, idx) => (<li key={idx} style={{...listItemStyle,...cardStyle}}>{account.name}</li>))
		const keyList = this.state.pairs.map((key, idx) => (<option key={idx} value={key.public}>{key.public}</option>))
		return (
			<aside style={{flex:"3 10",backgroundColor:"rgba(33,33,33,0.8)",color:"#EDEDE5",height:"100%"}}>
				<div>
					<h2>Accounts</h2>
					<span>
						<input name="name" type="text" placeholder="Account name" onChange={this.didChangeNameField.bind(this)}/>
						<button onClick={this.createAccount.bind(this)}>Create Account</button>
					</span>
				</div>
				<ul style={listStyle}>
					{accountList}
				</ul>
				<select>
					{keyList}
				</select>
				<button onClick={this.generateKeyPair.bind(this)}>Generate Keys</button>
			</aside>
		)
	}
}