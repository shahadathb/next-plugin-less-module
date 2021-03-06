const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

/** Provide nextConfig options along with less & css loader options
 * @param {nextConfig}
 * @param {lessOptions} for available options http://lesscss.org/usage/#less-options
 * @param {cssLoaderOptions}  https://github.com/webpack-contrib/css-loader#options
 */

module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  webpack: (config, options) => {
    const { dev } = options;
    const { lessOptions = {}, cssLoaderOptions = {} } = nextConfig;

    config.module.rules.push({
      test: /\.less$/,
      use: [
        ExtractCssChunks.loader,
        {
          loader: "css-loader",
          options: { ...cssLoaderOptions, importLoaders: 1 },
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: { ...lessOptions, javascriptEnabled: true },
          },
        },
      ],
    });

    config.plugins.push(
      new ExtractCssChunks({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        // eslint-disable-next-line prettier/prettier
        filename: dev
          ? "static/chunks/[name].css"
          : "static/chunks/[name].[contenthash:8].css",
        chunkFilename: dev
          ? "static/chunks/[name].chunk.css"
          : "static/chunks/[name].[contenthash:8].chunk.css",
        orderWarning: false,
        reloadAll: true,
      })
    );

    if (typeof nextConfig.webpack === "function")
      return nextConfig.webpack(config, options);

    return config;
  },
});
