exports.GetValidFileList = exports.GetHeaderInfo = exports.GetTsStringFromFileList = exports.GetTsString = exports.Convert = void 0;
var path = require("path");
var fs = require("fs");
var d3 = require("d3");
var changeCase = require("change-case");
var toml = require('toml');
var packageJson = require('../package.json');
exports.Convert = {
    ini: function (str, moduleName) {
        var obj = toml.parse(str);
        return "export const ".concat(moduleName, " = ").concat(JSON.stringify(obj, null, 4), ";");
    },
    csv: function (str, moduleName) {
        return csv2ts(str, moduleName);
    },
    toml: function (str, moduleName) {
        var obj = toml.parse(str);
        return "export const ".concat(moduleName, " = ").concat(JSON.stringify(obj, null, 4), ";");
    }
};
function csv2ts(csvString, moduleName) {
    var convert = {};
    var result = d3.csvParse(csvString, function (d, i) {
        if (i === 0) {
            convert = d;
            return null;
        }
        else {
            for (var k in d) {
                if (global[convert[k]] instanceof Function) {
                    d[k] = global[convert[k]](d[k]);
                }
            }
            return d;
        }
    });
    // 删除columns属性
    delete result.columns;
    if (result.length <= 0) {
        return "";
    }
    var template = "export namespace ".concat(moduleName, " {\n\n");
    // generate interface
    template += "    export interface Record {\n";
    for (var field in convert) {
        var fieldType = convert[field] !== '' ? convert[field].toLowerCase() : 'string';
        template += "        ".concat(field, ": ").concat(fieldType, ";\n");
    }
    template += '    };\n\n';
    // generate table
    template += "    export const List: Record[] = ";
    // console.log(prettyFormat(result, op));
    template += JSON.stringify(result, null, 4).replace(/\n/g, '\n    ');
    template += ';\n\n';
    if (convert['id'] === 'String') {
        template += "    export const Map: { [id: string]: Record } = {};\n";
        template += "    for (const v of List) { Map[v.id] = v; };\n\n";
    }
    template += "};";
    return template;
}
function GetFileExt(filePath) {
    var pathObject = path.parse(filePath);
    return pathObject.ext.slice(1);
}
function GetTsString(filePath) {
    var pathObject = path.parse(filePath);
    var handle = exports.Convert[GetFileExt(filePath)];
    if (handle) {
        var moduleName = changeCase.pascalCase(pathObject.base);
        return handle(fs.readFileSync(filePath).toString(), moduleName);
    }
    else {
        return '';
    }
}
exports.GetTsString = GetTsString;
function GetTsStringFromFileList(fileList) {
    return fileList.map(function (filePath) {
        return GetTsString(filePath);
    }).join('\n\n');
}
exports.GetTsStringFromFileList = GetTsStringFromFileList;
function GetHeaderInfo() {
    var header = "export let config2ts_version = \"".concat(packageJson.version, "\";\n\n");
    header += "export let config2ts_build_timestamp = ".concat(Date.now(), ";\n\n");
    return header;
}
exports.GetHeaderInfo = GetHeaderInfo;
function GetValidFileList(fileList) {
    return fileList.filter(function (filePath) {
        return exports.Convert[GetFileExt(filePath)] != null;
    });
}
exports.GetValidFileList = GetValidFileList;
