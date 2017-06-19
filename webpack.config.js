const path = require('path');

module.exports = {
  devtool: 'cheap-source-map',
  entry: './src/index.js',
  devServer: {
    publicPath: '/dist/'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: 'source.map'
  }
};
