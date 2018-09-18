import React, { Component } from 'react';
import Eos from 'eosjs';
// Components
import Header from './views/Header.js';
import Accounts from './views/Accounts.js';
import Contracts from './views/Contracts.js';
import ContractDetail from './views/ContractDetail.js';

const eos = Eos({
	chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
	keyProvider: ["5JgyBhAvhfhH4Xo474EV1Zjm9uhEGjWXr62tj17aYUKR36ocWzY","5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3","5J5t5Xp9Ug4rwBLRZNLKyXCrAVBHAMWAXeZTgdHFW86BC3qCKbM","5Kay6rDnV1hjLQUwBeEPrfxMwYdAP3gwhLSkYmby7vd7jxGrfx8"],
	httpEndpoint: 'http://127.0.0.1:8888',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false,
	sign: true
});

const containerStyle = {
	display:"flex",
	flexDirection:"row",
	justifyContent:"space-around",
	alignItems:"stretch",
	alignContent:"stretch"
}

class App extends Component {
  render() {
	return (
	  <div className="App">
		<Header eos={eos}/>
		<div style={containerStyle}>
		  <Accounts eos={eos}/>
		  <Contracts eos={eos}/>
		  <ContractDetail eos={eos}/>
		</div>
	  </div>
	)
  }
}

export default App;
