import React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
const { dialog } = remote;
// Actions
import { watchDirectory, loadFiles } from '../actions/FileActions';
import { linkFile } from '../actions/ContractActions';
// Constants
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
	watchDirectory,
	loadFiles,
	linkFile
}

class Files extends React.Component {

	state = {
		name:'game',
		contract:'',
		wasm:'',
		abi:''
	}

	componentWillMount() {
		this.props.loadFiles()
	}

	didSelectDirectory(event) {
		event.preventDefault();
		dialog.showOpenDialog({
			properties: ['openDirectory']
		}, (fileNames) => {
			if (!fileNames || fileNames.length <= 0) return;
			this.props.watchDirectory(fileNames[0]);
		});
	}

	didUpdateContractName(event) {
		event.preventDefault();
		const name = event.target.value;
		this.setState({ name });
	}

	didUpdateContractLink(type, file) {
		this.props.linkFile(this.state.name, type, file);
	}
	
	render() {

		const { style } = this.props;
		const bgColor = "#16FFBD";
		
		return (
			<section style={{flex:"8 2",color:"#BABABA",padding:"12px",...style,overscrollX:"hidden",overscrollY:"auto",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
				<aside style={{flex:"3 5",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:"0.5vh",margin:0}}>
					<DirectorySelector style={{flex:"none"}} onClick={this.didSelectDirectory.bind(this)}/>
					<ContractSettings style={{flex:"10 5"}} onLink={this.didUpdateContractLink.bind(this)} onChange={this.didUpdateContractName.bind(this)} files={this.props.files||[]}/>
				</aside>
				<section style={{flex:"10 5",overflowX:"hidden",overflowY:"auto"}}>
					{Object.values(this.props.files).map(( file, idx ) => {
						return (
							<div key={idx} style={{border:"none",borderBottom:"1px solid #212121",display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",margin:"7px",padding:"7px 14px"}}>
								<span style={{flex:"none",backgroundColor:((!file.deployed||file.modified)?STATUS_COLOR_DEFAULT:((file.deployed)?STATUS_COLOR_DEPLOYED:STATUS_COLOR_COMPILED)),width:"10px",height:"10px",display:"inline-block",borderRadius:"50%",margin:"8px"}}></span>
								<span style={{display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"flex-start",margin:0,padding:0}}>
									<h4>{file.name}.{file.extension}</h4>
									<small>{file.version}</small>
								</span>
							</div>
						)
					})}
				</section>
			</section>
		)
	}
}

function DirectorySelector(props) {
	return (
		<div style={{padding:"1vw",...props.style}}>
			<button onClick={props.onClick.bind(this)} style={{width:"100%"}}>Select working directory</button>
		</div>
	)
}

function ContractSettings(props) {

	const files = {contracts:[],wasm:[],abi:[]};

	Object.values(props.files).forEach((file, idx) => {
		if (file.extension === 'wasm') {
			files.wasm.push(file);
		} else if (file.extension === 'abi') {
			files.abi.push(file);
		} else {
			files.contracts.push(file);
		}
	});

	return (
		<div style={{border:"2px solid #383838",borderRadius:"2vh",margin:"0.5vh",padding:"0.5vh",position:"relative",...props.style,display:"flex",justifyContent:"space-between",flexDirection:"column",alignItems:"stretch",alignContent:"stretch"}}>
			<input placeholder="Contract Name" defaultValue="game" style={{flex:"none",borderWidth:"2px"}} onChange={props.onChange}/>
			<div style={{flex:"10 5",display:"flex",justifyContent:"space-between",flexDirection:"column",alignItems:"stretch",alignContent:"stretch"}}>
				<ContractLink style={{flex:"5 5"}} label="Contract" onSubmit={props.onLink.bind(this,'contract')} file="926A66B2" files={files.contracts}/>
				<span style={{flex:"none",textAlign:"center"}}>link</span>
				<ContractLink style={{flex:"5 5"}} label="WASM" onSubmit={props.onLink.bind(this,'wasm')} file="3556EE30" files={files.wasm}/>
				<span style={{flex:"none",textAlign:"center"}}>link</span>
				<ContractLink style={{flex:"5 5"}} label="ABI" onSubmit={props.onLink.bind(this,'abi')} file="0C26A9DD" files={files.abi}/>
			</div>
		</div>
	)
}

class ContractLink extends React.Component {

	state = {
		file:''
	}

	componentDidMount() {
		const { file } = this.props;
		this.setState({ file })
	}

	didChangeInput(event) {
		const file = event.target.value;
		this.setState({ file });
		console.log(file)
	}

	didSelectUpdate(event) {
		event.preventDefault();
		this.props.onSubmit(this.state.file)
	}

	render() {
		return (
			<span style={{border:"2px dashed #383838",color:"#383838",margin:"1vw",borderRadius:"1.5vw",display:"flex",flexDirection:"column",justifyContent:"space-between",...this.props.style}}>
				<span>{this.props.label}</span>
				<select onChange={this.didChangeInput.bind(this)}>
					{this.props.files.map((file, idx) => {
						return <option key={idx} value={file.uid}>{file.name}.{file.extension}</option>
					})}
				</select>
				<button onClick={this.didSelectUpdate.bind(this)} style={{borderRadius:"1vw"}}>update</button>
			</span>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Files);