"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const d3 = require("d3");
const changeCase = require("change-case");
const ini = require("ini");
let packageJson = require('../package.json');
exports.Convert = {
    ini: function (str, moduleName) {
        let obj = ini.parse(str);
        return `export const ${moduleName} = ${JSON.stringify(obj, null, 4)};`;
    },
    csv: function (str, moduleName) {
        return csv2ts(str, moduleName);
    }
};
function csv2ts(csvString, moduleName) {
    let convert = {};
    let result = d3.csvParse(csvString, (d, i) => {
        if (i === 0) {
            convert = d;
            return null;
        }
        else {
            for (let k in d) {
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
    let template = `export namespace ${moduleName} {\n\n`;
    // generate interface
    template += `    export interface Record {\n`;
    for (let field in convert) {
        let fieldType = convert[field] !== '' ? convert[field].toLowerCase() : 'string';
        template += `        ${field}: ${fieldType};\n`;
    }
    template += '    };\n\n';
    // generate table
    template += `    export const List: Record[] = `;
    // console.log(prettyFormat(result, op));
    template += JSON.stringify(result, null, 4).replace(/\n/g, '\n    ');
    template += ';\n\n';
    if (convert['id'] === 'Number') {
        template += `    export const Map: { [id: number]: Record } = {};\n`;
        template += `    for (const v of List) { Map[v.id] = v; };\n\n`;
    }
    template += "};";
    return template;
}
function GetFileExt(filePath) {
    let pathObject = path.parse(filePath);
    return pathObject.ext.slice(1);
}
function GetTsString(filePath) {
    let pathObject = path.parse(filePath);
    let handle = exports.Convert[GetFileExt(filePath)];
    if (handle) {
        let moduleName = changeCase.pascalCase(pathObject.base);
        return handle(fs.readFileSync(filePath).toString(), moduleName);
    }
    else {
        return '';
    }
}
exports.GetTsString = GetTsString;
function GetTsStringFromFileList(fileList) {
    return fileList.map((filePath) => {
        return GetTsString(filePath);
    }).join('\n\n');
}
exports.GetTsStringFromFileList = GetTsStringFromFileList;
function GetHeaderInfo() {
    let header = `export let config2ts_version = "${packageJson.version}";\n\n`;
    header += `export let config2ts_build_timestamp = ${Date.now()};\n\n`;
    return header;
}
exports.GetHeaderInfo = GetHeaderInfo;
function GetValidFileList(fileList) {
    return fileList.filter((filePath) => {
        return exports.Convert[GetFileExt(filePath)] != null;
    });
}
exports.GetValidFileList = GetValidFileList;
