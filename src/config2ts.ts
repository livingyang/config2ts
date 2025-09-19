import * as path from "path";
import * as fs from "fs";
import {csvParse} from "d3-dsv";
import * as json5 from "json5";
import * as changeCase from "change-case";
import * as toml from 'toml';
const EnumStr = 'Enum';
const EnumIndexStr = 'EnumIndex';
const EnumArrayString = 'Enum[]';
const IndexStr = 'Index';

export const Convert = {
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
    var result = csvParse(csvString, function (d, i) {
        if (i === 0) {
            convert = d;
            return null;
        }
        else {
            for (var k in d) {
                // console.log(`convert[k]: ${convert[k]}, d[k]: ${d[k]}, k: ${k}`)
                if (global[convert[k]] instanceof Function) {
                    d[k] = global[convert[k]](d[k]);
                } else if (convert[k] === 'String[]') {
                    if (d[k] === '') {
                        // Enum array do not include empty string
                        d[k] = [];
                    } else {
                        d[k] = d[k].trim().split(',').map((v) => v.trim());
                    }
                } else if (convert[k] === 'Number[]') {
                    d[k] = d[k].trim().split(',').map((val) => Number(val));
                } else if (convert[k] === 'Enum[]') {
                    if (d[k] === '') {
                        // Enum array do not include empty string
                        d[k] = [];
                    } else {
                        d[k] = d[k].trim().split(',').map((v) => v.trim());
                    }
                } else {
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
            let enumValues: any[] = [];
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
            let enumValues: any = [];
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
    var indexField: string | null = null;
    for (var field in convert) {
        // var fieldType = convert[field] !== '' ? convert[field].toLowerCase() : 'string';
        // console.log(`generate interface field: ${field}, convert[field]: ${convert[field]}`);
        var fieldType = 'string';

        if (convert[field] != '') {
            if (convert[field] == EnumStr) {
                fieldType = field;
            } else if (convert[field] == EnumIndexStr) {
                fieldType = field;
                indexField = field;
            } else if (convert[field] == IndexStr) {
                indexField = field;
            } else if (convert[field] == EnumArrayString) {
                fieldType = field + '[]';
            } else {
                fieldType = convert[field].toLowerCase();
            }
        }

        field = serializeField(field)
        template += "        ".concat(field, ": ").concat(fieldType, ";\n");
    }
    template += '    };\n\n';
    
    // remove object when index is empty
    if (indexField) {
        result = result.filter((v) => {
            return v[indexField] !== '';
        })
    }

    // generate table
    template += "    export const List: Record[] = ";
    // console.log(prettyFormat(result, op));
    template += json5.stringify(result, null, 4).replace(/\n/g, '\n    ');
    template += ';\n\n';
    if (indexField != null) {
        template += "    export const Map: { [id: string]: Record } = {};\n";
        template += `    for (const v of List) { Map[v.${indexField}] = v; };\n\n`;
    }
    template += "};";
    return template;
}

/**
 * serialize interface field
 * @param {string} field 
 */
function serializeField(key) {
    const obj = {}
    obj[key] = true
    const objString = json5.stringify(obj);
    // console.log('serializeField:', json5.stringify(obj))
    return objString.includes("'") ? "'" + key + "'" : key;
}

function GetFileExt(filePath) {
    var pathObject = path.parse(filePath);
    return pathObject.ext.slice(1);
}
export function GetTsString(filePath) {
    var pathObject = path.parse(filePath);
    var handle = Convert[GetFileExt(filePath)];
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

export function GetTsStringFromFileList(fileList) {
    return fileList.map(function (filePath) {
        return GetTsString(filePath);
    }).join('\n\n');
}

export function GetValidFileList(fileList) {
    return fileList.filter(function (filePath) {
        return Convert[GetFileExt(filePath)] != null;
    });
}

export function startConvert(dir: string, outDir: string, merge: string | null) {
    var fileList = fs.readdirSync(dir);
    if (merge) {
        fileList = GetValidFileList(fileList).map(function (filename) {
            return path.join(dir, filename);
        });
        var mergeFile = path.join(outDir, merge);
        fs.writeFileSync(mergeFile, GetTsStringFromFileList(fileList), {encoding: 'utf-8'});
        console.log(`config2ts, ${fileList.length} config files, merge into: ${mergeFile}`);
    }
    else {
        GetValidFileList(fileList).forEach(function (filename) {
            var target = path.join(outDir, "".concat(filename, ".ts"));
            fs.writeFileSync(target, GetTsString(path.join(dir, filename)), {encoding: 'utf-8'});
            console.log("config2ts, convert: ".concat(filename, " , to: ").concat(target));
        });
        console.log('config2ts convert done!');
    }
}