const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      Tone: path.resolve(__dirname, '/node_modules/tone/Tone')
    },
    modules : ['node_modules']
  },
  watch: true,
  module: {
    rules: [
      {
        exclude: /(node_modules|bower_components)/,
        test: /\.js$/,
        use: {
           loader: 'babel-loader',
           options: {
             presets: ['env']
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