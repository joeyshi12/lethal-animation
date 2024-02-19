import * as path from "node:path";
import { commonConfig } from "./webpack.config.common";

module.exports = {
    ...commonConfig,
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, "docs")
        },
        compress: true,
        port: 8080,
    },
};
