import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8")
);
import { config } from "dotenv";
config();

export default {
  appName: pkg.name,
  appVersion: pkg.version,
  mongodb: {
    url: process.env.MONGODB_URL,
  },
};
