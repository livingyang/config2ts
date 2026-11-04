# 08-i18n-columns

The column-per-language variant of case 07: a single table with one column per
language (`zh` / `en` / `ja`) sharing one key column. One namespace holds all
translations as typed fields, so the runtime picks a column instead of switching
tables — handy when the language set is fixed and small.

Placeholders (`{player}`, `{count}`) stay untouched in every column, so they can
be replaced at render time regardless of language.

Compare with `07-i18n` (file per language): that layout scales to ad-hoc
language sets and lets translators work on separate files; this one keeps every
translation of a key on one row, which makes missing translations easy to spot.
