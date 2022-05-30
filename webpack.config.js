const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  entry: {
    main: isProd ? './src/index.ts' : './demo/entry.ts',
    demo: './demo/entry.ts',
  },
  output: {
    library: 'LzPaintText'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({ // Also generate a test.html
      chunks: [],
      filename: 'index.html',
      template: './public/index.html',
      templateParameters: {
        jsPath: `demo`,
        urlPath: isProd ? '//www.lzuntalented.cn/img/paint/' : './'
      },
    }),
  ],
  mode: process.NODE_ENV,
  devServer: {
    port: 9000,
  },
}