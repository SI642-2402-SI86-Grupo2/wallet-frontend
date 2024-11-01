const BrotliPlugin = require('brotli-webpack-plugin');

module.exports = {
  plugins: [
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.(js|css|html|svg)$/,
      threshold: 0,
      minRatio: 0.8,
    })
  ]
};
