// Modules
const ElectronStore = require('electron-store');
const createHash = require('create-hash');
const fs = require('fs');
const crypto = require('crypto');
// Configuration
const CONFIG = {
	name:'files',
	defaults:{}
}

const shouldLink = true;

const HASH_LENGTH = 8;

const DEFAULT_FILE_DATA = {
	uid:'',
	name:'',
	extension:'',
	path:'',
	file:'',
	modified:false,
	deployed:false,
	size:0,
	version:false
}

class FileStore extends ElectronStore {
	
	constructor() {
		super({name:'files',defaults:{}});
	}

	async add(path, data, shouldLink = false) {
		const codeVersion = await versionFromFileAtPath(path);
		data.version = codeVersion;
		this.update(path, data);
		// Link to contract
		const type = (data.extension === 'cpp' || data.extension === 'hpp') ? 'contract' : data.extension;
		if (data.extension === 'hpp') return;
		linkContract(data.name, { [type]:generateUid(path) });
	}

	update(path, data) {

		const uid = generateUid(path);
		data.uid = uid;
		//data.version = await versionFromFileAtPath(path);
		data = cleanse(data);
		const file = this.get(uid, DEFAULT_FILE_DATA);
		const merged = Object.assign(file, data);
		this.set(uid, merged);
	}

	async modified(fullPath, timestamp) {
		if ('number' !== typeof timestamp) timestamp = +new Date;
		const codeVersion = await versionFromFileAtPath(fullPath);
		this.update(fullPath, { modified:codeVersion });
	}

	async compiled(fullPath) {
		const codeVersion = await versionFromFileAtPath(fullPath);
		this.update(fullPath, { version:codeVersion });
	}
}

function generateUid(fullPath) {
	return createHash('sha1').update(fullPath).digest('hex');
}

function cleanse(obj, schema) {
	// Should cleanse data props
	return obj;
}

async function versionFromFileAtPath(pathToFile = '/some/file/name.txt') {

	return new Promise((resolve, reject) => {
		// the file you want to get the hash    
		let stream = fs.createReadStream(pathToFile);
		let hash = crypto.createHash('sha1');
		hash.setEncoding('hex');

		stream.on('end', function() {
			hash.end();
			resolve(hash.read());
		});
		// read all file and pipe it (write it) to the hash object
		stream.pipe(hash);
	});
}

/**
 * CONTRACTS
 */

const contracts = new ElectronStore({
	name:'contracts',
	defaults:{}
});

const DEFAULT_CONTRACT_DATA = {
	name:'',
	code:'',
	path:'',
	contract:false,
	entry:false,
	wasm:false,
	abi:false,
	modified:false,
	deployed:false,
	compiled:false,
	notifications:0
}

function linkContract(account_name, data = {}) {
	if ('string' !== typeof account_name || account_name.length <= 0) {
		console.log("Invalid account name "+account_name);
		return;
	}
	data = cleanse(data);
	const contract = contracts.get(account_name, DEFAULT_CONTRACT_DATA);
	if (contract.name === '') contract.name = account_name;
	const merged = Object.assign(contract, data);
	contracts.set(account_name, merged);
}

/**
 * ACCOUNTS
 */

const DEFAULT_ACCOUNT_DATA = {
	name:'',
	code:'',
	contract:false,
}

class AccountStore extends ElectronStore {

	constructor() {
		super({name:'accounts',defaults:{}});
	}

	update(account) {
		const user = this.get(account.name, DEFAULT_ACCOUNT_DATA);
		const merged = Object.assign(user, account);
		this.set(account.name, merged);
	}

	syncCache(account_names=[]) {
		let cachedAccounts = this.store;
		/*
		account_names.forEach({ name } => {
			if (!cachedAccounts[name]) {
				this.delete(name);
			}
		});
		*/
	}
}

class SettingStore extends ElectronStore {

	constructor() {
		super({name:'settings',defaults:{}});
	}
}

module.exports = {
	files: new FileStore,
	contracts,
	accounts: new AccountStore,
	settings: new SettingStore
};