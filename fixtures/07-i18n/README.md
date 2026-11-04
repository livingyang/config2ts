# 07-i18n

The default localization layout: a single table with one column per language
(`zh` / `en` / `ja`) sharing one key column. One namespace holds every
translation as a typed field, so the runtime picks a column by language instead
of switching tables — missing translations are obvious at a glance, and adding a
key never touches more than one file.

Placeholders (`{player}`, `{count}`) stay untouched in every column, so they can
be replaced at render time regardless of language.

When the language set is open-ended or translators work on separate files, the
alternative is one table per language (`lang-zh.csv`, `lang-en.csv`, …) aligned
by the same keys — that layout produces one namespace per language instead of
one namespace with a column per language.
