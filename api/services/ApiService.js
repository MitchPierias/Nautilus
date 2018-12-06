// Environment
require('dotenv').config();
// Modules
const { Api, JsonRpc, RpcError, JsSignatureProvider } = require('eosjs');
const { TextDecoder, TextEncoder } = require('text-encoding');
const request = require('request');
// Defaults
const API_REQUEST_METHOD = "POST";
const API_JSON_RESPONSE = true;
const API_VERSION = process.env.EOS_API_VERSION || "v1";
const API_HTTP_ENDPOINT = process.env.EOS_HTTP_ENDPOINT || "http://127.0.0.1:8888";
// Configuration
const DEFAULT_OPTIONS = { method:API_REQUEST_METHOD, json:API_JSON_RESPONSE }

class ApiService {
	
	static async takeAction(action, dataValue) {

		const rpc = new JsonRpc(process.env.EOS_HTTP_ENDPOINT);
		const signatureProvider = new JsSignatureProvider([process.env.EOS_PRIVATE_KEY]);
		const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
		
		try {
			const resultWithConfig = await api.transact({
				actions: [{
					account: process.env.EOS_CONTRACT_NAME,
					name: action,
					authorization: [{
						actor: "eosio",
						permission: "active"
					}],
					data: dataValue,
				}]
			}, {
				blocksBehind: 3,
				expireSeconds: 30,
			});

			return resultWithConfig;
		} catch (err) {
			throw(err)
		}
	}

	static async getAction(action, params = {}) {

		const options = Object.assign({
			url:API_HTTP_ENDPOINT+"/"+API_VERSION+action,
			body:params
		}, DEFAULT_OPTIONS);

		return new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) throw new Error(error);

				if (body.code === 500) {
					reject(body.message);
				} else {
					resolve(body);
				}
			});
		});
	}
}

module.exports = ApiService;