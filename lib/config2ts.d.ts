declare var path: any;
declare var fs: any;
declare var d3: any;
declare var json5: any;
declare var changeCase: any;
declare var toml: any;
declare var packageJson: any;
declare var EnumStr: string;
declare var EnumIndexStr: string;
declare var EnumArrayString: string;
declare var IndexStr: string;
declare function csv2ts(csvString: any, moduleName: any): string;
/**
 * serialize interface field
 * @param {string} field
 */
declare function serializeField(key: any): any;
declare function GetFileExt(filePath: any): any;
declare function GetTsString(filePath: any): any;
declare function GetTsStringFromFileList(fileList: any): any;
declare function GetHeaderInfo(): string;
declare function GetValidFileList(fileList: any): any;
