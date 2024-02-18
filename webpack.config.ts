import * as path from "node:path";

module.exports = {
    mode: "production",
    entry: {
        "lc_doug_walker": "./src/lc_doug_walker.ts",
        "custom_shaders": "./src/custom_shaders.ts"
    },
    output: {
        path: path.join(__dirname, "docs"),
        publicPath: "docs/",
        filename: "js/[name].js",
        chunkFormat: "array-push",
        hashFunction: "sha256"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            }
        ]
    }
};
