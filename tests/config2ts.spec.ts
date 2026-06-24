import * as fs from "fs";
import { GetTsString, GetTsStringFromFileList, GetValidFileList } from "../src/config2ts";

const reg = /[\t\r\f\n\s]*/g;

function getTsFileString(tsFilePath: string): string {
  return fs.readFileSync(tsFilePath).toString().replace(reg, "");
}

test("convert csv file with id", function () {
  expect(GetTsString("./config/data.csv").replace(reg, "")).toBe(getTsFileString("./config/data.csv.ts"));
});

test("convert csv file without id", function () {
  expect(GetTsString("./config/no-id.csv").replace(reg, "")).toBe(getTsFileString("./config/no-id.csv.ts"));
});

test("convert ini file", function () {
  expect(GetTsString("./config/ini-file.ini").replace(reg, "")).toBe(getTsFileString("./config/ini-file.ini.ts"));
});

test("convert toml file", function () {
  expect(GetTsString("./config/toml_file.toml").replace(reg, "")).toBe(getTsFileString("./config/toml_file.toml.ts"));
});

test("config2ts merge csv file list", function () {
  expect(
    GetTsStringFromFileList([
      "./config/data.csv",
      "./config/enum-index.csv",
      "./config/ini-file.ini",
      "./config/no-id.csv",
      "./config/toml_file.toml",
    ]).replace(reg, "")
  ).toBe(fs.readFileSync("./config/total.ts").toString().replace(/\s/g, ""));
});

test("config2ts GetValidFileList", function () {
  expect(GetValidFileList(["a.csv", "b.ini", "c.xxx"])).toEqual(["a.csv", "b.ini"]);
});
