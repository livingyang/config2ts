export namespace DataCsv {

    export type mytype = "type1" | "type2" | "";
    export interface Record {
        id: string;
        name: string;
        bool: boolean;
        num: number;
        mytype: mytype;
    };

    export const List: Record[] = [
        {
            "id": "1",
            "name": "xxx",
            "bool": true,
            "num": 111,
            "mytype": "type1"
        },
        {
            "id": "2",
            "name": "xxx",
            "bool": false,
            "num": 222,
            "mytype": "type2"
        },
        {
            "id": "3",
            "name": "333",
            "bool": false,
            "num": 33,
            "mytype": ""
        },
        {
            "id": "4",
            "name": "444",
            "bool": true,
            "num": 444,
            "mytype": "type2"
        }
    ];

    export const Map: { [id: string]: Record } = {};
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