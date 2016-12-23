var path = require('path');
var version = require('./package.json').version;
var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	entry: {
        dev: [
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, './index.js')
        ],
        dist: [
            path.resolve(__dirname, './index.js')
        ]
    },
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'Juzoom.js',
		library: 'Juzoom',
		libraryTarget: 'umd',
		publicPath: '/static/'
	},
	resolveLoader: {
		root: path.join(__dirname, 'node_modules')
	},
	plugins: [
		new webpack.DefinePlugin({
			__VERSION__: JSON.stringify(version)
		})
	],
	 plugins: [
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
};