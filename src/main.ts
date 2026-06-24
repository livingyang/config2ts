import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { startConvert } from "./config2ts";

const pkgPath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const program = new Command();

program
  .version(pkg.version)
  .option("-n, --name <name>", "output file name", "csv.ts")
  .option("-d, --dir <path>", "set convert path. default: ./")
  .option("-o, --outDir <path>", "set outDir path. default: ./")
  .parse(process.argv);

const options = program.opts();
console.log(options);

let dir: string = options.dir || ".";
dir = path.resolve(dir);
console.log("dir:", dir);

let outDir: string = options.outDir || dir;
outDir = path.resolve(outDir);
console.log("outDir:", outDir);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

startConvert(dir, outDir, options.name);
