"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
let Converter = require("csvtojson").Converter;
function csv2tsFromString(csvString, interfaceName) {
    return new Promise((resolve, reject) => {
        new Converter().fromString(csvString, function (err, result) {
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
exports.csv2tsFromString = csv2tsFromString;
function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
function csv2tsFromFile(filePath, prefix = '', suffix = 'Csv') {
    let pathObject = path.parse(filePath);
    return csv2tsFromString(fs.readFileSync(filePath).toString(), prefix + capitalizeFirstLetter(pathObject.name) + suffix);
}
exports.csv2tsFromFile = csv2tsFromFile;
//# sourceMappingURL=csv2ts.js.map