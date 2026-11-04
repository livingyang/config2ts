<script setup lang="ts">
import { computed } from "vue";
import { renderMarkdown } from "../markdown";
import docsEn from "../content/docs-en.md?raw";
import docsZh from "../content/docs-zh.md?raw";

const props = defineProps<{ lang: "zh" | "en" }>();

const html = computed(() => renderMarkdown(props.lang === "zh" ? docsZh : docsEn, `/docs/${props.lang}`));
</script>

<template>
  <!-- Content is our own committed markdown, not user input — v-html is safe here. -->
  <article class="docs" v-html="html"></article>
</template>

<style scoped>
.docs {
  max-width: 860px;
  font-size: 14.5px;
  line-height: 1.75;
}
.docs :deep(h1) {
  font-size: 26px;
  margin: 8px 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.docs :deep(h2) {
  font-size: 20px;
  margin: 36px 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.docs :deep(h3) {
  font-size: 16.5px;
  margin: 26px 0 10px;
}
.docs :deep(p) {
  margin: 10px 0;
}
.docs :deep(a) {
  color: var(--accent);
  text-decoration: none;
}
.docs :deep(a:hover) {
  text-decoration: underline;
}
.docs :deep(code) {
  font-family: var(--mono);
  font-size: 0.9em;
  background: var(--hover);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
}
.docs :deep(pre) {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px 16px;
  overflow: auto;
  line-height: 1.55;
}
.docs :deep(pre code) {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 12.5px;
  color: var(--code-text);
}
.docs :deep(table) {
  border-collapse: collapse;
  margin: 14px 0;
  font-size: 13.5px;
  width: 100%;
}
.docs :deep(th),
.docs :deep(td) {
  border: 1px solid var(--border);
  padding: 6px 12px;
  text-align: left;
}
.docs :deep(th) {
  background: var(--panel);
}
.docs :deep(blockquote) {
  margin: 12px 0;
  padding: 4px 16px;
  border-left: 3px solid var(--accent);
  color: var(--muted);
  background: var(--hover);
  border-radius: 0 6px 6px 0;
}
.docs :deep(ul),
.docs :deep(ol) {
  padding-left: 24px;
}
.docs :deep(li) {
  margin: 4px 0;
}
.docs :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 28px 0;
}
</style>
