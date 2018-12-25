const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const HtmlWebPackPlugin = require("html-webpack-plugin");

/**
 * HTML Webpack Plugin
 * @desc Configuration for building the HTML page
 * @note Some props are injected and some are configuration (rendering) settings
 */
const htmlPlugin = new HtmlWebPackPlugin({
	title: "Nautilus",
	template: path.resolve(__dirname,'src/index.html'),
	filename: "index.html"
});

const nodeModules = {};

fs.readdirSync('node_modules').filter(function(x) {
	return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

/**
 * Webpack Configuration
 */
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
		entry: ['babel-polyfill','./src/index.js'],
		target: 'electron-renderer',
		output: {
			path: path.resolve(__dirname,'build'),
			publicPath: '/',
			filename: 'bundle.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: [
						/node_modules/,
						/.json$/
					],
					loader: 'babel-loader',
					query: {
						presets: ['env','react','es2015','stage-1']
					}
				}, {
					test: /\.(s*)css$/,
					use: ['style-loader','css-loader']
				}
			]
		},
		plugins: [
			htmlPlugin,
			new webpack.DefinePlugin(envKeys),
			new webpack.HotModuleReplacementPlugin()
		],
		resolve: {
			extensions: ['.js', '.jsx']
		},
		devServer: {
			publicPath:'http://localhost:9000',
			contentBase: path.join(__dirname,'assets'),
			open: false,
			lazy: false,
			compress: true,
			historyApiFallback: true,
			port: 9000
		}
	}
};