import * as path from 'path';
import * as fs from 'fs';
import * as d3 from 'd3';
import * as changeCase from 'change-case';
import * as ini from 'ini';
let toml = require('toml');

let packageJson = require('../package.json');

export const Convert = {
    ini: function(str: string, moduleName: string) {
        let obj = toml.parse(str);
        return `export const ${moduleName} = ${JSON.stringify(obj, null, 4)};`;
    },

    csv: function(str: string, moduleName: string) {
        return csv2ts(str, moduleName);
    },

    toml: function(str: string, moduleName: string) {
        let obj = toml.parse(str);
        return `export const ${moduleName} = ${JSON.stringify(obj, null, 4)};`;
    }
};

function csv2ts(csvString: string, moduleName: string) {
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

    template += "};"

    return template;
}

function GetFileExt(filePath: string) {
    let pathObject = path.parse(filePath);
    return pathObject.ext.slice(1);
}

export function GetTsString(filePath: string) {
    let pathObject = path.parse(filePath);
    let handle = Convert[GetFileExt(filePath)];
    if (handle) {
        let moduleName = changeCase.pascalCase(pathObject.base);
        return handle(fs.readFileSync(filePath).toString(), moduleName);
    }
    else {
        return '';
    }
}

export function GetTsStringFromFileList(fileList: string[]) {
    return fileList.map((filePath) => {
        return GetTsString(filePath);
    }).join('\n\n');
}

export function GetHeaderInfo() {
    let header = `export let config2ts_version = "${packageJson.version}";\n\n`;
    header += `export let config2ts_build_timestamp = ${Date.now()};\n\n`;
    return header;
}

export function GetValidFileList(fileList: string[]) {
    return fileList.filter((filePath) => {
        return Convert[GetFileExt(filePath)] != null;
    })
}
