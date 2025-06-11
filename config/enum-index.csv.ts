export namespace EnumIndexCsv {

    export type name = "111" | "222" | "333";
    export const nameList: name[] = ["111", "222", "333"];

    export interface Record {
        name: name;
        bool: boolean;
        num: number;
    };

    export const List: Record[] = [
        {
            name: '111',
            bool: true,
            num: 111,
        },
        {
            name: '222',
            bool: false,
            num: 222,
        },
        {
            name: '333',
            bool: false,
            num: 0,
        },
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.name] = v; };

};