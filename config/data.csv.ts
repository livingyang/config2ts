export namespace DataCsv {

    export type mytype = "type1" | "type2" | "";
    export interface Record {
        id: string;
        name: string;
        bool: boolean;
        num: number;
        mytype: mytype;
        stringarray: string[];
        numberarray: number[];
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
            ]
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};