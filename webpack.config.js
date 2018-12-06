const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const nodeModules = {};

fs.readdirSync('node_modules').filter(function(x) {
	return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = () => {
	// Load .env file
	const env = dotenv.config().parsed;
	// Reduce the environment variables to a string
	const envKeys = Object.keys(env).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(env[next]);
		return prev;
	}, {});

	return {
		externals: nodeModules,
		entry: ['./src/index.js'],
		target: 'node',
		output: {
			path: __dirname,
			publicPath: '/',
			filename: 'bundle.js'
		},
		module: {
			loaders: [
				{
					exclude: [
						/node_modules/,
						/.json?/
					],
					loader: 'babel-loader',
					query: {
						presets: ['react', 'es2016', 'stage-1']
					}
				}, {
					test: /\.css$/,
					loader: 'style-loader'
				}, {
					test: /\.css$/,
					loader: 'css-loader',
					query: {
						modules: true,
						localIdentName: '[name]_[local]_[hash:base64:4]'
					}
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin(envKeys)
		],
		resolve: {
			extensions: ['.js', '.jsx']
		},
		devServer: {
			historyApiFallback: true,
			contentBase: './',
			port: 4172
		}
	}
};