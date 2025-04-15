const IgnoreWarningsPlugin = require('ignore-warnings');

module.exports = function override(config) {
  config.plugins.push(
    new IgnoreWarningsPlugin({
      test: /source-map-loader/,
      messageRegExp: /Failed to parse source map/,
    })
  );
  return config;
};