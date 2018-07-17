const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true,
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /\.(js|jsx)$/,
        use: {
           loader: 'babel-loader',
           options: {
             presets: ['env', 'react', 'stage-2']
           }
        }
       }
    ]
  },
  stats: {
     colors: true
  },
  devtool: 'source-map',
};