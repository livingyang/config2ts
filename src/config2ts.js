exports.GetValidFileList = exports.GetHeaderInfo = exports.GetTsStringFromFileList = exports.GetTsString = exports.Convert = void 0;
var path = require("path");
var fs = require("fs");
var d3 = require("d3");
var changeCase = require("change-case");
var toml = require('toml');
var packageJson = require('../package.json');
var EnumStr = 'Enum';
var EnumArrayString = 'Enum[]';
var IndexStr = 'Index';

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
                } else {
                    // console.log(`convert[k]: ${convert[k]}, d[k]: ${d[k]}, k: ${k}`)
                    if (convert[k] === 'String[]') {
                        d[k] = d[k].trim().split(',');
                    } else if (convert[k] === 'Number[]') {
                        d[k] = d[k].trim().split(',').map((val) => Number(val));
                    } else if (convert[k] === 'Enum[]') {
                        d[k] = d[k].trim().split(',');
                    }
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
        if (convert[field] == EnumStr) {
            let enumValues = [];
            for (const row of result) {
                let enumValue = row[field];
                if (!enumValues.includes(enumValue)) {
                    enumValues.push(enumValue);
                }
            }

            enumValues = enumValues.map((value) => {return `"${value}"`});
            template += `    export type ${field} = ${enumValues.join(' | ')};\n`;
            // general enum list for length test
            template += `    export const ${field}List: ${field}[] = [${enumValues.join(', ')}];\n\n`;
        } else if (convert[field] == EnumArrayString) {
            let enumValues = [];
            for (const row of result) {
                let enumArrayValue = row[field];
                for (const enumValue of enumArrayValue) {
                    if (!enumValues.includes(enumValue)) {
                        enumValues.push(enumValue);
                    }
                }
            }

            enumValues = enumValues.map((value) => {return `"${value}"`});
            template += `    export type ${field} = ${enumValues.join(' | ')};\n`;
            // general enum list for length test
            template += `    export const ${field}List: ${field}[] = [${enumValues.join(', ')}];\n\n`;
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
            } else if (convert[field] == IndexStr) {
                indexField = field;
            } else if (convert[field] == EnumArrayString) {
                fieldType = field + '[]';
            } else {
                fieldType = convert[field].toLowerCase();
            }
        }

        template += "        ".concat(field, ": ").concat(fieldType, ";\n");
    }
    template += '    };\n\n';
    // generate table
    template += "    export const List: Record[] = ";
    // console.log(prettyFormat(result, op));
    template += JSON.stringify(result, null, 4).replace(/\n/g, '\n    ');
    template += ';\n\n';
    if (indexField != null) {
        template += "    export const Map: { [id: string]: Record } = {};\n";
        template += `    for (const v of List) { Map[v.${indexField}] = v; };\n\n`;
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
        var fileString = fs.readFileSync(filePath).toString();
        if (fileString.charAt(0) === '\uFEFF') fileString = fileString.substr(1);
        return handle(fileString, moduleName);
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
