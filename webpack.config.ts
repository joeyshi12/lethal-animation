import * as path from "node:path";

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "docs"),
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
