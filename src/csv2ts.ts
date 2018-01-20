import * as path from 'path';
import * as fs from 'fs';
import { resolve } from 'url';
import * as d3 from 'd3';
import { parse } from 'querystring';

let packageJson = require('../package.json');

export function csv2ts(csvString: string, interfaceName: string) {
    let convert = {};
    let parsed = d3.csvParse(csvString, (d, i) => {
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
    delete parsed.columns;

    if (parsed.length <= 0) {
        return "";
    }

    let result = parsed;
    
    // generate interface
    let template = `export interface ${interfaceName} {\n`;

    for (let field in convert) {
        let fieldType = convert[field] !== '' ? convert[field].toLowerCase() : 'string';
        template += `    ${field}: ${fieldType};\n`;
    }
    template += '};\n';
    template += `export let ${interfaceName}List: ${interfaceName}[] = `;
    template += JSON.stringify(result, null, 4);
    template += ';\n';

    if (convert['id'] === 'Number') {
        template += `export let ${interfaceName}Map: {[id: number]: ${interfaceName}} = {};\n`;
        template += `for (const v of ${interfaceName}List) { ${interfaceName}Map[v.id] = v; };\n`;
    }

    return template;
}

function capitalizeFirstLetter(string: string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function csv2tsFromFile(filePath: string, prefix = '', suffix = 'Csv') {
    let pathObject = path.parse(filePath);
    return csv2ts(fs.readFileSync(filePath).toString(), prefix + capitalizeFirstLetter(pathObject.name) + suffix);
}

export function csv2tsFromFileList(fileList: string[], prefix = '', suffix = 'Csv') {
    return fileList.map((filePath) => {
        return csv2tsFromFile(filePath, prefix, suffix);
    });
}

export function MergeTsFiles(tsFiles: string[]) {
    return `export let csv2ts_version = "${packageJson.version}";\n\n` + tsFiles.join('\n');
}