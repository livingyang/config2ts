"use strict";
var fs = require('fs');
var assert = require('assert');
var csv2ts_1 = require('../src/csv2ts');
describe('csv2ts', function () {
    it('asset csv to ts', function (done) {
        csv2ts_1.csv2tsFromFile("./config/data.csv", function (result) {
            assert.equal(result, fs.readFileSync('./config/data.ts').toString());
            done();
        });
    });
});
//# sourceMappingURL=csv2ts.spec.js.map