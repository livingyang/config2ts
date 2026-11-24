# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- Removed the `# matrix: <type>` header directive and its `Matrix: T[][]`
  output mode (introduced in 2.11.0). It had no real consumers — the
  variable-length 2D tables that motivated it live as ref JSON, not CSV — and
  it bypassed the normal `List` / `Map` / `FileMap` pipeline, adding a separate
  output path for an opt-in feature nobody used.
- Removed the `# key: <col>` header directive (introduced in 2.11.0). It had no
  real consumers. The primary key is now always the column typed `Index` /
  `EnumIndex`, which drives `Map` / `byKey`; the header-directive parsing layer
  (`parseDirectives`) was removed with it. Tables without an `Index` /
  `EnumIndex` column still produce no `Map`, as before 2.11.0.

## [2.11.1] - 2026-11-24

Security patch. No API or output changes.

### Fixed

- Upgraded `toml` from 4.3.0 to 5.0.1 to resolve four high-severity advisories
  (CVE-2026-114141 / 114142 / 114143 / 114144). Verified all fixture goldens
  remain byte-identical, so generated output is unchanged.

## [2.11.0] - 2026-11-15

This release adds a batch of quality-of-life features requested from real-world
use (large merged tables, dynamic lookups, and a drift gate for CI). **All new
behavior is opt-in or backwards compatible** — the
default output of existing commands and configs is unchanged, so this is a
minor version bump.

### Added

- **Merged-table key auto-qualification** (`--auto-qualify`): each merged row's
  key is prefixed with its member file name as `<file>:<index>` so sibling
  files that each number from 1 no longer collide; the original `Index` is kept
  in a new `localIndex` field, and the duplicate-key warning is suppressed
  automatically.
- **Dynamic key lookup** (`byKey(key): Record | undefined`): a safe escape hatch
  for consuming an index-keyed namespace (plain or merged) by a runtime string
  key without tripping `TS7053`. It deliberately does **not** add a `string`
  index signature to `FileMap`, preserving the compile-time guard that catches
  typos like `FileMap["typo"]`.
- **Declarative primary key** (`# key: <col>` header directive): name any column
  as the primary key instead of relying on an `Index` / `EnumIndex` typed
  column. A missing column warns and falls back to type-based detection.
- **Native matrix mode** (`# matrix: <string|number|boolean>` header directive):
  emit the whole file as a variable-length 2D grid `Matrix: T[][]` with
  `RowCount` / `ColCount`, faithful for boards, timelines and maps without
  `C0..Cn` padding.
- **Optional columns in merged subdirectories**: member files that omit a few
  columns are merged with the missing cells padded to the column's type default,
  instead of rejecting the whole merge. Only a genuine type clash on a shared
  column is still rejected.
- **Recursive manifest merge groups** (`config2ts.manifest.json` →
  `mergeGroups: [{ dir, recursive }]`): flatten deeply-nested csv into one
  virtual table with the nested paths used as sub-table keys.
- **JSON array literals in array cells**: a cell written as `[...]` is parsed as
  a real array (so elements may contain commas) via `json5`; invalid JSON falls
  back to comma splitting — fully backwards compatible.
- **Quality gates**: `--strict` escalates structural skips (un-mergeable
  subdirectories) to hard errors; `--verify-against <ref>` checks the generated
  output against a reference snapshot (`.ts`, or `.json` wrapping the text under
  `"source"`) and exits non-zero on drift without writing output.

### Fixed

- Avoided silent data loss when merged tables had duplicate `Index` keys: the
  later row previously overwrote the earlier one. Enable `--auto-qualify` to
  separate the key spaces at the source.

[Unreleased]: https://github.com/livingyang/config2ts/compare/v2.11.1...HEAD
[2.11.1]: https://github.com/livingyang/config2ts/compare/v2.11.0...v2.11.1
[2.11.0]: https://github.com/livingyang/config2ts/compare/v2.10.1...v2.11.0
