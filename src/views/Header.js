import React from 'react';

export default class Header extends React.Component {

	state = {
		status:0
	}

	async componentDidMount() {
		setTimeout(async () => {
			const info = await this.props.eos.getInfo({}).then(info => {
				this.setState({ status:2 });
				console.log(info);
			}).catch(error => {
				console.error(error);
			});
		}, 3000)
	}
	
	render() {

		const statusStyle = {
			backgroundColor:(this.state.status>0)?'#00E676':'#FF1744',
			borderRadius:"50%",
			width:"10px",
			height:"10px",
			display:"inline-block"
		}

		return (
			<header style={{backgroundColor:"#202225",flex:"none",display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"stretch",padding:"6px 12px"}}>
				<span><h1 style={{color:"#F8F8F2"}}>Nautilus</h1></span>
				<span style={{padding:"5px",flex:"10 2",display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"flex-end"}}>
					<div>
						<span style={{margin:"0px 5px"}}>Network:</span>
						<span style={{margin:"0px 5px"}}>Local</span>
					</div>
					<div>
						<span style={{margin:"0px 5px"}}>Status:</span>
						<span style={{...statusStyle,margin:"0px 5px"}}></span>
					</div>
				</span>
			</header>
		)
	}
}