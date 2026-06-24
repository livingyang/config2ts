type ConvertHandler = (str: string, moduleName: string) => string;
export declare const Convert: Record<string, ConvertHandler>;
export declare function GetTsString(filePath: string): string;
export declare function GetTsStringFromFileList(fileList: string[]): string;
export declare function GetValidFileList(fileList: string[]): string[];
export declare function startConvert(dir: string, outDir: string, merge: string): void;
export {};
