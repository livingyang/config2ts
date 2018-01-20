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