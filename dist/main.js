"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const program = require("commander");
const csv2ts_1 = require("./csv2ts");
program.version(require(path.join(__dirname, '..', 'package.json'))['version']);
program
    .option('-d, --dir <path>', 'set convert path. default: ./')
    .option('-o, --outDir <path>', 'set outDir path. default: same as dir')
    .option('-p, --prefix <prefix>', 'set interface prefix. default: empty')
    .option('-s, --suffix <suffix>', 'set interface suffix. default: Csv')
    .option('-m, --merge <name>', 'merge all to one ts file.')
    .parse(process.argv);
let dir = program['dir'] || '.';
let outDir = program['outDir'] || dir;
let prefix = program['prefix'] || '';
let suffix = program['suffix'] || 'Csv';
let merge = program['merge'];
let csvFiles = fs.readdirSync(dir).filter((filename) => {
    return path.parse(filename).ext === '.csv';
});
if (merge) {
    let csvFilePaths = csvFiles.map((filename) => {
        return path.join(dir, filename);
    });
    let mergeFile = path.join(outDir, merge);
    fs.writeFileSync(mergeFile, csv2ts_1.MergeTsFiles(csv2ts_1.csv2tsFromFileList(csvFilePaths, prefix, suffix)));
    console.log(`csv2ts, ${csvFiles.length} csv files, merge into: ${mergeFile}`);
}
else {
    csvFiles.forEach((filename) => {
        let target = path.join(outDir, `${filename}.ts`);
        fs.writeFileSync(target, csv2ts_1.csv2tsFromFile(path.join(dir, filename), prefix, suffix));
        console.log(`csv2ts, convert: ${filename} , to: ${target}`);
    });
    console.log('csv2ts convert done!');
}
//# sourceMappingURL=main.js.map