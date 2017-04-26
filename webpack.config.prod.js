import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackMd5Hash from 'webpack-md5-hash';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    debug: true,
    devtool: 'source-map',
    noInfo: false,
    entry: {
        vendor: path.resolve(__dirname, 'src/vendor'),
        main: path.resolve(__dirname, 'src/index')
    },
    target: 'web',
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: '/',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        // Generate an external css file with hash in the filename
        new ExtractTextPlugin('[name].[contenthash].css'),

        // hash the files using MD5 so that thier names chnage when the content changes.
        new WebpackMd5Hash(),

        // create a separate bundle for vendor libraries so that they can be cahced separately
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),

        // Create HTML file that include reference to bundle JS.
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true,
            // properties defined here are available in index.html using htmlwebpackPlugin.options.varName
            tackJSToken: '1eb0fb0af1db4fa4b1478c3bca423ad2'
        }),

        // Eliminate duplicate packages when generating bundle
        new webpack.optimize.DedupePlugin(),

        // Minify JS
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
            //{test: /\.css$/, loaders: ['style', 'css']}
            {test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap')}
        ]
    }
}