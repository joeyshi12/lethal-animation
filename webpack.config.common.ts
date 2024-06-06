import * as path from "node:path";

export const commonConfig = {
    entry: {
        "lc_doug_walker": {
            import: "./src/lc_doug_walker.ts",
            dependOn: "three"
        },
        "custom_emotes": {
            import: "./src/custom_emotes.ts",
            dependOn: "three"
        },
        "three": "three"
    },
    output: {
        path: path.join(__dirname, "docs"),
        filename: "js/[name].js",
        chunkFormat: "array-push",
        hashFunction: "sha256"
    },
    optimization: {
        runtimeChunk: "single"
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
