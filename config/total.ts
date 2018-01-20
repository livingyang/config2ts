export namespace DataCsv {

    export interface Record {
        id: number;
        name: string;
        bool: boolean;
        num: number;
    };

    export const List: Record[] = [
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

    export const Map: { [id: number]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export namespace NoIdCsv {

    export interface Record {
        name: string;
        bool: boolean;
        num: number;
    };

    export const List: Record[] = [
        {
            "name": "xxx",
            "bool": true,
            "num": 111
        },
        {
            "name": "xxx",
            "bool": false,
            "num": 222
        },
        {
            "name": "333",
            "bool": false,
            "num": 0
        }
    ];

};