const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

function clean() {
  const outDir = path.resolve(__dirname, 'dist');
  [path.resolve(outDir, 'bundle.js'), path.resolve(outDir, 'source.map')].forEach(filePath => fs.unlinkSync(filePath));
};

clean();

module.exports = {
  devtool: 'source-map',
  entry: './src/Index.js',
  plugins:[
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    sourceMapFilename: 'source.map'
  }
};
