const { ProvidePlugin } = require('webpack');
require('dotenv').config()

module.exports = function (config, env) {
    
    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.(m?js|ts)$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                },
            ],
        },
        plugins: [
            ...config.plugins,
            new ProvidePlugin({
                process: 'process/browser',
            }),
        ],
        resolve: {
            ...config.resolve,
            fallback: {
                "fs": false,
                "os": require.resolve("os-browserify/browser"),
                "path": require.resolve("path-browserify"),
                assert: require.resolve('assert'),
                buffer: require.resolve('buffer'),
                stream: require.resolve('stream-browserify'),
                crypto: require.resolve('crypto-browserify'),
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
    };
};