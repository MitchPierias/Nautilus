import { ipcRenderer, remote } from 'electron';

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
	/*
	event.preventDefault();
	let pairs = this.state.pairs;
	ecc.randomKey();
	const keyPair = {
		private:seed,
		public:ecc.privateToPublic(seed)
	}
	pairs.push(keyPair);
	this.setState({ pairs, ownerKey:keyPair.public, activeKey:keyPair.public });
	*/
}