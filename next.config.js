/** @type {import('next').NextConfig} */
const fs = require('fs');
/** @type {import('next').NextConfig} */
const BASE_PATH = process.env.BASE_PATH || '';
const nextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  compress: true,
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webm|cr3|dng)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/[path][name].[hash][ext]',
      },
    });
    // TODO: LOAD 3d model parser
    config.module.rules.push({
      test: /\.wgsl$/i,
      use: 'raw-loader',
    });
    config.plugins.push(
      new webpack.DefinePlugin({
        __SOURCE__: webpack.DefinePlugin.runtimeValue((v) => {
          // Load the source file and set it as a global definition.
          // This is useful for easily embedding a file's source into the page.
          const source = fs.readFileSync(v.module.userRequest, 'utf-8');
          return JSON.stringify(source); // Strings need to be wrapped in quotes
        }, []),
      }),
    );

    if (!config.node) {
      config.node = {};
    }

    config.node.__filename = true;
    config.node.__dirname = true;

    return config;
  },
  env: {
    REPOSITORY_NAME: 'raw_photo_analyzer1',
  },
};

module.exports = nextConfig;
