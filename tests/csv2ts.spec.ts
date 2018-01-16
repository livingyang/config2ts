import * as fs from 'fs';
import * as assert from 'assert';

import {csv2tsFromFile, csv2tsFromString, csv2tsFromFileList, MergeTsFiles} from '../src/csv2ts';

test('csv2ts with id', function(done) {
    csv2tsFromFile("./config/data.csv").then(function(result) {
        expect(result).toBe(fs.readFileSync('./config/data.csv.ts').toString());
        done();
    });
});

test('csv2ts without id', function(done) {
    csv2tsFromFile("./config/noid.csv").then(function(result) {
        expect(result).toBe(fs.readFileSync('./config/noid.csv.ts').toString());
        done();
    });
});

test('csv2ts error', function(done) {
    csv2tsFromString("", "").then((data) => {
        expect(data).toBe("");
        done();
    });
});

test('csv2ts merge csv file list', function(done) {
    csv2tsFromFileList(["./config/data.csv", "./config/noid.csv"]).then(function(results: string[]) {
        expect(MergeTsFiles(results)).toBe(fs.readFileSync('./config/csv.ts').toString());
        done();
    });
});
