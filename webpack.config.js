const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: './src/modern-date-picker.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'modern-date-picker.min.js',
        library: {
            name: 'ModernDatePicker',
            type: 'umd',
            export: 'default'
        },
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    externals: {
        jquery: {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            root: 'jQuery'
        }
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `/*!
 * Modern Date Picker v1.0.0
 * https://github.com/iamashishk/modern-date-picker
 *
 * Copyright (c) 2025 Ashish Kohli
 * Licensed under the GNU General Public License v3.0
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * A modern, lightweight date picker with smooth animations and timezone support
 */`,
            raw: true,
            entryOnly: true
        })
    ]
}; 