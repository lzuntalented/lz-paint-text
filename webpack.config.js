module.exports = {
  entry: './src/entry.ts',
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
  mode: 'development',
  devServer: {
    port: 9000,
  },
}