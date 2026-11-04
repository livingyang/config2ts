<script setup lang="ts">
import { computed } from "vue";
import { findCase, fixtures } from "../fixtures";
import { t } from "../i18n";
import CodeBlock from "../components/CodeBlock.vue";
import CsvTable from "../components/CsvTable.vue";

const props = defineProps<{ caseId: string }>();

const current = computed(() => findCase(props.caseId) ?? fixtures[0] ?? null);

// Titles/descriptions come from the trilingual table (website/src/i18n/ui.csv);
// the fixture README description is the fallback for any untranslated case.
const title = computed(() => (current.value ? t(`case.${current.value.id}.title`) : ""));
const description = computed(() => {
  if (!current.value) return "";
  const localized = t(`case.${current.value.id}.desc`);
  return localized === `case.${current.value.id}.desc` ? current.value.description : localized;
});

function isTable(name: string): boolean {
  return /\.(csv|ini|toml)$/.test(name);
}
</script>

<template>
  <div v-if="current">
    <h1 class="case-title">{{ title }}</h1>
    <p class="case-desc">{{ description }}</p>

    <section class="panel">
      <h2 class="panel-title">{{ t("case.input.title") }}</h2>
      <div v-for="f in current.files" :key="f.name" class="stack">
        <div class="file-label">{{ f.name }}</div>
        <CsvTable v-if="isTable(f.name)" :filename="f.name" :raw="f.raw" />
        <CodeBlock v-else :filename="f.name" :code="f.raw" />
      </div>
    </section>

    <div class="arrow">{{ t("case.arrow") }}</div>

    <section class="panel">
      <h2 class="panel-title">{{ t("case.output.title") }}</h2>
      <CodeBlock filename="expected.ts" :code="current.expected" />
    </section>
  </div>
</template>

<style scoped>
.case-title {
  font-size: 22px;
  margin: 0 0 8px;
}
.case-desc {
  font-size: 13.5px;
  color: var(--muted);
  line-height: 1.7;
  margin: 0 0 24px;
  max-width: 72ch;
}
.panel-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin: 0 0 12px;
}
.stack {
  margin-bottom: 16px;
}
.file-label {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text);
  margin-bottom: 6px;
}
.arrow {
  text-align: center;
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  margin: 20px 0;
  letter-spacing: 0.2em;
}
</style>
