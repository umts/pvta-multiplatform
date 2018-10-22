var path = require('path');
var webpack = require('webpack');

var projectRootDir = process.env.IONIC_ROOT_DIR;
var appScriptsDir = process.env.IONIC_APP_SCRIPTS_DIR;

var config = require(path.join(appScriptsDir, 'config', 'webpack.config.js'));

var env = process.env.IONIC_ENV || 'dev';
var envVars;
try {
  envVars = require(path.join(projectRootDir, 'env', env + '.json'));
} catch(e) {
  envVars = {};
}

config.plugins = config.plugins || []
config.plugins.push(
  new webpack.DefinePlugin({
    ENV: Object.assign(envVars, {
      environment: JSON.stringify(env)
    })
  })
);
config.plugins.push(
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(require("./package.json").version)
  })
);

if (env === 'prod') {
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
}

module.exports = config;
