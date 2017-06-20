const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  entry: './src/Index.js',
  devServer: {
    publicPath: '/dist/'
  },
  plugins:[
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: 'source.map'
  }
};
