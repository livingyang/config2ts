<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { LANGS, docsLang, lang, setLang, t, type Lang } from "../i18n";

const route = useRoute();
const router = useRouter();

function onChange(e: Event): void {
  const next = (e.target as HTMLSelectElement).value as Lang;
  setLang(next);
  // Docs only exist in zh/en — keep the route in sync with the chosen language
  // (ja viewers get the English docs, announced by a banner in DocsView).
  if (route.name === "docs" && route.params.lang !== docsLang()) {
    router.replace({ name: "docs", params: { lang: docsLang() } });
  }
}
</script>

<template>
  <label class="lang-select" :title="t('lang.label')">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 4 5.9 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.9-4-9s1.4-6.3 4-9z" />
    </svg>
    <select class="select" :value="lang" :aria-label="t('lang.label')" @change="onChange">
      <option v-for="l in LANGS" :key="l.id" :value="l.id">{{ t(l.labelKey) }}</option>
    </select>
    <svg class="chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  </label>
</template>

<style scoped>
.lang-select {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px 0 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted);
  cursor: pointer;
  background: transparent;
  position: relative;
}
.lang-select:hover {
  border-color: var(--accent);
  color: var(--text);
}
.icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.chevron {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  pointer-events: none;
}
.select {
  appearance: none;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  padding-right: 2px;
  cursor: pointer;
  outline: none;
}
.select option {
  background: var(--panel);
  color: var(--text);
}
</style>
