# 08-story

Isomorphic subdirectory merge: a subdirectory (`story/`) whose csv files all
share the same header and type rows is exported as ONE table named after the
directory (`StoryCsv`).

Each member file is one chapter, so chapters stay editable one file at a time
while the runtime loads a single `StoryCsv` table. The member file name carries
the chapter identity, so no `chapter` column is needed; `seq` restores play
order inside a chapter; `type`/`kind` are `Enum` columns, so adding a new node
kind just extends the union type.

The script is a short Chinese adaptation of *Hamlet* (Shakespeare, public
domain): `ch01` the ghost on the terrace, `ch02` the nunnery monologue, `ch03`
the final duel. Public-domain source text keeps the demo free of any game/wiki
licensing question — and a play maps naturally onto nodes (`bg` scene →
`line` → `effect`/`cg`), which is exactly what the `Enum` columns are for.

`ch04` (the graveyard scene) is deliberately **not** referenced by the chapter
index: it demonstrates that unreferenced member files are allowed — useful for
test data or half-written chapters. It still appears in `File`/`FileMap`.

## Sub-table binding (FileMap + RefTable)

The merged table drops the per-row `id` column: the member file name IS the
key. It also skips the flat `List` (every row would be duplicated) and
exports:

```ts
export type File = "ch01" | "ch02" | "ch03" | "ch04";
export const FileList: File[] = ["ch01", "ch02", "ch03", "ch04"];

export const FileMap: { [file in File]: Record[] } = {
    ch01: [ /* rows of ch01.csv */ ],
    ch02: [ /* rows of ch02.csv */ ],
    ch03: [ /* rows of ch03.csv */ ],
    ch04: [ /* rows of ch04.csv */ ],
};

export function refTable(file: File): Record[] { return FileMap[file]; }
```

Other tables reference a whole sub-table with `RefTable[story]`: the cell
holds a file name (`ch01`), the generated field is typed `StoryCsv.Record[]`
and resolves to `StoryCsv.refTable("ch01")`. The array form `RefTable[story][]`
holds several file names and resolves to `StoryCsv.Record[][]`.

Because the parameter type is the literal union, a `RefTable` value naming a
file that does not exist (`story=ch99`) fails at tsc compile time — an
argument type error that does not depend on the `strict` flag (indexing
`FileMap["ch99"]` directly would only error under `noImplicitAny`, which is
why the accessor exists). The converter also warns about unknown names and
lists the valid ones.

`story-list.csv` is the chapter index built this way — each row mirrors one
chapter json (`id`/`chapter`/`title`/`triggerArea`), with the original
`nodes` field renamed to `story` and turned into the sub-table reference.
RefTable targets participate in topological sorting, so `StoryCsv` is always
emitted before `StoryListCsv`.

## Unreferenced member files

Nothing has to point at a member file: `ch04` is merged normally and simply
appears in the `File` union and `FileMap` — no warning, no error, no dangling
reference.

The one rule that still applies to every member file is isomorphism: a single
csv with a different header or type row makes the directory unmergeable, so
the whole `StoryCsv` is skipped (with a warning) even if that file is the one
nobody references. Test data must keep the same columns.
