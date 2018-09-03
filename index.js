const EOSJS = require('eosjs');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const chokidar = require('chokidar');
// Config
const CONFIG = require(__dirname+'/config.json');
// Components
const Exceptions = require(__dirname+'/exceptions.js');
const Contract = require(__dirname+'/contract.js');
const Account = require(__dirname+'/account.js');

let allAccounts = ['mitch','mersad','james'];

class Virosa {

	constructor(config = Object) {
		this.accounts = [];
		this.contracts = [];
		this.creator = config['creator'];
		this.pubkey = config['public_key'];
		this.provider = EOSJS({keyProvider:[config['private_key']],
			expireInSeconds: 60,
			chainId: config['chain_id']
		});
		this.persistent = true;
		this.directory = __dirname + config['path'];
	}

	async scan() {

		let watchDirectory = this.directory;
		let provider = this.provider;
		let creator = this.creator;
		/**
		 * Watcher Configuration
		 */
		var watcher = chokidar.watch(watchDirectory, {
			//ignored: new RegExp(watchDirectory+"\/\~\$[\w]*","gi"),
			persistent:this.persistent
		});

		/**
		 * Ready
		 * @note Fired after the initial directory scan
		 */
		watcher.on("ready", function() {
			console.log(colors.grey("Started observing '"+watchDirectory+"' directory"));
		});

		let contracts = {};

		/**
		 * Add
		 * @note Fired when a new file is added to the directory
		 */
		watcher.on('add', function(path) {
			// Skip ignored matches
			if (false === /\.(abi|wasm|wast|cpp|hpp|h)/gi.test(path)) return;
			let fileComponents = /\/([\w\d]*)\.(\w*)(?![\/\w\d\s\.])/gi.exec(path);
			let fileName = fileComponents[1];
			let fileType = fileComponents[2];

			console.log(colors.white("Added\t")+colors.cyan(fileName+"\t")+" "+colors.yellow(fileType));

			if (!contracts[fileName]) {
				contracts[fileName] = {};
				let NewAccount = new Contract({
					name: fileName,
					owner: "EOS8SVW2HsgshobrTyZYEWHuWVMt9ASTUT5QnzV6VoUEfZsedvc3C"
				});
				NewAccount.setProvider(provider);
				NewAccount.create(creator, function(err, result) {
					if (err) {
						console.log(colors.red(err));
					} else {
						console.log(colors.cyan(result));
					}
				});
			}

			if (!contracts[fileName][fileType]) contracts[fileName][fileType] = "";
		});

		watcher.on("change", function(path) {
			// Skip if file type fails match
			if (false === /\.(abi|wasm|wast|cpp|hpp|h)/gi.test(path)) return;
			let fileComponents = /\/([\w\d]*)\.(\w*)(?![\/\w\d\s\.])/gi.exec(path);
			let fileName = fileComponents[1];
			let fileType = fileComponents[2];
			// Read data and upload to AWS S3
			fs.readFile(path, function(err, data) {
				// Log errors and escape
				if (err) return console.log(err);
				// Upload the data buffer
				console.log(colors.white("Changed\t")+colors.cyan(fileName+"\t")+" "+colors.yellow(fileType));
			});
		});
	}

	async deploy() {
		let TestContract = new Contract({
			name:'tester',
			creator:this.creator,
			owner:this.pubkey,
			contractDir:__dirname+'/example/contracts'
		});

		TestContract.setProvider(this.provider);
		TestContract.publish();
	}

	async list() {
		let TestContract = new Contract({
			name:'members',
			creator:this.creator,
			owner:this.pubkey,
			contractDir:__dirname+'/example/contracts'
		});

		TestContract.setProvider(this.provider);
		let result = await TestContract.create('eosio');
		//let code = await TestContract.getCode();
		console.log(result);
	}

	
	/*
	allAccounts.forEach(async function(account_name) {

		let NewAccount = new Account({
			name:account_name,
			owner:'EOS8SVW2HsgshobrTyZYEWHuWVMt9ASTUT5QnzV6VoUEfZsedvc3C'
		});

		NewAccount.setProvider(eos);

		NewAccount.create(this.creator, function(err, result) {
			if (err) {
				console.log(colors.red(err));
			} else {
				console.log(colors.cyan(result));
			}
		});
	});
	*/
	//DinoAccount.create(this.creator);
	/*
	let MyContract = Contract({
		name: 'members',
		creator: MyAccount.name,
		contractDir: __dirname+'/contracts',
		provider: eos
	});

	MyContract.publish();
	*/
}

let virosa = new Virosa(CONFIG);
//virosa.scan();
virosa.list();