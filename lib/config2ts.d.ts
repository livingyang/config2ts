export declare const Convert: {
    ini: (str: any, moduleName: any) => string;
    csv: (str: any, moduleName: any) => string;
    toml: (str: any, moduleName: any) => string;
};
export declare function GetTsString(filePath: any): any;
export declare function GetTsStringFromFileList(fileList: any): any;
export declare function GetHeaderInfo(): string;
export declare function GetValidFileList(fileList: any): any;
export declare function startConvert(dir: string, outDir: string, merge: boolean): void;
