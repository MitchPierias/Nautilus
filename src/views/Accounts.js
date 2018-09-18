import React from 'react';
import { modules } from 'eosjs';
const { ecc } = modules;

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
	 * Generate Key Pair
	 * @desc Generates unique private and public keys
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @param count <Number> Number of keys to generate
	 * @param callback <Function> Callback function
	 * @version 0.1.0
	 * @return seeds <Array> Array of generated seeds
	 */
	async generateKeyPair(event) {
		event.preventDefault();
		let pairs = this.state.pairs;
		const seed = await ecc.randomKey();
		const keyPair = {
			private:seed,
			public:ecc.privateToPublic(seed)
		}
		pairs.push(keyPair);
		this.setState({ pairs, ownerKey:keyPair.public, activeKey:keyPair.public });
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

	/**
	 * Create Account
	 * @desc Creates a new account
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @param event <onclick> Button onclick event
	 * @version 1.0.0
	 * @return
	 */
	async createAccount(event) {
		event.preventDefault();
		const { creator, name, ownerKey, activeKey } = this.state;

		if (!name) return alert("Missing account name");
		if (!ownerKey) return alert("Missing owner key");
		if (!activeKey) return alert("Missing active key");

		const result = await this.props.eos.newaccount({
			creator: creator,
			name: name,
			owner: ownerKey,
			active: activeKey
		}).then(receipt => {
			console.log("Account '"+name+"' created");
			let { accounts } = this.state;
			accounts.push({name,ownerKey,activeKey,creator});
			this.setState({ accounts });
		}).catch(error => {
			console.log("Account '"+name+"' already exists");
			let { accounts } = this.state;
			accounts.push({name,ownerKey,activeKey,creator});
			this.setState({ accounts });
		});
	}
	
	render() {

		const accountList = this.state.accounts.map((account, idx) => (<li key={idx} style={{...listItemStyle,...cardStyle}}>{account.name}</li>))
		const keyList = this.state.pairs.map((key, idx) => (<option key={idx} value={key.public}>{key.public}</option>))
		return (
			<aside style={{flex:"3 10",backgroundColor:"#2F3136",color:"#EDEDE5",height:"100%"}}>
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