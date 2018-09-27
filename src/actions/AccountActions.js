import EOS, { modules } from 'eosjs';
const { ecc } = modules;

const eos = EOS({
	chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
	keyProvider: ["5JgyBhAvhfhH4Xo474EV1Zjm9uhEGjWXr62tj17aYUKR36ocWzY","5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3","5J5t5Xp9Ug4rwBLRZNLKyXCrAVBHAMWAXeZTgdHFW86BC3qCKbM","5Kay6rDnV1hjLQUwBeEPrfxMwYdAP3gwhLSkYmby7vd7jxGrfx8"],
	httpEndpoint: 'http://127.0.0.1:8888',
	expireInSeconds: 60,
	broadcast: true,
	verbose: false,
	sign: true
});

/**
 * Create Account
 * @desc Creates a new account
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param event <onclick> Button onclick event
 * @version 1.0.0
 * @return
 */
export const createAccount = event => dispatch => {
	event.preventDefault();
	const { creator, name, ownerKey, activeKey } = this.state;

	if (!name) return alert("Missing account name");
	if (!ownerKey) return alert("Missing owner key");
	if (!activeKey) return alert("Missing active key");

	eos.newaccount({
		creator: creator,
		name: name,
		owner: ownerKey,
		active: activeKey
	}).then(receipt => {
		console.log("Account '"+name+"' created");
		let { accounts } = this.state;
		accounts.push({name,ownerKey,activeKey,creator});
		this.setState({ accounts });
	}).catch(error => {
		console.log("Account '"+name+"' already exists");
	});
}

/**
 * Generate Key Pair
 * @desc Generates unique private and public keys
 * @author [Mitch Pierias](github.com/MitchPierias)
 * @param count <Number> Number of keys to generate
 * @param callback <Function> Callback function
 * @version 0.1.0
 * @return seeds <Array> Array of generated seeds
 */
export const generateKeyPair = event => dispatch => {
	event.preventDefault();
	let pairs = this.state.pairs;
	ecc.randomKey();
	const keyPair = {
		private:seed,
		public:ecc.privateToPublic(seed)
	}
	pairs.push(keyPair);
	this.setState({ pairs, ownerKey:keyPair.public, activeKey:keyPair.public });
}

export const getInfo = () => {
	eos.getInfo({}).then(info => {
		return info;
		console.log(info);
	}).catch(error => {
		console.error(error);
	});
}