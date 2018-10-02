import React from 'react';
import { connect } from 'react-redux';
// Actions
import { watchDirectory } from '../actions/FileActions';

function mapStateToProps({ files }) {
	return { files };
}

class Files extends React.Component {

	state = {
		actions:{}
	}

	componentWillMount() {
		//this.props.watchDirectory();
	}

	didSelectDirectory(event) {
		event.preventDefault();
		this.props.watchDirectory();
	}
	
	render() {

		const { style } = this.props;
		const bgColor = "#16FFBD";
		
		return (
			<section style={{flex:"8 2",backgroundColor:"#252525",color:"#BABABA",padding:"12px",...style,overscrollX:"hidden",overscrollY:"auto"}}>
				<div style={{width:"95%",padding:"2%"}}>
					<button onClick={this.didSelectDirectory.bind(this)} style={{width:"100%"}}>Select working directory</button>
				</div>
				<section style={{height:"100%",overflowX:"hidden",overflowY:"auto"}}>
					{Object.values(this.props.files).map(( file, idx ) => {
						return (
							<div key={idx} style={{border:"1px solid #383838",borderRadius:"7px",margin:"7px",padding:"7px"}}>
								<div style={{margin:"7px"}}>{file.uid} : {file.name}.{file.extension}</div>
								<div style={{margin:"7px"}}>{file.path}</div>
								<div style={{margin:"7px"}}>{file.modified||'Not modified'}</div>
								<div style={{margin:"7px"}}>{file.version||'No version hash'}</div>
							</div>
						)
					})}
				</section>
			</section>
		)
	}
}

export default connect(mapStateToProps, {watchDirectory})(Files);