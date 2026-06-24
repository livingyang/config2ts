import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { startConvert } from "./config2ts";

const pkgPath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const program = new Command();

program
  .version(pkg.version)
  .option("-d, --dir <path>", "set convert path. default: ./")
  .option("-o, --outDir <path>", "set outDir path. default: ./")
  .option("-m, --merge <name>", "merge all to one ts file.")
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

const merge: string | undefined = options.merge;

startConvert(dir, outDir, merge || null);
