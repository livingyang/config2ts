"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
exports.GetTsString = GetTsString;
exports.GetTsStringFromFileList = GetTsStringFromFileList;
exports.GetValidFileList = GetValidFileList;
exports.startConvert = startConvert;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const d3_dsv_1 = require("d3-dsv");
const json5 = __importStar(require("json5"));
const changeCase = __importStar(require("change-case"));
const toml = __importStar(require("toml"));
const EnumStr = "Enum";
const EnumIndexStr = "EnumIndex";
const EnumArrayString = "Enum[]";
const IndexStr = "Index";
const RefPrefix = "Ref[";
const RefSuffix = "]";
exports.Convert = {
    ini: function (str, moduleName) {
        const obj = toml.parse(str);
        return `export const ${moduleName} = ${json5.stringify(obj, null, 4)};`;
    },
    csv: function (str, moduleName) {
        return csv2ts(str, moduleName);
    },
    toml: function (str, moduleName) {
        const obj = toml.parse(str);
        return `export const ${moduleName} = ${json5.stringify(obj, null, 4)};`;
    },
};
function csv2ts(csvString, moduleName) {
    let convert = {};
    const refFields = [];
    const result = (0, d3_dsv_1.csvParse)(csvString, function (d, i) {
        if (i === 0) {
            convert = d;
            for (const k in convert) {
                if (convert[k].startsWith(RefPrefix) && convert[k].endsWith(RefSuffix)) {
                    refFields.push(k);
                }
            }
            return null;
        }
        else {
            for (const k in d) {
                if (typeof global[convert[k]] === "function") {
                    d[k] = global[convert[k]](d[k]);
                }
                else if (convert[k] === "String[]") {
                    if (d[k] === "") {
                        d[k] = [];
                    }
                    else {
                        d[k] = d[k].trim().split(",").map((v) => v.trim());
                    }
                }
                else if (convert[k] === "Number[]") {
                    d[k] = d[k].trim().split(",").map((val) => Number(val));
                }
                else if (convert[k] === "Enum[]") {
                    if (d[k] === "") {
                        d[k] = [];
                    }
                    else {
                        d[k] = d[k].trim().split(",").map((v) => v.trim());
                    }
                }
                else if (convert[k].startsWith(RefPrefix) && convert[k].endsWith(RefSuffix)) {
                }
                else {
                    d[k] = String(d[k]);
                }
            }
            return d;
        }
    });
    delete result.columns;
    if (result.length <= 0) {
        return "";
    }
    let template = `export namespace ${moduleName} {\n\n`;
    for (const field in convert) {
        if (convert[field] == EnumStr || convert[field] == EnumIndexStr) {
            const enumValues = [];
            for (const row of result) {
                const enumValue = row[field];
                if (!enumValues.includes(enumValue)) {
                    enumValues.push(enumValue);
                }
            }
            const enumValueStrings = enumValues.map((value) => `"${value}"`);
            template += `    export type ${field} = ${enumValueStrings.join(" | ")};\n`;
            template += `    export const ${field}List: ${field}[] = [${enumValueStrings.join(", ")}];\n\n`;
        }
        else if (convert[field] == EnumArrayString) {
            const enumValues = [];
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
    let indexField = null;
    for (const field in convert) {
        let fieldType = "string";
        if (convert[field] != "") {
            if (convert[field] == EnumStr) {
                fieldType = field;
            }
            else if (convert[field] == EnumIndexStr) {
                fieldType = field;
                indexField = field;
            }
            else if (convert[field] == IndexStr) {
                indexField = field;
            }
            else if (convert[field] == EnumArrayString) {
                fieldType = field + "[]";
            }
            else if (convert[field].startsWith(RefPrefix) && convert[field].endsWith(RefSuffix)) {
                const refModule = convert[field].slice(RefPrefix.length, -RefSuffix.length);
                const refModuleName = changeCase.pascalCase(refModule);
                fieldType = `${refModuleName}.Record`;
            }
            else {
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
            }
            else {
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
function serializeField(key) {
    const obj = {};
    obj[key] = true;
    const objString = json5.stringify(obj);
    return objString.includes("'") ? "'" + key + "'" : key;
}
function GetFileExt(filePath) {
    const pathObject = path.parse(filePath);
    return pathObject.ext.slice(1);
}
function GetTsString(filePath) {
    const pathObject = path.parse(filePath);
    const handle = exports.Convert[GetFileExt(filePath)];
    if (handle) {
        const moduleName = changeCase.pascalCase(pathObject.base);
        let fileString = fs.readFileSync(filePath).toString();
        if (fileString.charAt(0) === "\uFEFF")
            fileString = fileString.substr(1);
        return handle(fileString, moduleName);
    }
    else {
        return "";
    }
}
function GetTsStringFromFileList(fileList) {
    return fileList
        .map(function (filePath) {
        return GetTsString(filePath);
    })
        .join("\n\n");
}
function GetValidFileList(fileList) {
    return fileList.filter(function (filePath) {
        return exports.Convert[GetFileExt(filePath)] != null;
    });
}
function startConvert(dir, outDir, merge) {
    const fileList = fs.readdirSync(dir);
    const fullFileList = GetValidFileList(fileList).map(function (filename) {
        return path.join(dir, filename);
    });
    const mergeFile = path.join(outDir, merge);
    fs.writeFileSync(mergeFile, GetTsStringFromFileList(fullFileList), { encoding: "utf-8" });
    console.log(`config2ts, ${fullFileList.length} config files, merge into: ${mergeFile}`);
}
