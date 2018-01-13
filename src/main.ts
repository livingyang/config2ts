import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import {csv2tsFromFile} from './csv2ts';

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
    Promise.all(csvFiles.map((filename) => {
        return csv2tsFromFile(path.join(dir, filename), prefix, suffix);
    })).then((results) => {
        let mergeFile = path.join(outDir, merge);
        fs.writeFileSync(mergeFile, results.join('\n'));
        console.log(`csv2ts, ${csvFiles.length} csv files, merge into: ${mergeFile}`);
    })
}
else {
    csvFiles.forEach((filename) => {
        csv2tsFromFile(path.join(dir, filename), prefix, suffix).then(function(result) {
            let target = path.join(outDir, `${filename}.ts`);
            fs.writeFileSync(target, result);
            console.log(`csv2ts, convert: ${filename} , to: ${target}`);
        });
    });
    console.log('csv2ts convert done!');
}
