const path = require('path');

module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: './src/Index.js',
  devServer: {
    publicPath: '/dist/',
    watchOptions: {
      ignored: /node_modules/
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: 'source.map'
  }
};
