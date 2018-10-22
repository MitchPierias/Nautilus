import React from 'react';
import { connect } from 'react-redux';
import { string } from 'prop-types';
// Actions
import { loadAccounts } from '../actions/AccountActions';
import { compileFile, loadFiles } from '../actions/FileActions';
import { compile, deploy } from '../actions/ContractActions';
// Colors
import {
	STATUS_COLOR_DEFAULT,
	STATUS_COLOR_MODIFIED,
	STATUS_COLOR_COMPILED,
	STATUS_COLOR_DEPLOYED,
	STATUS_COLOR_FAILED
} from '../globals/colors';

function mapStateToProps({ files }) {
	return { files };
}

const mapDispatchToProps = {
	compile,
	deploy,
	loadAccounts,
	loadFiles
}

class ContractDetail extends React.Component {

	state = {
		actions:{}
	}

	static propTypes = {
		name:string
	}

	static defaultProps = {
		name:'',
		contract:false
	}

	componentWillMount() {
		this.props.loadFiles();
		this.props.loadAccounts();
	}

	componentWillReceiveProps(nextProps) {
		if ('string' === typeof nextProps.abi) {
			//this.loadActions(nextProps.abi);
		}
	}

	didSelectCompileFile(type, event) {
		// Cancel click event
		event.preventDefault();
		if (!this.props.name) {
			alert("No Contract specified");
			return;
		}
		// Compile source contract
		this.props.compile(this.props.name, type);
	}

	didSelectDeployFile(event) {
		event.preventDefault();
		const wasmFile = this.props.files[this.props.wasm];
		const abiFile = this.props.files[this.props.abi];
		this.props.deployFile(this.props.name, wasmFile, abiFile);
	}

	loadActions(abiPath) {
		if ('string' !== typeof abiPath) return;
		const source = this.props.files[abiPath];
		console.log(source)
		if (!source || 'object' !== typeof source) return;
		const { code } = this.props;
		// Load and cache ABI
		const abi = fs.readFileSync(source.path);
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

		if (!this.props.name) return ContractIntroduction(this.props);

		const contract = this.props.files[this.props.contract] || {};
		const wasm = this.props.files[this.props.wasm] || {};
		const abi = this.props.files[this.props.abi] || {};

		return (
			<section style={{flex:"8 2",backgroundColor:"transparent",color:"#BABABA",padding:"0px 12px",...this.props.style}}>
				<header style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"stretch",padding:0,margin:0}}>
					<h2>{this.props.name.toCamelCase()} Contract</h2>
					<span>
						<button type="submit" disabled={contract.modified} style={{borderRadius:"7px 0 0 7px",marginRight:0,borderRight:"1px solid #424242"}} onClick={this.didSelectCompileFile.bind(this)}>Compile</button>
						<button type="submit" disabled={!(wasm.file && abi.file)} onClick={this.didSelectDeployFile.bind(this)} style={{borderRadius:"0 7px 7px 0",marginLeft:0}}>Deploy</button>
					</span>
				</header>
				<section style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
					<ContractDetailFileItem label="WASM" file={wasm} onClick={this.didSelectCompileFile.bind(this,'wasm')}/>
					<ContractDetailFileItem label="ABI" file={abi} onClick={this.didSelectCompileFile.bind(this,'abi')}/>
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

function ContractDetailFileItem({ file, label, onClick }) {

	let statusColor = STATUS_COLOR_DEFAULT;
	if (file.deployed) statusColor = STATUS_COLOR_DEPLOYED;
	if (file.modified !== file.version) statusColor = STATUS_COLOR_MODIFIED;
	if (file.version) statusColor = STATUS_COLOR_COMPILED;
	const compileRequired = file.version || file.version!==file.modified;

	return (
		<span style={{flex:"3 3",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",alignContent:"center",padding:"5px",margin:0}}>
			<span style={{flex:"none",backgroundColor:statusColor,width:"10px",height:"10px",display:"inline-block",borderRadius:"50%",margin:"8px"}}></span>
			<span style={{flex:"3 2",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",alignContent:"center",padding:0,margin:0}}>
				<span style={{flex:"none"}}>{label}</span>
				<span style={{flex:"none",fontSize:"0.7em"}}>{modifiedMessage(file)}</span>
			</span>
			<button style={{flex:"3 5"}} onClick={onClick} disabled={compileRequired}>{(compileRequired)?"Compiled":"Compile "+label}</button>
		</span>
	)
}

String.prototype.toCamelCase = function() {
	return this.substr(0,1).toUpperCase() + this.substr(1,this.length-1);
}

function ContractIntroduction(props) {

	return (
		<section style={{flex:"8 2",backgroundColor:"transparent",color:"#BABABA",padding:"12px",...props.style}}>
			<h2>Please select a contract</h2>
		</section>
	)
}

function modifiedMessage({ version, modified, deployed }) {

	if (deployed && 'string' === typeof deployed) {
		return "Deployed";
	} else if (modified && modified !== version) {
		return "Modified";
	} else if (version && 'string' === typeof version) {
		return "Compiled";
	} else {
		return "No file"
	}
}

function textFromDate(timestamp) {
	
	if ('number' !== typeof timestamp || timestamp <= 0) return "None";

	const currentTime = +new Date;
	const durationSeconds = Math.floor((currentTime-timestamp)/1000);
	const durationMinutes = Math.floor(durationSeconds/60);
	const durationHours = Math.floor(durationMinutes/60);
	const durationDays = Math.floor(durationHours/24);
	const durationWeeks = Math.floor(durationDays/7);

	if (durationSeconds < 60) {
		return durationSeconds + " seconds ago";
	} else if (durationSeconds < 3600) {
		return Math.floor(durationSeconds/60) + " minutes ago";
	} else if (durationSeconds < 216000) {
		return Math.floor(durationSeconds/60/60) + " hours ago";
	} else if (durationSeconds < 1512000) {
		return Math.floor(durationSeconds/60/60/24) + " days ago";
	} else {
		return Math.floor(durationSeconds/60/60/24/7) + " weeks ago";
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractDetail);