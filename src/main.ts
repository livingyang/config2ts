import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import {csv2tsFromFile} from './csv2ts';

program.version(require(path.join(__dirname, '../..', 'package.json'))['version']);

program
  .option('-d, --dir <path>', 'set convert path. default: ./')
  .option('-o, --outDir <path>', 'set outDir path. default: same as dir')
  .option('-p, --prefix <prefix>', 'set interface prefix. default: Csv')
  .option('-f, --force', 'force convert, will convert all csv file to ts')
  .parse(process.argv);

let dir = program['dir'] || '.';
let outDir = program['outDir'] || dir;
let prefix = program['prefix'] || 'Csv';
let forceWrite = Boolean(program['force']);

for (let filename of fs.readdirSync(dir)) {
    let pathObject = path.parse(filename);
        
    if (pathObject.ext === '.csv') {
        
        csv2tsFromFile(path.join(dir, filename), function(result) {
            let target = path.join(outDir, `${pathObject.name}.ts`);
            if (fs.existsSync(target) && forceWrite == false) {
                console.log(`csv2ts, skip convert: ${filename}`);
            }
            else {
                fs.writeFileSync(target, result);
                console.log(`csv2ts, convert: ${filename} , to: ${target}`);
            }
        }, prefix);
    }
}
console.log('csv2ts convert done!');