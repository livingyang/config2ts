<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{ filename: string; code: string; lang?: string }>();

const copied = ref(false);
const lineCount = computed(() => props.code.split("\n").length);

async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1200);
  } catch {
    /* clipboard unavailable — ignore */
  }
}
</script>

<template>
  <div class="code-block">
    <div class="code-bar">
      <span class="code-name">{{ props.filename }}</span>
      <span class="code-meta">{{ lineCount }} 行</span>
      <button class="copy-btn" type="button" @click="copy">{{ copied ? "已复制" : "复制" }}</button>
    </div>
    <pre><code>{{ props.code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--code-bg);
}
.code-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
}
.code-name {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}
.code-meta {
  font-size: 11px;
  color: var(--muted);
  margin-right: auto;
}
.copy-btn {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 5px;
  cursor: pointer;
}
.copy-btn:hover {
  color: var(--text);
  border-color: var(--accent);
}
pre {
  margin: 0;
  padding: 14px 16px;
  overflow: auto;
  max-height: 480px;
  font-family: var(--mono);
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--code-text);
  tab-size: 4;
}
</style>
