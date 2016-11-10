"use strict";
var fs = require('fs');
var path = require('path');
var program = require('commander');
var csv2ts_1 = require('./csv2ts');
program.version(require(path.join(__dirname, '../..', 'package.json'))['version']);
program
    .option('-d, --dir <path>', 'set convert path. default: ./')
    .option('-o, --outDir <path>', 'set outDir path. default: same as dir')
    .option('-p, --prefix <prefix>', 'set interface prefix. default: empty')
    .option('-s, --suffix <suffix>', 'set interface suffix. default: Csv')
    .option('-f, --force', 'force convert, will convert all csv file to ts')
    .parse(process.argv);
var dir = program['dir'] || '.';
var outDir = program['outDir'] || dir;
var prefix = program['prefix'] || '';
var suffix = program['suffix'] || 'Csv';
var forceWrite = Boolean(program['force']);
var _loop_1 = function(filename) {
    var pathObject = path.parse(filename);
    if (pathObject.ext === '.csv') {
        csv2ts_1.csv2tsFromFile(path.join(dir, filename), function (result) {
            var target = path.join(outDir, filename + ".ts");
            if (fs.existsSync(target) && forceWrite == false) {
                console.log("csv2ts, skip convert: " + filename);
            }
            else {
                fs.writeFileSync(target, result);
                console.log("csv2ts, convert: " + filename + " , to: " + target);
            }
        }, prefix, suffix);
    }
};
for (var _i = 0, _a = fs.readdirSync(dir); _i < _a.length; _i++) {
    var filename = _a[_i];
    _loop_1(filename);
}
console.log('csv2ts convert done!');
//# sourceMappingURL=main.js.map