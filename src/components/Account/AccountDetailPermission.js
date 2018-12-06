import React from 'react';
import { string, object } from 'prop-types';

export default class AccountDetailPermission extends React.Component {

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

	didSelectEdit(name) {
		console.log("Edit",name)
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

		this.props.onUpdate(payload);
	}

	render() {
		return (
			<div style={this.props.style}>
				<div>
					<div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:0,margin:0}}>
						<span style={{flex:"10 3"}}>{this.props.name.toCamelCase()}</span>
						<button onClick={this.didSelectEdit.bind(this, this.props.name)}>edit</button>
						<button onClick={this.didSelectDelete.bind(this, this.props.name)} disabled={this.props.name==="owner"}>delete</button>
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

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}