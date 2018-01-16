import * as path from 'path';
import * as fs from 'fs';
import { resolve } from 'url';
let packageJson = require('../package.json');

let Converter = require("csvtojson").Converter;

export function csv2tsFromString(csvString: string, interfaceName: string) {
    return new Promise((resolve, reject) => {
        new Converter({checkType: true}).fromString(csvString, function (err, result) {
            if (err || result.length <= 0) {
                resolve("");
            }
            else {
                // generate interface
                let template = `export interface ${interfaceName} {\n`;
                let first = result[0];

                // transform value type 
                for (let i = 1; i < result.length; ++i) {
                    let record = result[i];
                    for (let key in record) {
                        let fieldType = typeof (first[key]);
                        if (fieldType !== typeof (record[key])) {
                            switch (fieldType) {
                                case 'string': {
                                    record[key] = String(record[key]);
                                    break;
                                }
                                case 'number': {
                                    record[key] = Number(record[key]);
                                    break;
                                }
                                case 'boolean': {
                                    record[key] = Boolean(record[key]);
                                    break;
                                }
                            }
                        }
                    }
                }
                for (let key in first) {
                    template += `    ${key}: ${typeof (first[key])};\n`;
                }
                template += '};\n';
                template += `export let ${interfaceName}List: ${interfaceName}[] = `;
                template += JSON.stringify(result, null, 4);
                template += ';\n';

                if (typeof first['id'] === 'number') {
                    template += `export let ${interfaceName}Map: {[id: number]: ${interfaceName}} = {};\n`;
                    template += `for (const v of ${interfaceName}List) { ${interfaceName}Map[v.id] = v; };\n`;
                }

                resolve(template);
            }
        });
    });
}

function capitalizeFirstLetter(string: string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function csv2tsFromFile(filePath: string, prefix = '', suffix = 'Csv') {
    let pathObject = path.parse(filePath);
    return csv2tsFromString(fs.readFileSync(filePath).toString(), prefix + capitalizeFirstLetter(pathObject.name) + suffix);
}

export function csv2tsFromFileList(fileList: string[], prefix = '', suffix = 'Csv') {
    return Promise.all(fileList.map((filePath) => {
        return csv2tsFromFile(filePath, prefix, suffix);
    }));
}

export function MergeTsFiles(tsFiles: string[]) {
    return `export let csv2ts_version = "${packageJson.version}";\n\n` + tsFiles.join('\n');
}