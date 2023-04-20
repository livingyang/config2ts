var fs = require("fs");
var config2ts = require("../src/config2ts");
test('convert csv file with id', function () {
    // console.log(config2ts.GetTsString('./config/data.csv'));
    expect(config2ts.GetTsString('./config/data.csv')).toBe(fs.readFileSync('./config/data.csv.ts').toString());
});
test('convert csv file without id', function () {
    expect(config2ts.GetTsString('./config/no-id.csv')).toBe(fs.readFileSync('./config/no-id.csv.ts').toString());
});
test('convert ini file', function () {
    expect(config2ts.GetTsString('./config/ini-file.ini')).toBe(fs.readFileSync('./config/ini-file.ini.ts').toString());
});
test('convert toml file', function () {
    // console.log(toml.parse(fs.readFileSync('./config/toml_file.toml')));
    expect(config2ts.GetTsString('./config/toml_file.toml')).toBe(fs.readFileSync('./config/toml_file.toml.ts').toString());
});
test('config2ts merge csv file list', function () {
    expect(config2ts.GetTsStringFromFileList(["./config/data.csv", "./config/no-id.csv"])).toBe(fs.readFileSync('./config/total.ts').toString());
});
test('config2ts merge csv file list', function () {
    expect(config2ts.GetValidFileList(['a.csv', 'b.ini', 'c.xxx'])).toEqual(['a.csv', 'b.ini']);
});
