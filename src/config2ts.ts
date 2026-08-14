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
const ObjectStr = "Object";
const RefPrefix = "Ref[";
const RefSuffix = "]";
const RefEnumPrefix = "RefEnum[";
const RefEnumArraySuffix = "][]";

const EXT_MAP: Record<string, string> = {
  png: "image",
  jpg: "image",
  jpeg: "image",
  webp: "image",
  gif: "image",
  bmp: "image",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  csv: "config",
  json: "config",
  toml: "config",
  ini: "config",
  svg: "svg",
};

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
  const refEnumFields: string[] = [];
  const result = csvParse(csvString, function (d: Record<string, string>, i: number) {
    if (i === 0) {
      convert = d as Record<string, string>;
      for (const k in convert) {
        if (convert[k].startsWith(RefPrefix) && convert[k].endsWith(RefSuffix)) {
          refFields.push(k);
        }
        if (parseRefEnum(convert[k])) {
          refEnumFields.push(k);
        }
      }
      return null;
    } else {
      for (const k in d) {
        if (convert[k] === ObjectStr) {
          d[k] = parseObject(d[k]) as any;
        } else if (typeof (global as any)[convert[k]] === "function") {
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
          if (d[k] === "") {
            console.warn(`[config2ts] warning: ${moduleName} row ${i} field "${k}" ref value is empty`);
          }
        } else if (parseRefEnum(convert[k])) {
          const refEnum = parseRefEnum(convert[k])!;
          if (refEnum.isArray) {
            if (d[k] === "") {
              d[k] = [] as any;
            } else {
              d[k] = d[k].trim().split(",").map((v) => v.trim()) as any;
            }
          } else {
            if (d[k] === "") {
              console.warn(`[config2ts] warning: ${moduleName} row ${i} field "${k}" ref enum value is empty`);
            }
          }
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
    } else if (convert[field] == ObjectStr) {
      const keyTypes: Record<string, Set<string>> = {};
      for (const row of result) {
        const objValue = row[field];
        for (const key in objValue) {
          if (!keyTypes[key]) {
            keyTypes[key] = new Set();
          }
          keyTypes[key].add(getTypeName(objValue[key]));
        }
      }
      template += `    export type ${field} = {\n`;
      for (const key in keyTypes) {
        const types = Array.from(keyTypes[key]).join(" | ");
        template += `        ${serializeField(key)}?: ${types};\n`;
      }
      template += `    };\n\n`;
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
      } else if (convert[field] == ObjectStr) {
        fieldType = field;
      } else if (convert[field].startsWith(RefPrefix) && convert[field].endsWith(RefSuffix)) {
        const refModule = convert[field].slice(RefPrefix.length, -RefSuffix.length);
        const refModuleName = changeCase.pascalCase(refModule);
        fieldType = `${refModuleName}.Record`;
      } else if (parseRefEnum(convert[field])) {
        const refEnum = parseRefEnum(convert[field])!;
        const refModuleName = changeCase.pascalCase(refEnum.refModule);
        fieldType = refEnum.isArray ? `${refModuleName}.${refEnum.refField}[]` : `${refModuleName}.${refEnum.refField}`;
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

function parseObject(str: string): Record<string, any> {
  const result: Record<string, any> = {};
  const trimmed = str.trim();
  if (trimmed === "") {
    return result;
  }
  const pairs = trimmed.split(",");
  for (const pair of pairs) {
    const colonIndex = pair.indexOf(":");
    if (colonIndex > 0) {
      const key = pair.slice(0, colonIndex).trim();
      const value = pair.slice(colonIndex + 1).trim();
      result[key] = parseObjectValue(value);
    }
  }
  return result;
}

function parseObjectValue(value: string): any {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "") return "";
  const num = Number(value);
  if (!isNaN(num)) {
    return num;
  }
  return value;
}

function getTypeName(value: any): string {
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "string";
}

function parseRefEnum(typeStr: string): { refModule: string; refField: string; isArray: boolean } | null {
  if (typeStr.startsWith(RefEnumPrefix)) {
    let isArray = false;
    let inner = typeStr;
    if (typeStr.endsWith(RefEnumArraySuffix)) {
      isArray = true;
      inner = typeStr.slice(0, -RefEnumArraySuffix.length) + RefSuffix;
    }
    if (inner.endsWith(RefSuffix)) {
      const content = inner.slice(RefEnumPrefix.length, -RefSuffix.length);
      const dotIndex = content.lastIndexOf(".");
      if (dotIndex > 0) {
        const refModule = content.slice(0, dotIndex);
        const refField = content.slice(dotIndex + 1);
        return { refModule, refField, isArray };
      }
    }
  }
  return null;
}

function GetFileExt(filePath: string): string {
  const pathObject = path.parse(filePath);
  return pathObject.ext.slice(1);
}

function getAssetType(ext: string): string {
  return EXT_MAP[ext.toLowerCase()] || "other";
}

interface AssetNode {
  [key: string]: AssetNode | { path: string; type: string };
}

function scanDir(dir: string, basePath: string, groupMap: Record<string, { path: string; type: string }[]>): AssetNode | null {
  const node: AssetNode = {};
  let hasContent = false;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const key = changeCase.camelCase(entry.name);
      const childNode = scanDir(fullPath, path.posix.join(basePath, entry.name), groupMap);
      if (childNode !== null) {
        node[key] = childNode;
        hasContent = true;
      }
    } else if (entry.isFile()) {
      const parsed = path.parse(entry.name);
      const ext = parsed.ext.slice(1);
      const key = changeCase.camelCase(parsed.name);
      const relPath = path.posix.join(basePath, entry.name);
      const type = getAssetType(ext);
      const meta = { path: relPath, type };
      node[key] = meta;
      hasContent = true;
      if (!groupMap[type]) {
        groupMap[type] = [];
      }
      groupMap[type].push(meta);
    }
  }
  return hasContent ? node : null;
}

function serializeAssetNode(node: AssetNode | null, indent: string): string {
  if (node === null) return `${indent}{}`;
  const entries = Object.entries(node);
  if (entries.length === 0) return `${indent}{}`;
  const lines: string[] = [];
  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    const serializedKey = serializeField(key);
    const comma = i < entries.length - 1 ? "," : "";
    if ("path" in value && "type" in value) {
      lines.push(`${indent}${serializedKey}: {path:${json5.stringify((value as any).path)},type:"${(value as any).type}"}${comma}`);
    } else {
      lines.push(`${indent}${serializedKey}: {`);
      lines.push(serializeAssetNode(value as AssetNode, indent + "    "));
      lines.push(`${indent}}${comma}`);
    }
  }
  return lines.join("\n");
}

export function assets2ts(assetsDir: string): string {
  if (!fs.existsSync(assetsDir)) {
    return "";
  }
  const dirName = path.basename(assetsDir);
  const groupMap: Record<string, { path: string; type: string }[]> = {};
  const root = scanDir(assetsDir, dirName, groupMap);

  if (root === null) {
    return "";
  }

  const allTypes = new Set<string>([...Object.values(EXT_MAP), "other"]);
  for (const t of Object.keys(groupMap)) {
    allTypes.add(t);
  }
  const typeStrings = Array.from(allTypes).map((t) => `"${t}"`);

  let template = `export type AssetType = ${typeStrings.join(" | ")};\n\n`;
  template += `export interface AssetMeta {\n`;
  template += `    path: string;\n`;
  template += `    type: AssetType;\n`;
  template += `}\n\n`;
  template += `export const RES = {\n`;
  template += `    ${dirName}: {\n`;
  template += serializeAssetNode(root, "        ");
  template += `\n    }\n`;
  template += `};\n\n`;
  template += `export const ASSET_GROUP: Record<AssetType, AssetMeta[]> = {\n`;
  for (const t of Array.from(allTypes).sort()) {
    const items = groupMap[t] || [];
    const itemStr = items.map((m) => `{path:${json5.stringify(m.path)},type:"${m.type}"}`).join(",");
    template += `    "${t}": [${itemStr}],\n`;
  }
  template += `};\n`;
  return template;
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

export function startConvert(dir: string, outDir: string, merge: string, assetsDir?: string): void {
  const fileList = fs.readdirSync(dir);
  const fullFileList = GetValidFileList(fileList).map(function (filename: string) {
    return path.join(dir, filename);
  });
  const mergeFile = path.join(outDir, merge);
  fs.writeFileSync(mergeFile, GetTsStringFromFileList(fullFileList), { encoding: "utf-8" });
  console.log(`config2ts, ${fullFileList.length} config files, merge into: ${mergeFile}`);

  if (assetsDir) {
    const assetsOutput = assets2ts(assetsDir);
    if (assetsOutput) {
      const assetsFile = path.join(outDir, "assets.ts");
      fs.writeFileSync(assetsFile, assetsOutput, { encoding: "utf-8" });
      console.log(`assets2ts, resource dir: ${assetsDir}, output: ${assetsFile}`);
    }
  }
}
