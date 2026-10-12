const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.js",
        notFound: "./src/404.js",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/dist/[name].js",
        publicPath: "/",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        },
                    },
                    "postcss-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "src/views/index.html",
            inject: false,
            chunks: ["main"],
        }),
        new HtmlWebpackPlugin({
            filename: "404.html",
            template: "src/views/404.html",
            inject: false,
            chunks: ["notFound"],
        }),
        new MiniCssExtractPlugin({
            filename: "css/dist/[name].css",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "public",
                    to: ".",
                },
            ],
        }),
    ],
    optimization: {
        minimizer: ["...", new CssMinimizerPlugin()],
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
};
