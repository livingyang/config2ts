"use strict";
var path = require('path');
var fs = require('fs');
var Converter = require("csvtojson").Converter;
var converter = new Converter();
function csv2tsFromString(csvString, interfaceName, cb) {
    converter.fromString(csvString, function (err, result) {
        // generate interface
        var template = "interface " + interfaceName + " {\n";
        var first = result[0];
        // transform value type 
        for (var i = 1; i < result.length; ++i) {
            var record = result[i];
            for (var key in record) {
                var fieldType = typeof (first[key]);
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
        for (var key in first) {
            template += "    " + key + ": " + typeof (first[key]) + ";\n";
        }
        template += '};\n';
        template += "export let " + interfaceName + "Rows: " + interfaceName + "[] = ";
        template += JSON.stringify(result, null, 4);
        template += ';';
        cb(template);
    });
}
exports.csv2tsFromString = csv2tsFromString;
function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}
function csv2tsFromFile(filePath, cb) {
    var pathObject = path.parse(filePath);
    csv2tsFromString(fs.readFileSync(filePath).toString(), capitalizeFirstLetter(pathObject.name), cb);
}
exports.csv2tsFromFile = csv2tsFromFile;
//# sourceMappingURL=csv2ts.js.map