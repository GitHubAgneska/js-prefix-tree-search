const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin'); Webpack5 => replaced with following
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // present by default in node-modules
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const target = "web";  => see target attr below

module.exports = merge(common, {
    mode: 'production',
    output: {
        filename: 'main.[contenthash].js',  // .[contenthash] = cache busting (generates new main.---.js at every change )
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimizer: [
            // new OptimizeCssWebpackPlugin(), // used alone, will only minify css & override default js minifying (terser)
            new CssMinimizerPlugin(),
            new TerserPlugin(), // completes previous to minify also js
            new HtmlWebpackPlugin({
                template: './src/index.html', // use this template to generate dist/html and inside include script "main.[contenthash].js"
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            }),
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css'}), // [name].[contenthash].css = issue in custom element components to find href
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({ patterns: [
                        { from: 'src/assets', to: 'assets/' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, // 3 - extract css into files ( ≠ dev where css included in js bundle)
                    { loader: 'css-loader',  // 2 - css => js
                        options: { 
                            url:true,
                        }
                    }, 
                    'sass-loader'   // 1 - scss => css
                ]
            }
        ]
    }
});
