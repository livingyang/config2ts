# 08-story

Isomorphic subdirectory merge: a subdirectory (`story/`) whose csv files all
share the same header and type rows is exported as ONE table named after the
directory (`StoryCsv`).

Each member file is one chapter of the same story (extracted from
HanmoMerge's restaurant theme ch01–ch03.json `nodes`), so chapters stay
editable one file at a time while the runtime loads a single `StoryCsv` table.
The member file name carries the chapter identity, so no `chapter` column is
needed; `seq` restores play order inside a chapter; `type`/`kind` are `Enum`
columns, so adding a new node kind just extends the union type.

## Sub-table binding (FileMap + RefTable)

The merged table drops the per-row `id` column: the member file name IS the
key. It also skips the flat `List` (every row would be duplicated) and
exports only:

```ts
export const FileMap: { [file: string]: Record[] } = {
    ch01: [ /* rows of ch01.csv */ ],
    ch02: [ /* rows of ch02.csv */ ],
    ch03: [ /* rows of ch03.csv */ ],
};
```

Other tables reference a whole sub-table with `RefTable[story]`: the cell
holds a file name (`ch01`), the generated field is typed `StoryCsv.Record[]`
and resolves to `StoryCsv.FileMap["ch01"]`. The array form
`RefTable[story][]` holds several file names and resolves to
`StoryCsv.Record[][]`. `story-list.csv` is the chapter index built this way —
each row mirrors one chapter json (`id`/`chapter`/`title`/`triggerArea`), with
the original `nodes` field renamed to `story` and turned into the sub-table
reference. RefTable targets participate in topological sorting, so `StoryCsv`
is always emitted before `StoryListCsv`.
