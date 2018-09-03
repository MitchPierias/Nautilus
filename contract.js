// Modules
const fs = require('fs');
const path = require('path');
const colors = require('colors');
// Utils
const Account = require('./account.js');
const Exceptions = require('./exceptions.js');

// @note Let the constructor and publish function take a directory string straight to the contract
// 			Construct the name and abi/wasm locations from scanning this directory.

class Contract extends Account {

	constructor(config) {
		// Construct account
		super(config);
		// Contract publisher account
		this.creator = config.creator;
		// Base contract directory
		this.dir =  config.contractDir;
		this.abi = {};
		this.code = "";
	}

	/**
	 * Load
	 * @desc Loads ABI and WASM contract data
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @note Needs better memory optimisation, potential upstream overload
	 * @version 0.0.1
	 * @return
	 */
	load(dir) {
		if ('string' !== typeof dir || dir.length <= 0) dir = this.dir;
		let abi = JSON.parse(fs.readFileSync(`${dir}/${this.name}.abi`, "utf8"));
		if (abi["____comment"]) delete abi["____comment"];
		this.abi = abi;
		this.wasm = fs.readFileSync(`${dir}/${this.name}.wasm`);
	}

	async getCode() {
		let code = await this.provider.getCode(this.name).catch(function(err) {
			console.log(Exceptions);
		});
		this.code = code.code_hash;
		return this.code;
	}

	/**
	 * Publish
	 * @desc Publishes contract to the blockchain
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @note Requires file exists validation, success and exception handling
	 * @version 0.1.0
	 * @return
	 */
	publish(callback) {
		// Capture arguments
		let contractName = this.name;
		let accountName = this.creator;
		// Load contract data
		if (!this.abi || !this.wasm) this.load();
		// Read contract data
		let abi = this.abi;
		let wasm = this.wasm;
		let provider = this.provider;
		// Create account
		this.create(this.creator, async function(err, receipt) {
			console.log(colors.yellow(err))
			//console.log(provider);
			let codeResult = provider.setcode({
				"account": contractName,
				"vmtype": 0,
				"vmversion": 0,
				"code": wasm
			});
			return;
			// Deploy contract to the blockchain
			provider.transaction(function(tr) {
				tr.setcode(accountName, 0, 0, wasm)
				tr.setabi(accountName, abi)
			}).then(function(receipt) {
				if ('function' === typeof callback) callback(false, "Account '"+account_name+"' created");
				return true;
			}).catch(function(err) {
				if ('function' === typeof callback) callback("Account '"+account_name+"' already exists");
				return false;
			});
		});
	}

	deployed() {
		// Get the contract at address
		// Return the contract object
	}

	/**
	 * Set Address
	 * @desc Set's the code deployment account name
	 * @author [Mitch Pierias](github.com/MitchPierias)
	 * @param address <String> Contract account name
	 * @version 1.0.0
	 * @return
	 */
	at(address) {
		if ('string' !== typeof address || address.length <= 0) address = this.name;
		this.name = address;
	}

	address() {
		// Return deployed address name and code
	}
}

module.exports = Contract;