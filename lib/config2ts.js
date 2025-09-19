"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
exports.GetTsString = GetTsString;
exports.GetTsStringFromFileList = GetTsStringFromFileList;
exports.GetHeaderInfo = GetHeaderInfo;
exports.GetValidFileList = GetValidFileList;
exports.startConvert = startConvert;
var path = require("path");
var fs = require("fs");
var d3 = require("d3");
var json5 = require("json5");
var changeCase = require("change-case");
var toml = require('toml');
var packageJson = require('../package.json');
var EnumStr = 'Enum';
var EnumIndexStr = 'EnumIndex';
var EnumArrayString = 'Enum[]';
var IndexStr = 'Index';
exports.Convert = {
    ini: function (str, moduleName) {
        var obj = toml.parse(str);
        return "export const ".concat(moduleName, " = ").concat(json5.stringify(obj, null, 4), ";");
    },
    csv: function (str, moduleName) {
        return csv2ts(str, moduleName);
    },
    toml: function (str, moduleName) {
        var obj = toml.parse(str);
        return "export const ".concat(moduleName, " = ").concat(json5.stringify(obj, null, 4), ";");
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
                // console.log(`convert[k]: ${convert[k]}, d[k]: ${d[k]}, k: ${k}`)
                if (global[convert[k]] instanceof Function) {
                    d[k] = global[convert[k]](d[k]);
                }
                else if (convert[k] === 'String[]') {
                    if (d[k] === '') {
                        // Enum array do not include empty string
                        d[k] = [];
                    }
                    else {
                        d[k] = d[k].trim().split(',').map(function (v) { return v.trim(); });
                    }
                }
                else if (convert[k] === 'Number[]') {
                    d[k] = d[k].trim().split(',').map(function (val) { return Number(val); });
                }
                else if (convert[k] === 'Enum[]') {
                    if (d[k] === '') {
                        // Enum array do not include empty string
                        d[k] = [];
                    }
                    else {
                        d[k] = d[k].trim().split(',').map(function (v) { return v.trim(); });
                    }
                }
                else {
                    d[k] = String(d[k]);
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
    // generate enum type
    for (var field in convert) {
        if (convert[field] == EnumStr || convert[field] == EnumIndexStr) {
            var enumValues = [];
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var row = result_1[_i];
                var enumValue = row[field];
                if (!enumValues.includes(enumValue)) {
                    enumValues.push(enumValue);
                }
            }
            enumValues = enumValues.map(function (value) { return "\"".concat(value, "\""); });
            template += "    export type ".concat(field, " = ").concat(enumValues.join(' | '), ";\n");
            // general enum list for length test
            template += "    export const ".concat(field, "List: ").concat(field, "[] = [").concat(enumValues.join(', '), "];\n\n");
        }
        else if (convert[field] == EnumArrayString) {
            var enumValues = [];
            for (var _a = 0, result_2 = result; _a < result_2.length; _a++) {
                var row = result_2[_a];
                var enumArrayValue = row[field];
                for (var _b = 0, enumArrayValue_1 = enumArrayValue; _b < enumArrayValue_1.length; _b++) {
                    var enumValue = enumArrayValue_1[_b];
                    if (!enumValues.includes(enumValue)) {
                        enumValues.push(enumValue);
                    }
                }
            }
            enumValues = enumValues.map(function (value) { return "\"".concat(value, "\""); });
            template += "    export type ".concat(field, " = ").concat(enumValues.join(' | '), ";\n");
            // general enum list for length test
            template += "    export const ".concat(field, "List: ").concat(field, "[] = [").concat(enumValues.join(', '), "];\n\n");
        }
    }
    // generate interface
    template += "    export interface Record {\n";
    var indexField = null;
    for (var field in convert) {
        // var fieldType = convert[field] !== '' ? convert[field].toLowerCase() : 'string';
        // console.log(`generate interface field: ${field}, convert[field]: ${convert[field]}`);
        var fieldType = 'string';
        if (convert[field] != '') {
            if (convert[field] == EnumStr) {
                fieldType = field;
            }
            else if (convert[field] == EnumIndexStr) {
                fieldType = field;
                indexField = field;
            }
            else if (convert[field] == IndexStr) {
                indexField = field;
            }
            else if (convert[field] == EnumArrayString) {
                fieldType = field + '[]';
            }
            else {
                fieldType = convert[field].toLowerCase();
            }
        }
        field = serializeField(field);
        template += "        ".concat(field, ": ").concat(fieldType, ";\n");
    }
    template += '    };\n\n';
    // remove object when index is empty
    if (indexField) {
        result = result.filter(function (v) {
            return v[indexField] !== '';
        });
    }
    // generate table
    template += "    export const List: Record[] = ";
    // console.log(prettyFormat(result, op));
    template += json5.stringify(result, null, 4).replace(/\n/g, '\n    ');
    template += ';\n\n';
    if (indexField != null) {
        template += "    export const Map: { [id: string]: Record } = {};\n";
        template += "    for (const v of List) { Map[v.".concat(indexField, "] = v; };\n\n");
    }
    template += "};";
    return template;
}
/**
 * serialize interface field
 * @param {string} field
 */
function serializeField(key) {
    var obj = {};
    obj[key] = true;
    var objString = json5.stringify(obj);
    // console.log('serializeField:', json5.stringify(obj))
    return objString.includes("'") ? "'" + key + "'" : key;
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
        var fileString = fs.readFileSync(filePath).toString();
        if (fileString.charAt(0) === '\uFEFF')
            fileString = fileString.substr(1);
        return handle(fileString, moduleName);
    }
    else {
        return '';
    }
}
function GetTsStringFromFileList(fileList) {
    return fileList.map(function (filePath) {
        return GetTsString(filePath);
    }).join('\n\n');
}
function GetHeaderInfo() {
    var header = "export let config2ts_version = \"".concat(packageJson.version, "\";\n\n");
    header += "export let config2ts_build_timestamp = ".concat(Date.now().toString(), ";\n\n");
    return header;
}
function GetValidFileList(fileList) {
    return fileList.filter(function (filePath) {
        return exports.Convert[GetFileExt(filePath)] != null;
    });
}
function startConvert(dir, outDir, merge) {
    var fileList = fs.readdirSync(dir);
    if (merge) {
        fileList = config2ts.GetValidFileList(fileList).map(function (filename) {
            return path.join(dir, filename);
        });
        var mergeFile = path.join(outDir, merge);
        fs.writeFileSync(mergeFile, config2ts.GetTsStringFromFileList(fileList), { encoding: 'utf-8' });
        console.log("config2ts, ".concat(fileList.length, " config files, merge into: ").concat(mergeFile));
    }
    else {
        config2ts.GetValidFileList(fileList).forEach(function (filename) {
            var target = path.join(outDir, "".concat(filename, ".ts"));
            fs.writeFileSync(target, config2ts.GetTsString(path.join(dir, filename)), { encoding: 'utf-8' });
            console.log("config2ts, convert: ".concat(filename, " , to: ").concat(target));
        });
        console.log('config2ts convert done!');
    }
}
