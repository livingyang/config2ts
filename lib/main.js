"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const commander_1 = require("commander");
const config2ts_1 = require("./config2ts");
const pkgPath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
const program = new commander_1.Command();
program
    .version(pkg.version)
    .option("-n, --name <name>", "output file name (single mode) / index file name (split mode)", "csv.ts")
    .option("-d, --dir <path>", "set convert path", ".")
    .option("-o, --outDir <path>", "set outDir path")
    .option("-a, --assets <path>", "set assets resource directory for asset index (optional, skip asset index if omitted)")
    .option("-m, --mode <mode>", "output mode: single (merge into one file) or split (one file per table + index.ts)", "single")
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
(0, config2ts_1.startConvert)(dir, outDir, options.name, assetsDir, mode);
