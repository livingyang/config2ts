import * as path from "path";
import * as fs from "fs";
import { csvParse } from "d3-dsv";
import * as json5 from "json5";
import * as changeCase from "change-case";
import * as toml from "toml";

const EnumStr = "Enum";
const EnumIndexStr = "EnumIndex";
const EnumArrayString = "Enum[]";
const IndexStr = "Index";
const RefPrefix = "Ref[";
const RefSuffix = "]";

type ConvertHandler = (str: string, moduleName: string) => string;

export const Convert: Record<string, ConvertHandler> = {
  ini: function (str: string, moduleName: string): string {
    const obj = toml.parse(str);
    return `export const ${moduleName} = ${json5.stringify(obj, null, 4)};`;
  },
  csv: function (str: string, moduleName: string): string {
    return csv2ts(str, moduleName);
  },
  toml: function (str: string, moduleName: string): string {
    const obj = toml.parse(str);
    return `export const ${moduleName} = ${json5.stringify(obj, null, 4)};`;
  },
};

function csv2ts(csvString: string, moduleName: string): string {
  let convert: Record<string, string> = {};
  const refFields: string[] = [];
  const result = csvParse(csvString, function (d: Record<string, string>, i: number) {
    if (i === 0) {
      convert = d as Record<string, string>;
      for (const k in convert) {
        if (convert[k].startsWith(RefPrefix) && convert[k].endsWith(RefSuffix)) {
          refFields.push(k);
        }
      }
      return null;
    } else {
      for (const k in d) {
        if (typeof (global as any)[convert[k]] === "function") {
          d[k] = (global as any)[convert[k]](d[k]);
        } else if (convert[k] === "String[]") {
          if (d[k] === "") {
            d[k] = [] as any;
          } else {
            d[k] = d[k].trim().split(",").map((v) => v.trim()) as any;
          }
        } else if (convert[k] === "Number[]") {
          d[k] = d[k].trim().split(",").map((val) => Number(val)) as any;
        } else if (convert[k] === "Enum[]") {
          if (d[k] === "") {
            d[k] = [] as any;
          } else {
            d[k] = d[k].trim().split(",").map((v) => v.trim()) as any;
          }
        } else if (convert[k].startsWith(RefPrefix) && convert[k].endsWith(RefSuffix)) {
        } else {
          d[k] = String(d[k]);
        }
      }
      return d;
    }
  }) as any[];

  delete (result as any).columns;
  if (result.length <= 0) {
    return "";
  }

  let template = `export namespace ${moduleName} {\n\n`;

  for (const field in convert) {
    if (convert[field] == EnumStr || convert[field] == EnumIndexStr) {
      const enumValues: string[] = [];
      for (const row of result) {
        const enumValue = row[field];
        if (!enumValues.includes(enumValue)) {
          enumValues.push(enumValue);
        }
      }

      const enumValueStrings = enumValues.map((value) => `"${value}"`);
      template += `    export type ${field} = ${enumValueStrings.join(" | ")};\n`;
      template += `    export const ${field}List: ${field}[] = [${enumValueStrings.join(", ")}];\n\n`;
    } else if (convert[field] == EnumArrayString) {
      const enumValues: string[] = [];
      for (const row of result) {
        const enumArrayValue = row[field];
        for (const enumValue of enumArrayValue) {
          if (!enumValues.includes(enumValue)) {
            enumValues.push(enumValue);
          }
        }
      }

      const enumValueStrings = enumValues.map((value) => `"${value}"`);
      template += `    export type ${field} = ${enumValueStrings.join(" | ")};\n`;
      template += `    export const ${field}List: ${field}[] = [${enumValueStrings.join(", ")}];\n\n`;
    }
  }

  template += "    export interface Record {\n";
  let indexField: string | null = null;
  for (const field in convert) {
    let fieldType = "string";

    if (convert[field] != "") {
      if (convert[field] == EnumStr) {
        fieldType = field;
      } else if (convert[field] == EnumIndexStr) {
        fieldType = field;
        indexField = field;
      } else if (convert[field] == IndexStr) {
        indexField = field;
      } else if (convert[field] == EnumArrayString) {
        fieldType = field + "[]";
      } else if (convert[field].startsWith(RefPrefix) && convert[field].endsWith(RefSuffix)) {
        const refModule = convert[field].slice(RefPrefix.length, -RefSuffix.length);
        const refModuleName = changeCase.pascalCase(refModule);
        fieldType = `${refModuleName}.Record`;
      } else {
        fieldType = convert[field].toLowerCase();
      }
    }

    const serializedField = serializeField(field);
    template += `        ${serializedField}: ${fieldType};\n`;
  }
  template += "    };\n\n";

  if (indexField) {
    const filteredResult = result.filter((v) => {
      return v[indexField] !== "";
    });
    for (let i = 0; i < filteredResult.length; i++) {
      result[i] = filteredResult[i];
    }
    result.length = filteredResult.length;
  }

  template += "    export const List: Record[] = [\n";
  for (let i = 0; i < result.length; i++) {
    const row = result[i];
    template += "        {\n";
    for (const field in convert) {
      let value = row[field];
      if (convert[field].startsWith(RefPrefix) && convert[field].endsWith(RefSuffix)) {
        const refModule = convert[field].slice(RefPrefix.length, -RefSuffix.length);
        const refModuleName = changeCase.pascalCase(refModule);
        template += `            ${serializeField(field)}: ${refModuleName}.Map[${JSON.stringify(value)}],\n`;
      } else {
        template += `            ${serializeField(field)}: ${json5.stringify(value)},\n`;
      }
    }
    template += "        }";
    if (i < result.length - 1) {
      template += ",";
    }
    template += "\n";
  }
  template += "    ];\n\n";
  if (indexField != null) {
    template += "    export const Map: { [id: string]: Record } = {};\n";
    template += `    for (const v of List) { Map[v.${indexField}] = v; };\n\n`;
  }
  template += "};";
  return template;
}

function serializeField(key: string): string {
  const obj: Record<string, boolean> = {};
  obj[key] = true;
  const objString = json5.stringify(obj);
  return objString.includes("'") ? "'" + key + "'" : key;
}

function GetFileExt(filePath: string): string {
  const pathObject = path.parse(filePath);
  return pathObject.ext.slice(1);
}

export function GetTsString(filePath: string): string {
  const pathObject = path.parse(filePath);
  const handle = Convert[GetFileExt(filePath)];
  if (handle) {
    const moduleName = changeCase.pascalCase(pathObject.base);
    let fileString = fs.readFileSync(filePath).toString();
    if (fileString.charAt(0) === "\uFEFF") fileString = fileString.substr(1);
    return handle(fileString, moduleName);
  } else {
    return "";
  }
}

export function GetTsStringFromFileList(fileList: string[]): string {
  return fileList
    .map(function (filePath: string) {
      return GetTsString(filePath);
    })
    .join("\n\n");
}

export function GetValidFileList(fileList: string[]): string[] {
  return fileList.filter(function (filePath: string) {
    return Convert[GetFileExt(filePath)] != null;
  });
}

export function startConvert(dir: string, outDir: string, merge: string): void {
  const fileList = fs.readdirSync(dir);
  const fullFileList = GetValidFileList(fileList).map(function (filename: string) {
    return path.join(dir, filename);
  });
  const mergeFile = path.join(outDir, merge);
  fs.writeFileSync(mergeFile, GetTsStringFromFileList(fullFileList), { encoding: "utf-8" });
  console.log(`config2ts, ${fullFileList.length} config files, merge into: ${mergeFile}`);
}
