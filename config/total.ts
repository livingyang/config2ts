export namespace DataCsv {

    export type mytype = "type1" | "type2" | "";
    export const mytypeList: mytype[] = ["type1", "type2", ""];

    export type typearray = "t1" | "t2" | "t3" | "t4" | "";
    export const typearrayList: typearray[] = ["t1", "t2", "t3", "t4", ""];

    export interface Record {
        id: string;
        name: string;
        bool: boolean;
        num: number;
        mytype: mytype;
        stringarray: string[];
        numberarray: number[];
        typearray: typearray[];
    };

    export const List: Record[] = [
        {
            "id": "1",
            "name": "xxx",
            "bool": true,
            "num": 111,
            "mytype": "type1",
            "stringarray": [
                "1",
                " 2",
                " 3"
            ],
            "numberarray": [
                1,
                2,
                3
            ],
            "typearray": [
                "t1"
            ]
        },
        {
            "id": "2",
            "name": "xxx",
            "bool": false,
            "num": 222,
            "mytype": "type2",
            "stringarray": [
                "a",
                "b"
            ],
            "numberarray": [
                0
            ],
            "typearray": [
                "t1",
                "t2"
            ]
        },
        {
            "id": "3",
            "name": "333",
            "bool": false,
            "num": 33,
            "mytype": "",
            "stringarray": [
                ""
            ],
            "numberarray": [
                1,
                2
            ],
            "typearray": [
                "t2",
                "t3",
                "t4"
            ]
        },
        {
            "id": "4",
            "name": "444",
            "bool": true,
            "num": 444,
            "mytype": "type2",
            "stringarray": [
                "",
                "1",
                "",
                "b"
            ],
            "numberarray": [
                0,
                1,
                0,
                3
            ],
            "typearray": [
                ""
            ]
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};

export const IniFileIni = {
    "num": 1,
    "str": "string",
    "bool": true,
    "ItemType": {
        "book": 1,
        "fruit": 2
    }
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

export const TomlFileToml = {
    "num": 1,
    "str": "test",
    "ItemType": {
        "book": 1,
        "fruit": 2
    }
};