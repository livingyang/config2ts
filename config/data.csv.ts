export namespace DataCsv {

    export interface Record {
        id: string;
        name: string;
        bool: boolean;
        num: number;
    };

    export const List: Record[] = [
        {
            "id": "1",
            "name": "xxx",
            "bool": true,
            "num": 111
        },
        {
            "id": "2",
            "name": "xxx",
            "bool": false,
            "num": 222
        },
        {
            "id": "3",
            "name": "333",
            "bool": false,
            "num": 0
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};