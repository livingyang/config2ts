import * as fs from 'fs';
import * as assert from 'assert';

import {csv2tsFromFile} from '../src/csv2ts';

test('csv2ts with id', function(done) {
    csv2tsFromFile("./config/data.csv", function(result) {
        assert.equal(result, fs.readFileSync('./config/data.csv.ts').toString());
        done();
    });
});

test('csv2ts without id', function(done) {
    csv2tsFromFile("./config/noid.csv", function(result) {
        assert.equal(result, fs.readFileSync('./config/noid.csv.ts').toString());
        done();
    });
});