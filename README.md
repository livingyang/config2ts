# config2ts

convert config to ts file.

# install

run command: `npm install -g config2ts`

# documentation

Full documentation is published via GitHub Pages (this repo has Pages enabled):

- English: https://livingyang.github.io/config2ts/
- 中文: https://livingyang.github.io/config2ts/index-zh.html

# usage

`config2ts` supports two output modes selected by `-m, --mode`:

- `single` (default): merge every table into one file (`-n`, default `csv.ts`).
- `split`: write one `.ts` file per table plus an auto-generated `index.ts`.

This repo's `config/` folder ships example outputs generated from the same source
tables, so you can compare both layouts directly:

- single mode example: [`config/total.ts`](config/total.ts)
- split mode example: [`config/split/`](config/split/) (one file per table + `index.ts`)

## single mode

Merge all config tables into a single TypeScript file.

```bash
config2ts -d config -o dist -m single -n csv.ts -a public
```

- `-n` is the merged output file name (default `csv.ts`).
- `-a` is optional; omit it to skip `assets.ts`.
- Example output: [`config/total.ts`](config/total.ts) — all tables as `export namespace XxxCsv { ... }` in one file.

## split mode

Write one `.ts` file per config table (named after the source file, e.g.
`skill.csv` → `skill.ts`) plus an auto-generated `index.ts` that re-exports every
table and `assets.ts`. Cross-table `Ref`/`RefEnum`/`Template` references are
resolved with `import` statements injected at the top of the referencing file, so
every table is independently usable and tree-shakable.

```bash
config2ts -d config -o dist -m split -a public
```

- `-n` is reused as the index file name; the single-mode default `csv.ts` is
  replaced by `index.ts` unless you pass `-n` explicitly.
- `-a` is optional; omit it to skip `assets.ts`.
- Example output: [`config/split/`](config/split/) — `z-base.ts`, `a-user.ts`,
  `skill.ts`, … , `assets.ts`, and `index.ts`.

Output layout under `dist`:

```
dist/
  z-base.ts        # export namespace ZBaseCsv { ... }
  a-user.ts        # import { ZBaseCsv } from "./z-base"; export namespace AUserCsv { ... }
  skill.ts
  ...
  assets.ts        # generated only when -a is given
  index.ts         # export * from "./z-base"; export * from "./a-user"; ...; export * from "./assets";
```

Notes:
- Tables are emitted in topological order; a table only `import`s tables it
  actually references, and missing/circular references print the same warnings as
  single mode.

# support type

| csv field  |  typescript type  |
| :--------: | :---------------: |
|   Index    |      string       |
|   String   |      string       |
|   Number   |      number       |
|  Boolean   |     boolean       |
|    Enum    |       type        |
| EnumIndex  |       type        |
| String[]   |     string[]      |
| Number[]   |     number[]      |
|  Enum[]    |      type[]       |
|    Ref     | namespace.Record  |
| RefEnum    | namespace.type    |
| RefEnum[]  | namespace.type[]  |
|  Template  | namespace.Record  |
| Template[] | namespace.Record[] |
|   Object   |   type (Record)   |
|  Object[]  | type[] (Record[]) |

