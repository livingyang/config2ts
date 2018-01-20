import * as fs from 'fs';
import * as assert from 'assert';
import * as ini from 'ini';

import {
    Convert,
    GetTsString,
    GetHeaderInfo,
    GetTsStringFromFileList,
    GetValidFileList} from '../src/config2ts';

test('convert csv file with id', () => {
    expect(GetTsString('./config/data.csv')).toBe(fs.readFileSync('./config/data.csv.ts').toString());
});

test('convert csv file without id', () => {
    expect(GetTsString('./config/no-id.csv')).toBe(fs.readFileSync('./config/no-id.csv.ts').toString());
});

test('convert ini file', () => {
    expect(GetTsString('./config/ini-file.ini')).toBe(fs.readFileSync('./config/ini-file.ini.ts').toString());
});

test('convert toml file', () => { 
    // console.log(toml.parse(fs.readFileSync('./config/toml_file.toml')));
    expect(GetTsString('./config/toml_file.toml')).toBe(fs.readFileSync('./config/toml_file.toml.ts').toString());
});

test('config2ts merge csv file list', () => {
    expect(GetTsStringFromFileList(["./config/data.csv", "./config/no-id.csv"])).toBe(fs.readFileSync('./config/total.ts').toString());
});

test('config2ts merge csv file list', () => {
    expect(GetValidFileList(['a.csv', 'b.ini', 'c.xxx'])).toEqual(['a.csv', 'b.ini']);
});
    