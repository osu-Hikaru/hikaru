import { fileURLToPath } from "url";
import { dirname } from "path";
import nodemon from "nodemon";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

nodemon({
  script: path.join(__dirname, "src/index.ts"),
  watch: path.join(__dirname, "src/**"),
  inspect: true,
  ext: "ts,json",
  exec: `node --trace-warnings --env-file=development.env --loader ts-node/esm ${path.join(__dirname, "src/index.ts")} | pino-pretty`
});
