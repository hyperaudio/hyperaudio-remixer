// @flow

import path from 'path';
// import info from './package.json';

// import { WDS_PORT } from './src/shared/config'
const WDS_PORT = 5555;

// import { isProd } from './src/shared/util'
// const isProd = false;

export default {
  entry: ['./src/loader'],
  output: {
    // filename: `${info.version}-bundle.js`,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`,
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/},
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: WDS_PORT,
  },
};
