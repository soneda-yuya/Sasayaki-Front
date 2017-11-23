const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		index: path.join(__dirname, 'src', 'front', './index.es6')
	},
	output: {
		path: path.join(__dirname, 'dest', 'front'),
		filename: '[name].bundle.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	],
	resolve: {
    	alias: {
      		'vue$': 'vue/dist/vue.esm.js'
    	}
	}
};
