import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/scripts/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/index.html',
      filename: 'index.html',
      chunks: ['renderer/main_window'],
    }),
    new HtmlWebpackPlugin({
      template: './src/views/header.html',
      filename: 'header.html',
      chunks: ['renderer/main_window'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    fallback: {
      path: require.resolve('path-browserify'),
    },
  },
};
