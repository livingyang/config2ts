// Single source of truth: the demo reads the same fixtures/<case>/ pairs the
// unit tests verify (see tests/fixtures.test.ts). No copies, no codegen —
// whatever the golden tests pass on is exactly what the demo shows.
export interface FixtureFile {
  name: string;
  raw: string;
}

export interface FixtureCase {
  id: string;
  title: string;
  description: string;
  files: FixtureFile[];
  expected: string;
}

// NOTE: import.meta.glob requires its options to be an inline object literal
// (Vite parses the call statically), so the options are repeated on purpose.
const sourceModules = import.meta.glob("../../fixtures/*/*.{csv,ini,toml}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const expectedModules = import.meta.glob("../../fixtures/*/expected.ts", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
const readmeModules = import.meta.glob("../../fixtures/*/README.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function caseIdOf(key: string): string {
  // key looks like "../../fixtures/01-basic-types/data.csv"
  const parts = key.split("/");
  const i = parts.indexOf("fixtures");
  return parts[i + 1];
}

function readDescription(caseId: string): { title: string; description: string } {
  const key = Object.keys(readmeModules).find((k) => caseIdOf(k) === caseId);
  if (!key) return { title: caseId, description: "" };
  const lines = (readmeModules[key] as string).split("\n");
  // First line is the "# <case>" heading; the rest is the feature description.
  const body = lines.slice(1).join("\n").trim();
  return { title: caseId, description: body };
}

const byId = new Map<string, FixtureCase>();

for (const [key, raw] of Object.entries(sourceModules)) {
  const id = caseIdOf(key);
  if (!byId.has(id)) {
    const meta = readDescription(id);
    byId.set(id, { id, title: meta.title, description: meta.description, files: [], expected: "" });
  }
  byId.get(id)!.files.push({ name: key.split("/").pop()!, raw });
}

for (const [key, raw] of Object.entries(expectedModules)) {
  const id = caseIdOf(key);
  const c = byId.get(id);
  if (c) c.expected = raw;
}

export const fixtures: FixtureCase[] = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));

export function findCase(id: string | null): FixtureCase | null {
  if (!id) return null;
  return fixtures.find((c) => c.id === id) ?? null;
}
