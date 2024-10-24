# config2ts

convert config to ts file.

# install

run command: `npm install -g config2ts`

# how to use

config2ts -d config -o dist -m csv.ts

# support type

| csv field | typescript type |
| :-------: | :-------------: |
|   Index   |     string      |
|  String   |     string      |
|  Number   |     number      |
|  Boolean  |     boolean     |
|   Enum    |      type       |
| String[]  |    string[]     |
| Number[]  |    number[]     |
|  Enum[]   |     type[]      |

* `Number` support Infinity and NaN
* `Enum` support empty string type
* `Enum[]` do not include empty string type

## Usage

```
  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -d, --dir <path>       set convert path. default: ./
    -o, --outDir <path>    set outDir path. default: ./
    -p, --prefix <prefix>  set interface prefix. default: ""
    -s, --suffix <suffix>  set interface suffix. default: "Csv"
    -m, --merge <name>     merge all to one ts file. default: csv.ts
```
