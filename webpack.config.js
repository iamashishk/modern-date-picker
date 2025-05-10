const path = require('path');

module.exports = {
    entry: './src/flight-date-picker.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'flight-date-picker.js',
        library: {
            name: 'FlightDatePicker',
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
    }
}; 