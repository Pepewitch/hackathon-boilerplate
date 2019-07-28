const path = require("path");
const withCSS = require("@zeit/next-css");
module.exports = withCSS({
  webpack: config => {
    config.resolve.modules.push(path.resolve("./"));
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: {
                removeViewBox: false
              }
            }
          }
        }
      ]
    });
    return config;
  },
  cssModules: false,
  target: "serverless"
});
