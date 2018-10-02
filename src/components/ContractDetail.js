import React from 'react';
import { connect } from 'react-redux';
import EOS from 'eosjs';
import fs from 'fs';
// Actions
import { watchDirectory, compileFile, deployFile } from '../actions/FileActions';

const deployedColor = '#16FFBD';
const compiledColor = 'yellow';
const defaultColor = 'grey';

function mapStateToProps({ files }) {
	return { files };
}

class ContractDetail extends React.Component {

	state = {
		actions:{}
	}

	componentWillMount() {
		this.props.watchDirectory('/Users/mitch/Contracts/Nautilus/contracts');
	}

	didSelectCompileFile(type, event) {
		event.preventDefault();
		console.log(this.props.files[this.props.contract]);
		this.props.compileFile(this.props.files[this.props.contract],type);
	}

	didSelectDeployFile(event) {
		event.preventDefault();
		const wasmFile = this.props.files[this.props.wasm];
		const abiFile = this.props.files[this.props.abi];
		this.props.deployFile(this.props.code, wasmFile, abiFile);
	}

	loadActions() {
		const eos = EOS({httpEndpoint:null});
		const source = this.props.files[this.props.abi];
		const { code } = this.props;
		// Load and cache ABI
		const abi = fs.readFileSync(source.path+source.file);
		eos.fc.abiCache.abi(code, JSON.parse(abi))
		// Fetch the ABI and store actions
		eos.contract(code).then(contract => {
			let actions = {};
			Object.keys(contract).forEach(name => {
				if (name === 'fc' || name === 'transaction') return;
				actions[name] = contract[name];
			});
			// Update actions
			this.setState({ actions });
		});
	}
	
	render() {

		if (!this.props.code) return null;

		const contract = this.props.files[this.props.contract] || {};
		const wasm = this.props.files[this.props.wasm] || {};
		const abi = this.props.files[this.props.abi] || {};
		
		return (
			<section style={{flex:"8 2",backgroundColor:"#252525",color:"#BABABA",padding:"12px",...this.props.style}}>
				<h2 style={{color:"#EDEDE5",textTransform:"uppercase"}}>{this.props.code} Contract</h2>
				<div>
					<button type="submit" disabled={contract.modified}>Compile</button>
					<button type="submit" disabled={!(wasm.file && abi.file)} onClick={this.didSelectDeployFile.bind(this)}>Deploy</button>
				</div>
				<section style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
					<span style={{flex:"3 3",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:"5px",margin:0}}>
						<span style={{flex:"none",backgroundColor:((wasm.deployed)?deployedColor:((wasm.file)?compiledColor:defaultColor)),width:"10px",height:"10px",display:"inline-block",borderRadius:"50%",margin:"8px"}}></span>
						<span style={{flex:"3 2"}}>WASM</span>
						<span style={{flex:"7 3"}}>{wasm.file}</span>
						<button style={{flex:"3 5"}} onClick={this.didSelectCompileFile.bind(this,'wasm')} disabled={wasm.file}>{(wasm.file)?"Compiled":"Compile WASM"}</button>
					</span>
					<span style={{flex:"3 3",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",alignContent:"center",padding:"5px",margin:0}}>
						<span style={{flex:"none",backgroundColor:((abi.deployed)?deployedColor:((abi.file)?compiledColor:defaultColor)),width:"10px",height:"10px",display:"inline-block",borderRadius:"50%",margin:"8px"}}></span>
						<span style={{flex:"3 2"}}>ABI</span>
						<span style={{flex:"7 3"}}>{abi.file}</span>
						<button style={{flex:"3 5"}} onClick={this.didSelectCompileFile.bind(this,'abi')} disabled={abi.file}>{(abi.file)?"Compiled":"Compile ABI"}</button>
					</span>
				</section>
				<section>
					<span style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",alignContent:"center",margin:0,padding:0}}>
						<h3>Actions</h3>
						<button disabled={!abi.file} type="reset" onClick={this.loadActions.bind(this)}>load actions</button>
					</span>
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

export default connect(mapStateToProps, {watchDirectory,compileFile,deployFile})(ContractDetail);