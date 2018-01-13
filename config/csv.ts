export interface DataCsv {
    id: number;
    name: string;
    bool: boolean;
    num: number;
};
export let DataCsvList: DataCsv[] = [
    {
        "id": 1,
        "name": "xxx",
        "bool": true,
        "num": 111
    },
    {
        "id": 2,
        "name": "xxx",
        "bool": false,
        "num": 222
    },
    {
        "id": 3,
        "name": "333",
        "bool": false,
        "num": 0
    }
];
export let DataCsvMap: {[id: number]: DataCsv} = {};
for (const v of DataCsvList) { DataCsvMap[v.id] = v; };
