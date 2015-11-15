var webpack = require( 'webpack' ),
	path = require( 'path' ),
	ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

// ?{browsers:['> 1%', 'last 2 versions', 'ff 17', 'opera 12.1', 'ie 8', 'ie 9']}

// create a list of plugins
var plugins = [
	// new webpack.optimize.CommonsChunkPlugin( 'vendor', 'vendor.js' ),
];

module.exports = {
	progress: true,
	output: {
		publicPath: '/js/',
		path: path.resolve( __dirname, './js' ),
		filename: '[name].js',
		chunkFilename: '[id].js'
	},
	resolve: {
		extensions: [ '', '.js', '.jsx' ],
		alias: {
			'store': path.join( __dirname, '/react/store' ),
			'utils': path.join( __dirname, '/react/utils' ),
		},
	},
	stats: { colors: true, reasons: true },
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: require.resolve( 'babel-loader' ) + '?stage=1',
				exclude: [ /node_modules/ ],
			},
			// {
			// 	test: /\.jsx?$/,
			// 	loader: 'eslint',
			// 	exclude: [ /node_modules/ ],
			// },
			{
				test: /\.json$/,
				loader: require.resolve( 'json-loader' )
			},
			{
				test: /\.scss$/,
				loader: 'css!autoprefixer!sass'
			}
		]
	},
	eslint: {
		configFile: path.join( __dirname, '.eslintrc' ),
		failOnError: true,
		quiet: true,
	},
	plugins: plugins
};
