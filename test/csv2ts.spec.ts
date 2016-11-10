import * as fs from 'fs';
import * as assert from 'assert';

import {csv2tsFromFile} from '../src/csv2ts';

describe('csv2ts', function() {
    it('asset csv to ts', function(done) {
        csv2tsFromFile("./config/data.csv", function(result) {
            assert.equal(result, fs.readFileSync('./config/data.ts').toString());
            done()            
        });
    })
});