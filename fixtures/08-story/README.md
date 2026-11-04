# 08-story

Isomorphic subdirectory merge: a subdirectory (`story/`) whose csv files all
share the same header and type rows is exported as ONE table named after the
directory (`StoryCsv`), with the data rows concatenated in file-name order.

Each member file is one chapter of the same story (extracted from
HanmoMerge's restaurant theme ch01–ch03.json `nodes`), so chapters stay
editable one file at a time while the runtime loads a single `StoryCsv` table.
The `chapter` + `seq` columns restore play order; `type`/`kind` are `Enum`
columns, so adding a new node kind just extends the union type.
