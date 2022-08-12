var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    plugins: [
        new ExtractTextPlugin("chronocon.min.css"),
    ],
    resolve: {
        alias:{
            jsdir: path.resolve( __dirname, 'js'),
            cssdir: path.resolve( __dirname, 'css'),
        },
        extensions: ['.js']
    },
    resolveLoader: {
        moduleExtensions: ['-loader']
    },
    entry: {
        "main":"jsdir/controllers/main.js", 
        "map":"jsdir/controllers/map.js",
        'chronocon.min.css': [
            path.resolve(__dirname, 'css/jquery.jscrollpane.css'),
            path.resolve(__dirname, 'css/date.css'),
            path.resolve(__dirname, 'css/main.css'),
            path.resolve(__dirname, 'css/map.css'),
            path.resolve(__dirname, 'css/map_frame.css'),
            path.resolve(__dirname, 'css/popup.css'),
            path.resolve(__dirname, 'css/popups_lib.css'),
            path.resolve(__dirname, 'css/saver_menu.css'),
            path.resolve(__dirname, 'css/textpanel.css'),
            path.resolve(__dirname, 'css/timeline.css'),
            path.resolve(__dirname, 'css/unit_panels.css'),
            path.resolve(__dirname, 'css/user_menu.css')
          ],
      },
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    module: {
        rules: [
            {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: ['react']
                }
              }
            ],
          },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
        ]
    },
};
