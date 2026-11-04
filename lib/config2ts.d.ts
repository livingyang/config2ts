type ConvertHandler = (str: string, moduleName: string) => string;
export declare const Convert: Record<string, ConvertHandler>;
export declare function assets2ts(assetsDir: string): string;
export declare function GetTsString(filePath: string): string;
export interface ConvertUnit {
    name: string;
    ext: string;
    content: string;
    sourcePaths: string[];
    refs: string[];
}
export declare function collectConvertUnits(dir: string): ConvertUnit[];
export declare function GetTsStringFromUnits(units: ConvertUnit[]): string;
export declare function GetTsStringFromFileList(fileList: string[]): string;
export declare function GetValidFileList(fileList: string[]): string[];
export declare function startConvert(dir: string, outDir: string, merge: string, assetsDir?: string, mode?: "single" | "split"): void;
export {};
