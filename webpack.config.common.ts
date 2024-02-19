import * as path from "node:path";

export const commonConfig = {
    entry: {
        "lc_doug_walker": "./src/lc_doug_walker.ts",
        "custom_shaders": "./src/custom_shaders.ts"
    },
    output: {
        path: path.join(__dirname, "docs"),
        filename: "[name]/main.js",
        chunkFormat: "array-push",
        hashFunction: "sha256"
    },
    performance: {
        hints: false
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
