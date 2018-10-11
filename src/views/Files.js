import React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';
const { dialog } = remote;
// Actions
import { watchDirectory, loadFiles } from '../actions/FileActions';
// Constants
const deployedColor = '#00E676';
const compiledColor = '#FF9100';
const defaultColor = '#9E9E9E';

function mapStateToProps({ files }) {
	return { files };
}

class Files extends React.Component {

	state = {
		actions:{}
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
	
	render() {

		const { style } = this.props;
		const bgColor = "#16FFBD";
		
		return (
			<section style={{flex:"8 2",backgroundColor:"#252525",color:"#BABABA",padding:"12px",...style,overscrollX:"hidden",overscrollY:"auto",display:"flex",flexDirection:"column",justifyContent:"space-between",alignItems:"stretch",alignContent:"stretch",padding:0,margin:0}}>
				<div style={{padding:"2%"}}>
					<button onClick={this.didSelectDirectory.bind(this)} style={{width:"100%"}}>Select working directory</button>
				</div>
				<section style={{overflowX:"hidden",overflowY:"auto"}}>
					{Object.values(this.props.files).map(( file, idx ) => {
						return (
							<div key={idx} style={{border:"1px solid #383838",borderRadius:"7px",margin:"7px",padding:"7px"}}>
								<span style={{flex:"none",backgroundColor:((file.deployed)?deployedColor:((file.modified)?defaultColor:compiledColor)),width:"10px",height:"10px",display:"inline-block",borderRadius:"50%",margin:"8px"}}></span>
								<span style={{padding:"7px"}}>{file.name}.{file.extension}</span>
							</div>
						)
					})}
				</section>
			</section>
		)
	}
}

export default connect(mapStateToProps, {watchDirectory,loadFiles})(Files);