# 05-multiline-strings

`String` cells containing quoted line breaks (LF inside quotes):
multi-line descriptions, indented dialogue, bullet lists, blank lines inside a
cell, and a trailing newline at the end of a cell; dotted ids (`item.potion.name`).

Line breaks are kept as literal `\n` escapes in the generated string literals,
so byte-exact comparison against `expected.ts` is the real test. Note: cell
values are trimmed (see `normalizeCell` in `src/config2ts.ts`), so a trailing
newline at the very end of a cell is stripped — `review.drakewing` pins that
behavior down.
