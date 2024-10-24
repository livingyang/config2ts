var fs = require("fs");
var config2ts = require("../src/config2ts");

var reg = /[\t\r\f\n\s]*/g;
function getTsFileString(tsFilePath) {
    return fs.readFileSync(tsFilePath).toString().replace(reg, '');
}

test('convert csv file with id', function () {
    expect(config2ts.GetTsString('./config/data.csv').replace(reg, '')).toBe(getTsFileString('./config/data.csv.ts'));
});
test('convert csv file without id', function () {
    expect(config2ts.GetTsString('./config/no-id.csv').replace(reg, '')).toBe(getTsFileString('./config/no-id.csv.ts'));
});
test('convert ini file', function () {
    expect(config2ts.GetTsString('./config/ini-file.ini').replace(reg, '')).toBe(getTsFileString('./config/ini-file.ini.ts'));
});
test('convert toml file', function () {
    // console.log(config2ts.GetTsString('./config/toml_file.toml'))
    expect(config2ts.GetTsString('./config/toml_file.toml').replace(reg, '')).toBe(getTsFileString('./config/toml_file.toml.ts'));
});
test('config2ts merge csv file list', function () {
    expect(config2ts.GetTsStringFromFileList(["./config/data.csv", "./config/ini-file.ini", "./config/no-id.csv", "./config/toml_file.toml"]).replace(reg, '')).toBe(fs.readFileSync('./config/total.ts').toString().replace(/\s/g, ''));
});
test('config2ts GetValidFileList', function () {
    expect(config2ts.GetValidFileList(['a.csv', 'b.ini', 'c.xxx'])).toEqual(['a.csv', 'b.ini']);
});
