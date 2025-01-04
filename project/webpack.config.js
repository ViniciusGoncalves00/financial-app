const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/scripts/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'static'),
    },
    devtool: "inline-source-map",
    target: 'electron-renderer',
    mode: "development",
    devServer: {
        static: {
            directory: path.resolve(__dirname, "static"),
        },
        port: 3000,
        open: true,
        compress: true,
        historyApiFallback: true,
        watchFiles: [path.resolve(__dirname, "./src/**/*.html")],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            fs: false, // Desativa 'fs' para o navegador
            path: require.resolve("path-browserify"), // Adiciona um polyfill para 'path'
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: "./src/views/index.html", // Origem
          filename: "index.html", // Gera em static
        }),
      ],
    
};
