import React from 'react';
import { oneOfType, string, array, bool, object } from 'prop-types';
import { connect } from 'react-redux';
import eosjs from 'eosjs';
// Actions
import { getAccount } from '../actions/AccountActions';
// Colors
import {
	STATUS_COLOR_DEFAULT,
	STATUS_COLOR_MODIFIED,
	STATUS_COLOR_COMPILED,
	STATUS_COLOR_DEPLOYED,
	STATUS_COLOR_FAILED
} from '../globals/colors';
// Constants
const HTTP_ENDPOINT = 'http://127.0.0.1:8888';
const CHAIN_ID = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f';
const PRIVATE_KEYS = ["5JgyBhAvhfhH4Xo474EV1Zjm9uhEGjWXr62tj17aYUKR36ocWzY","5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3","5J5t5Xp9Ug4rwBLRZNLKyXCrAVBHAMWAXeZTgdHFW86BC3qCKbM","5Kay6rDnV1hjLQUwBeEPrfxMwYdAP3gwhLSkYmby7vd7jxGrfx8"];

const eos = eosjs({
	chainId: CHAIN_ID,
	keyProvider: PRIVATE_KEYS,
	httpEndpoint: HTTP_ENDPOINT,
	expireInSeconds: 60,
	broadcast: true,
	verbose: false,
	sign: true
});

const mapDispatchToProps = {
	getAccount
}

class AccountDetail extends React.Component {

	state = {
		permissions:[],
		ram:{},
		cpu:{}
	}

	static defaultProps = {
		name:false
	}

	static propTypes = {
		name:oneOfType([bool,string])
	}

	componentWillReceiveProps(nextProps) {
		if ('string' === typeof nextProps.name) {
			eos.getAccount(nextProps.name).then(account => {
				const { permissions, ram_usage } = account;
				this.setState({ permissions, ram:{usage:(ram_usage||0),quota:10000}, cpu:{usage:0,quota:10000} });
			}).catch(err => {
				console.error(err);
			});
		}
	}

	didSelectMakeContract(event) {
		event.preventDefault();
		console.log("Convert account '"+this.props.name+"' too contract")
		this.props.convertAccount(this.props.name);
	}
	
	render() {

		return (
			<div>
				<div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
					<span>{(this.props.name||'').toCamelCase()}</span>
					<button onClick={this.didSelectMakeContract.bind(this)} disabled={(!this.props.name)}>Make contract</button>
				</div>
				<span style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:0,margin:"12px 0px"}}>
					<span style={{margin:"0px 12px"}}>Ram</span>
					<AccountDetailRamIndicator value={this.state.ram.usage} max={this.state.ram.quota}/>
				</span>
				<span style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:0,margin:"12px 0px"}}>
					<span style={{margin:"0px 12px"}}>CPU</span>
					<AccountDetailRamIndicator value={this.state.cpu.usage} max={this.state.cpu.quota}/>
				</span>
				<span>
				<h4>Permissions</h4>
				<AccountDetailPermissionCreate onSubmit={this.didUpdateAuth.bind(this)}/>
				{this.state.permissions.map((permission, idx) => (
					<AccountDetailPermission key={idx} account={this.props.name} name={permission.perm_name} parent={permission.parent} auth={permission.required_auth} style={{margin:"12px 0px"}}/>
				))}
				</span>
			</div>
		)
	}
}

class AccountDetailPermission extends React.Component {

	static defaultProps = {
		account:'',
		name:'',
		parent:'',
		auth:{}
	}

	static propTypes = {
		account:string,
		name:string,
		parent:string,
		auth:object
	}

	didSelectDelete(name) {
		console.info("Delete "+name+" for account "+this.props.account)
		eos.deleteauth({account:this.props.account,permission:name}).then(success => {
			console.log("Auth "+name+" deleted");
		}).catch(err => {
			console.error(err);
		});
	}

	didUpdateAuth() {

		const payload = {
			account:this.props.account,
			permission:this.props.name,
			parent:this.props.parent||'',
			auth: {
				"threshold":1,
				"keys":[
					{
						"key":"EOS5vCdftk4hxj5ygrH6ZK8jkgoo1sm2JoppKvikATAN74b9Bfs2F",
						"weight":1
					}
				],
				"accounts":[
					{
						"permission":{
							"actor":this.props.name,
							"permission":"eosio.code"
						},
						"weight":1
					}
				],
				"waits":[]
			}
		}

		console.log("Linking with",payload)
		return;
		eos.updateauth(payload).then(receipt => {
			const { broadcast, processed, transaction, transaction_id } = receipt;
			console.log("Success "+transaction_id)
			payload.perm_name = payload.permission;
			payload.required_auth = payload.auth;
			const permissions = this.state.permissions;
			permissions[perm_idx] = payload;
			this.setState({ permissions });
		}).catch(err => {
			console.error(err);
		});
	}

	render() {
		return (
			<div style={this.props.style}>
				<div>
					<div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:0,margin:0}}>
						<span>
							<span>{this.props.name}</span>
							{(this.props.parent && this.props.parent !== '') ? <span> -> {this.props.parent}</span> : null}
						</span>
						<button onClick={this.didSelectDelete.bind(this, this.props.name)}>delete</button>
					</div>
					{this.props.auth.keys.map(({ key, weight }, idx) => (
						<div key={idx}>
							<div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"center",padding:0,margin:0}}>
								<select style={{color:"#BDBDBD",backgroundColor:"#424242",outline:"none",border:"none"}}>
									<option value={key}>{key}</option>
								</select>
								<input name="weight" defaultValue={weight} style={{width:"50px"}}/>
							</div>
						</div>
					))}
				</div>
				<div>
					{this.props.auth.accounts.map((account, idx) => (<div key={idx}><div>Actor: {account.permission.actor}</div><div>Permission: {account.permission.permission}</div><div>Weight: {account.weight}</div></div>))}
				</div>
				<div>
					{this.props.auth.waits.map((wait, idx) => (<div key={idx}><div>Sec: {wait.wait_sec}</div><div>Weight: {wait.weight}</div></div>))}
				</div>
			</div>
		)
	}
}

class AccountDetailPermissionCreate extends React.Component {

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
				<input type="number" name="weight" onChange={this.didChangeField.bind(this)} defaultValue={this.state.weight} placeholder="Weight"/>
				<button onClick={this.didSelectUpdatePermission.bind(this)}>Add permission</button>
			</div>
		)
	}
}

function AccountDetailRamIndicator({ value, max }) {

	return (
		<span style={{display:"inline-block",width:"100%",height:"10px",backgroundColor:"#212121",borderRadius:"5px",overflow:"hidden",margin:0,padding:0}}>
			<span style={{width:`${(value/max)*100}%`,height:"10px",display:"block",backgroundColor:STATUS_COLOR_MODIFIED,borderRadius:"5px",margin:0,padding:0}}></span>
		</span>
	)
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

export default connect(null, mapDispatchToProps)(AccountDetail);