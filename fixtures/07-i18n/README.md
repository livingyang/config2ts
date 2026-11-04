# 07-i18n

Localized text tables: one table per language (`lang-zh` / `lang-en` / `lang-ja`),
aligned by the same keys. Every language becomes its own typed namespace, so a
key typo or a missing translation is visible at compile time and switching
language is just switching table.
