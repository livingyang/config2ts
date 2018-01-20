import * as fs from 'fs';
import * as assert from 'assert';
import * as d3 from 'd3';

import {csv2tsFromFile, csv2tsFromFileList, MergeTsFiles, csv2ts} from '../src/csv2ts';

test('csv2ts with id', () => {
    expect(csv2tsFromFile("./config/data.csv")).toBe(fs.readFileSync('./config/data.csv.ts').toString());
});

test('csv2ts without id', () => {
    expect(csv2tsFromFile("./config/noid.csv")).toBe(fs.readFileSync('./config/noid.csv.ts').toString());
});

test('csv2ts error', () => {
    expect(csv2ts("", "")).toBe("");
});

test('csv2ts merge csv file list', () => {
    expect(MergeTsFiles(csv2tsFromFileList(["./config/data.csv", "./config/noid.csv"]))).toBe(fs.readFileSync('./config/csv.ts').toString());
});
