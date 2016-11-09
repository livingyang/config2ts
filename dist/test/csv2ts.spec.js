"use strict";
var Converter = require("csvtojson").Converter;
var converter = new Converter();
describe('csv2ts', function () {
    it('test', function () {
        converter.fromFile("./config/data.csv", function (err, result) {
            // generate interface
            var template = 'interface data {\n';
            var first = result[0];
            for (var key in first) {
                template += "    " + key + ": " + typeof (first[key]) + ";\n";
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
    });
});
//# sourceMappingURL=csv2ts.spec.js.map