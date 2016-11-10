import * as path from 'path';
import * as fs from 'fs';

let Converter = require("csvtojson").Converter;

export function csv2tsFromString(csvString: string, interfaceName: string, cb: (result: string) => void) {
    new Converter().fromString(csvString, function(err, result) {
        // generate interface
        let template = `export interface ${interfaceName} {\n`;
        let first = result[0];

        // transform value type 
        for (let i = 1; i < result.length; ++i) {
            let record = result[i];
            for (let key in record) {
                let fieldType = typeof(first[key]); 
                if (fieldType !== typeof(record[key])) {
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
            template += `    ${key}: ${typeof(first[key])};\n`;
        }
        template += '};\n';
        template += `export let ${interfaceName}List: ${interfaceName}[] = `;
        template += JSON.stringify(result, null, 4);
        template += ';';
        
        cb(template);
    });

}

function capitalizeFirstLetter(string: string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function csv2tsFromFile(filePath: string, cb: (result: string) => void, prefix = '', suffix = 'Csv') {
    let pathObject = path.parse(filePath);
    csv2tsFromString(fs.readFileSync(filePath).toString(), prefix + capitalizeFirstLetter(pathObject.name) + suffix, cb);
}