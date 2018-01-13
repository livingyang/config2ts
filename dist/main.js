"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const program = require("commander");
const csv2ts_1 = require("./csv2ts");
program.version(require(path.join(__dirname, '../..', 'package.json'))['version']);
program
    .option('-d, --dir <path>', 'set convert path. default: ./')
    .option('-o, --outDir <path>', 'set outDir path. default: same as dir')
    .option('-p, --prefix <prefix>', 'set interface prefix. default: empty')
    .option('-s, --suffix <suffix>', 'set interface suffix. default: Csv')
    .option('-f, --force', 'force convert, will convert all csv file to ts')
    .parse(process.argv);
let dir = program['dir'] || '.';
let outDir = program['outDir'] || dir;
let prefix = program['prefix'] || '';
let suffix = program['suffix'] || 'Csv';
let forceWrite = Boolean(program['force']);
for (let filename of fs.readdirSync(dir)) {
    let pathObject = path.parse(filename);
    if (pathObject.ext === '.csv') {
        csv2ts_1.csv2tsFromFile(path.join(dir, filename), function (result) {
            let target = path.join(outDir, `${filename}.ts`);
            if (fs.existsSync(target) && forceWrite == false) {
                console.log(`csv2ts, skip convert: ${filename}`);
            }
            else {
                fs.writeFileSync(target, result);
                console.log(`csv2ts, convert: ${filename} , to: ${target}`);
            }
        }, prefix, suffix);
    }
}
console.log('csv2ts convert done!');
//# sourceMappingURL=main.js.map