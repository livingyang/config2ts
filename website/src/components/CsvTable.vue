<script setup lang="ts">
import { computed } from "vue";
import { csvParse } from "d3-dsv";

const props = defineProps<{ filename: string; raw: string }>();

// Parse the CSV so the demo shows an actual table instead of raw text.
// ini/toml fall back to a plain code view.
const parsed = computed(() => {
  if (!props.filename.endsWith(".csv")) return null;
  try {
    const rows = csvParse(props.raw.trim());
    if (rows.length === 0 || rows.columns.length === 0) return null;
    // Row 2 of a config2ts table is the field-type row — highlight it.
    return { columns: rows.columns as string[], rows, typeRowIndex: 0 };
  } catch {
    return null;
  }
});
</script>

<template>
  <div v-if="parsed" class="csv-table-wrap">
    <table class="csv-table">
      <thead>
        <tr>
          <th v-for="c in parsed.columns" :key="c">{{ c }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in parsed.rows" :key="i" :class="{ 'type-row': i === parsed.typeRowIndex }">
          <td v-for="c in parsed.columns" :key="c">{{ row[c] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <pre v-else class="raw-pre">{{ props.raw }}</pre>
</template>

<style scoped>
.csv-table-wrap {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: auto;
  max-height: 360px;
}
.csv-table {
  border-collapse: collapse;
  width: 100%;
  font-family: var(--mono);
  font-size: 12px;
  white-space: pre;
}
.csv-table th,
.csv-table td {
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  padding: 5px 10px;
  text-align: left;
  vertical-align: top;
}
.csv-table th {
  position: sticky;
  top: 0;
  background: var(--panel);
  color: var(--accent);
  font-weight: 600;
  z-index: 1;
}
.csv-table tr:last-child td {
  border-bottom: none;
}
.csv-table .type-row td {
  color: var(--type-color);
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  font-style: italic;
}
.csv-table td:empty::after {
  content: "⌀";
  color: var(--muted);
  opacity: 0.5;
}
.raw-pre {
  margin: 0;
  padding: 14px 16px;
  overflow: auto;
  max-height: 360px;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--code-text);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--code-bg);
}
</style>
