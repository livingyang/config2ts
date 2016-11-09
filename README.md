# csv2ts
convert csv to ts file.

# example
data.csv:
```
id,name,bool
number,string,boolean
1,"xxx",true
2,"xxx",false
```

will convert to data.ts:

```
class dataRecord {
    id: number;
    name: number;
    bool: boolean;
}

export let dataRecords: dataRecord[] = [
    [1, "xxx", true],
    [2, "xxx", false]
]
```