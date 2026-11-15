import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { startConvert } from "./config2ts";

const pkgPath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const program = new Command();

program
  .version(pkg.version)
  .option("-n, --name <name>", "output file name (single mode) / index file name (split mode)", "csv.ts")
  .option("-d, --dir <path>", "set convert path", ".")
  .option("-o, --outDir <path>", "set outDir path")
  .option("-a, --assets <path>", "set assets resource directory for asset index (optional, skip asset index if omitted)")
  .option("-m, --mode <mode>", "output mode: single (merge into one file) or split (one file per table + index.ts)", "single")
  .option("--auto-qualify", "qualify merged-table keys as <file>:<index> so sibling member files that each number from 1 never collide", false)
  .parse(process.argv);

const options = program.opts();
console.log(options);

const dir = path.resolve(options.dir);
console.log("dir:", dir);

let outDir = options.outDir ? path.resolve(options.outDir) : dir;
console.log("outDir:", outDir);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const assetsDir = options.assets ? path.resolve(options.assets) : undefined;
if (assetsDir) {
  console.log("assetsDir:", assetsDir);
}

const mode = options.mode === "split" ? "split" : "single";
if (mode === "single" && options.mode !== "single") {
  console.warn(`[config2ts] warning: unknown mode "${options.mode}", falling back to "single"`);
}

const autoQualify = options.autoQualify === true || options.autoQualify === "true";
startConvert(dir, outDir, options.name, assetsDir, mode, autoQualify);