* `Number` support Infinity and NaN
* `Enum` support empty string type
* `Enum[]` union contains every value actually present in the data (including `""` for empty slots)
* `EnumIndex` will generate index type, and will use `Enum` type to generate interface
* `Ref` / `RefEnum` reference another csv's Record/enum by id: `Ref[file]` is one row (`file.Map["id"]`), `Ref[file][]` is an array of rows with comma-separated ids (`[file.Map["1"],file.Map["2"]]`, typed `File.Record[]`); use `Object[]` for inline private structures and `Ref[]` for shared, identity-bearing rows
* `Template[file]` inherits a whole row from another table and overrides selected fields: a cell is `<baseId>|<key>:<value>,<key>:<value>` — a pipe separates the base row id from override pairs (e.g. `101|damage:150,range:8`), emitting `{ ...file.Map["101"], damage: 150, range: 8 }` typed `File.Record`; with no overrides the cell is just the id and emits a plain `file.Map["id"]` like `Ref`. Override values may be bare scalars or bracket-wrapped composites mirroring the generated TS syntax — arrays as `[v1,v2]` (e.g. `Params:[6,2.07]`, required for array-typed fields; a bare `Params:6,2.07` gets chopped by the pair comma and prints a warning) and flat objects as `{k:v,k:v}`. `Template[file][]` separates entries with `;` (the same element separator as `Object[]`), e.g. `101|damage:150;102|heal:500` emits `[{ ...file.Map["101"], damage: 150 },{ ...file.Map["102"], heal: 500 }]`. Override key typos and value-type mismatches fail at tsc compile time; overrides are flat top-level fields (no dot-path deep merge), and the target table must have an Index/EnumIndex Map
* Merge order is resolved automatically: tables are topologically sorted so every referenced table (`Ref`/`RefEnum`/`Template`) is emitted before the tables referencing it — no filename tricks needed; tables without a dependency relation keep alphabetical order. Circular references (`a.csv -> b.csv -> a.csv`) and references to missing files print a warning
* `Object` parse `key:value,key:value` format, auto-infer value types (number/boolean/string), generates a dedicated `type` that merges all keys
* `Object[]` separates objects with `;` while commas still separate `key:value` pairs inside each object (same syntax as the `Object` type), e.g. `num:1,,str:a;num:2` makes `[{num:1,str:'a'},{num:2}]`, a bare `;` makes `[{},{}]`; generates a dedicated element `type` merging all keys with the field typed as `type[]`
* Array convention: primitive arrays (`String[]`/`Number[]`/`Enum[]`/`RefEnum[...] []`) separate elements with `,` and `Object[]` separates objects with `;`; raw cell values are normalized (CRLF/CR unified to LF, whitespace trimmed); an empty cell generates `[]`; otherwise n separators make n+1 slots and every slot is kept (including interior or trailing ones) so parallel arrays stay index-aligned. Empty slots use the type's own zero value — `''` for string/enum/ref-enum, `0` for number, `{}` for empty object slots; `null` is never generated
* Line breaks inside a cell (quote-wrapped in CSV) are preserved for `String` fields (emitted as `\n`) and act as the equivalent separator in structural fields — a line feed equals a comma between array elements / Object pairs / Template override pairs, and equals a semicolon between Object[] elements / Template[] entries (one entry per line works; a blank line is an empty slot by the n+1 rule). Scalar fields (Number/Boolean/Enum/single Ref) have no separator semantics, so a line break there prints a warning and must be removed
* unrecognized field types fall back to `string` and print a warning (check for typos)

## assets2ts

Scan assets directory and generate an `assets.ts` index file with nested resource tree.

- `-a, --assets <path>` set assets resource directory (optional, skip asset index if omitted)
- Output file: `assets.ts` (alongside the merged config file)
- File and directory names are used exactly as-is (e.g., `Direction.png` → `Direction`, `adjust-horizontal.png` → `'adjust-horizontal'`); keys with special characters are automatically quoted
- `type` field uses file extension (lowercase), e.g. `'png'`, `'mp3'`, `'svg'`
- Directories containing 2+ files of the same extension get a dedicated type (e.g. `PngAsset`, `Mp3Asset`) and `satisfies Record<string, XxxAsset>` annotation
- Directories with ≤1 file or mixed extensions do not get a type annotation
- Nested directories are supported (e.g. `public/sub/image/`)

### generated example

```typescript
// Auto Generated by config2ts, DO NOT EDIT

export type Mp3Asset = { path: string; type: 'mp3' };
export type PngAsset = { path: string; type: 'png' };
export type SvgAsset = { path: string; type: 'svg' };

export const ASSETS = {
    public: {
        image: {
            'adjust-horizontal': {path:'public/image/adjust-horizontal.png',type:'png'},
            Direction: {path:'public/image/Direction.png',type:'png'}
        } satisfies Record<string, PngAsset>,
        music: {
            effect1: {path:'public/music/effect1.mp3',type:'mp3'},
            effect2: {path:'public/music/effect2.mp3',type:'mp3'}
        } satisfies Record<string, Mp3Asset>,
        'single-file': {
            effect1: {path:'public/single-file/effect1.mp3',type:'mp3'}
        }
    }
};
```

### usage

```typescript
import { ASSETS } from "./assets";

const meta = ASSETS.public.image.Direction;
// meta.path → 'public/image/Direction.png'
// meta.type → 'png'

const adjustMeta = ASSETS.public.image['adjust-horizontal'];
// adjustMeta.path → 'public/image/adjust-horizontal.png'
```

## Options

```
  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -d, --dir <path>       set convert path. default: ./
    -o, --outDir <path>    set outDir path. default: same as -d
    -n, --name <name>      output file name (single mode) / index file name (split mode). default: csv.ts
    -a, --assets <path>    set assets resource directory for asset index (optional, skip asset index if omitted)
    -m, --mode <mode>      output mode: single (merge into one file) or split (one file per table + index.ts). default: single
```

## supported file formats

| format | extension |
| :----: | :-------: |
|  csv   |   .csv    |
|  ini   |   .ini    |
|  toml  |   .toml   |
