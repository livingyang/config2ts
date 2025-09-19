var fs = require("fs");
var path = require("path");
var program = require("commander");
var config2ts = require("./config2ts");
program.version(require(path.join(__dirname, '..', 'package.json'))['version']);
program
    .option('-d, --dir <path>', 'set convert path. default: ./')
    .option('-o, --outDir <path>', 'set outDir path. default: ./')
    .option('-m, --merge <name>', 'merge all to one ts file.')
    .parse(process.argv);

const options = program.opts();
console.log(options);

var dir = options['dir'] || '.';
dir = path.resolve(dir);
console.log('dir:', dir);

var outDir = options['outDir'] || dir;
outDir = path.resolve(outDir);
console.log('outDir:', outDir);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {recursive: true});
}

var merge = options['merge'];
var fileList = fs.readdirSync(dir);

config2ts.startConvert(dir, outDir, merge);
