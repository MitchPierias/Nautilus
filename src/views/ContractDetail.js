import React from 'react';
import { connect } from 'react-redux';
import EOS from 'eosjs';
import fs from 'fs';
/*
const eos = EOS({
	chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
	keyProvider: ["5JgyBhAvhfhH4Xo474EV1Zjm9uhEGjWXr62tj17aYUKR36ocWzY","5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3","5J5t5Xp9Ug4rwBLRZNLKyXCrAVBHAMWAXeZTgdHFW86BC3qCKbM","5Kay6rDnV1hjLQUwBeEPrfxMwYdAP3gwhLSkYmby7vd7jxGrfx8"],
	httpEndpoint: 'http://127.0.0.1:8888',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false,
	sign: true
});*/
// Actions
import { compileFile } from '../actions/FileActions';

const selected = {
	code:'game',
	contract:'926A66B24E',
	wasm:'3556EE3097',
	abi:'0C26A9DD64',
	modified:1538049211106,
	deployed:false
}

function mapStateToProps({ files }) {
	return { files };
}

class ContractDetail extends React.Component {

	state = {
		actions:{}
	}

	componentWillMount() {
		this.loadActions();
	}

	async loadActions() {

		const selectedABI = this.props.files[selected.abi];
		const eos = EOS({httpEndpoint:null});
		const abi = fs.readFileSync(selectedABI.path+selectedABI.file);
		eos.fc.abiCache.abi(selected.code, JSON.parse(abi))
		// Check that the ABI is available (print usage)
		eos.contract(selected.code).then(contract => {
			let actions = {};
			Object.keys(contract).forEach(name => {
				if (name === 'fc' || name === 'transaction') return;
				actions[name] = contract[name];
			});
			this.setState({ actions });
		});
	}

	didSelectBuildWasm(event) {
		let file = this.props.files[selected.wasm];
		file.source = this.props.files[file.source];
		this.props.compileFile(file);
	}

	didSelectBuildAbi(event) {
		let file = this.props.files[selected.abi];
		file.source = this.props.files[file.source];
		this.props.compileFile(file);
	}
	
	render() {

		const { style } = this.props;
		const bgColor = (this.props.files[selected.wasm].modified)?"grey":"#16FFBD";
		
		return (
			<section style={{flex:"8 2",backgroundColor:"#252525",color:"#BABABA",padding:"12px",...style}}>
				<h2 style={{color:"#EDEDE5",textTransform:"uppercase"}}>{selected.code} Contract</h2>
				<div>
					<button type="submit" disabled={this.props.files[selected.contract].modified}>Deploy</button>
				</div>
				<section style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
					<span style={{flex:"3 3",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:"5px",margin:0}}>
						<span style={{flex:"none",backgroundColor:((this.props.files[selected.wasm].modified>selected.modified)?"#16FFBD":"grey"),width:"10px",height:"10px",display:"inline-block",borderRadius:"50%"}}></span>
						<span style={{flex:"3 2"}}>WASM</span>
						<span style={{flex:"7 3"}}>{this.props.files[selected.wasm].file}</span>
						<button style={{flex:"3 5"}} onClick={this.didSelectBuildWasm.bind(this)} disabled={this.props.files[selected.wasm].modified>selected.modified}>{(this.props.files[selected.wasm].modified>selected.modified)?"Compiled":"Compile WASM"}</button>
					</span>
					<span style={{flex:"3 3",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",alignContent:"center",padding:"5px",margin:0}}>
						<span style={{flex:"none",backgroundColor:((this.props.files[selected.abi].modified>selected.modified)?"#16FFBD":"grey"),width:"10px",height:"10px",display:"inline-block",borderRadius:"50%"}}></span>
						<span style={{flex:"3 2"}}>ABI</span>
						<span style={{flex:"7 3"}}>{this.props.files[selected.abi].file}</span>
						<button style={{flex:"3 5"}} onClick={this.didSelectBuildAbi.bind(this)} disabled={this.props.files[selected.abi].modified>selected.modified}>{(this.props.files[selected.abi].modified>selected.modified)?"Compiled":"Compile ABI"}</button>
					</span>
				</section>
				<section>
					<h3>Actions</h3>
					{Object.keys(this.state.actions).map((action,idx) => {
						return <div key={idx}>{action}</div>
					})}
				</section>
				<section>
					<h3>Tables</h3>
				</section>
			</section>
		)
	}
}

export default connect(mapStateToProps, {compileFile})(ContractDetail);