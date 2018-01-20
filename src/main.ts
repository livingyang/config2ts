import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import {GetTsString, GetHeaderInfo, GetValidFileList, GetTsStringFromFileList} from './config2ts';

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
    fileList = GetValidFileList(fileList).map((filename) => {
        return path.join(dir, filename);
    });
    let mergeFile = path.join(outDir, merge);
    fs.writeFileSync(mergeFile, GetHeaderInfo() + GetTsStringFromFileList(fileList));
    console.log(`config2ts, ${fileList.length} config files, merge into: ${mergeFile}`);
}
else {
    GetValidFileList(fileList).forEach((filename) => {
        let target = path.join(outDir, `${filename}.ts`);
        fs.writeFileSync(target, GetTsString(path.join(dir, filename)));
        console.log(`config2ts, convert: ${filename} , to: ${target}`);
    });
    console.log('config2ts convert done!');
}
