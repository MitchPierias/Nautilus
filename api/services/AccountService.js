// Environment
require('dotenv').config();
// Modules
const ApiService = require('./ApiService');

class AccountService extends ApiService {
	
	static async create(account_name) {
		try {
			const owner_key = process.env.EOS_PUBLIC_KEY;
			const active_key = process.env.EOS_PUBLIC_KEY;
			const data = account_name + owner_key + active_key;
			this.takeAction("newaccount", data).then((err, receipt) => {
				console.log("Created account", receipt);
			}).catch(err => {
				console.log("Error creating account", err);
			});
		} catch (err) {
			console.error(err);
		}
	}

	static async update(account_name) {
		try {
			this.takeAction("updateauth", data).then((err, receipt) => {
				console.log("Updated account", receipt);
			}).catch(err => {
				console.log("Error creating account", err);
			});
		} catch (err) {
			console.error(err);
		}
	}

	static async all(public_key = process.env.EOS_PUBLIC_KEY) {

		return new Promise((resolve, reject) => {

			this.getAction('/history/get_key_accounts', { public_key }).then(body => {
				resolve(body['account_names']);
			}).catch(error => {
				reject(error);
			});
		});
	}

	static async getCode(account_name) {

		return new Promise((resolve, reject) => {

			this.getAction('/chain/get_code', { account_name }).then(body => {
				resolve({code:body['code_hash'],name:body['account_name'],abi:(body['abi']||null)});
			}).catch(error => {
				reject(error);
			});
		});
	}

	static async getAccount(account_name) {

		return new Promise((resolve, reject) => {

			this.getAction('/chain/get_account', { account_name }).then(body => {
				resolve({
					name:body['account_name'],
					ram:{
						quota:body['ram_quota']||0,
						usage:body['ram_usage']||0,
					},
					cpu:{
						weight:body['cpu_weight']||0,
						usage:body['cpu_limit']['used']||0
					},
					permissions:body['permissions']||[]
				});
			}).catch(error => {
				reject(error);
			});
		});
	}
}

module.exports = AccountService;