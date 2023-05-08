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
if (merge) {
    fileList = config2ts.GetValidFileList(fileList).map(function (filename) {
        return path.join(dir, filename);
    });
    var mergeFile = path.join(outDir, merge);
    fs.writeFileSync(mergeFile, config2ts.GetTsStringFromFileList(fileList));
    console.log("config2ts, ".concat(fileList.length, " config files, merge into: ").concat(mergeFile));
}
else {
    config2ts.GetValidFileList(fileList).forEach(function (filename) {
        var target = path.join(outDir, "".concat(filename, ".ts"));
        fs.writeFileSync(target, config2ts.GetTsString(path.join(dir, filename)));
        console.log("config2ts, convert: ".concat(filename, " , to: ").concat(target));
    });
    console.log('config2ts convert done!');
}
