import * as fs from 'fs';
import * as parse from 'csv-parse';

let Converter = require("csvtojson").Converter;
let converter = new Converter();

describe('csv2ts', function() {
    it('test', function() {
        

        converter.fromFile("./config/data.csv", function(err, result) {
            // generate interface
            let template = 'interface data {\n';
            let first = result[0];
            for (let key in first) {
                template += `    ${key}: ${typeof(first[key])};\n`;
            }
            template += '};\n';
            // console.log(template);
            template += 'export let dataRows: data[] = ';
            // console.log('export let dataRows: data[] =');
            template += JSON.stringify(result, null, 4);
            template += ';';
            
            console.log(template);
            
            // console.log(first);
        });
    })
});