"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const program = require("commander");
const config2ts_1 = require("./config2ts");
program.version(require(path.join(__dirname, '..', 'package.json'))['version']);
program
    .option('-d, --dir <path>', 'set convert path. default: ./')
    .option('-o, --outDir <path>', 'set outDir path. default: same as dir')
    .option('-m, --merge <name>', 'merge all to one ts file.')
    .parse(process.argv);
let dir = program['dir'] || '.';
let outDir = program['outDir'] || dir;
let merge = program['merge'];
let fileList = fs.readdirSync(dir);
if (merge) {
    fileList = (0, config2ts_1.GetValidFileList)(fileList).map((filename) => {
        return path.join(dir, filename);
    });
    let mergeFile = path.join(outDir, merge);
    fs.writeFileSync(mergeFile, (0, config2ts_1.GetHeaderInfo)() + (0, config2ts_1.GetTsStringFromFileList)(fileList));
    console.log(`config2ts, ${fileList.length} config files, merge into: ${mergeFile}`);
}
else {
    (0, config2ts_1.GetValidFileList)(fileList).forEach((filename) => {
        let target = path.join(outDir, `${filename}.ts`);
        fs.writeFileSync(target, (0, config2ts_1.GetTsString)(path.join(dir, filename)));
        console.log(`config2ts, convert: ${filename} , to: ${target}`);
    });
    console.log('config2ts convert done!');
}
