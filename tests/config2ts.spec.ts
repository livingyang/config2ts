import * as fs from "fs";
import { GetTsStringFromFileList } from "../src/config2ts";

const reg = /[\t\r\f\n\s]*/g;

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
