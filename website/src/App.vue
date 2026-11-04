<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { fixtures, findCase } from "./fixtures";
import CodeBlock from "./components/CodeBlock.vue";
import CsvTable from "./components/CsvTable.vue";
import DocsView from "./views/DocsView.vue";

interface Route {
  view: "docs" | "case";
  param: string;
}

function parseHash(): Route {
  const m = window.location.hash.match(/^#\/(docs|case)\/(.+)$/);
  if (m) return { view: m[1] as Route["view"], param: decodeURIComponent(m[2]) };
  return { view: "docs", param: "zh" };
}

const route = ref<Route>(parseHash());

// window.location.hash is NOT reactive data — a watch() getter on it never
// fires. Listen to the hashchange event instead.
const onHashChange = () => (route.value = parseHash());
window.addEventListener("hashchange", onHashChange);
onUnmounted(() => window.removeEventListener("hashchange", onHashChange));

function go(path: string): void {
  window.location.hash = path;
}

const currentCase = computed(() => (route.value.view === "case" ? findCase(route.value.param) : null) ?? fixtures[0] ?? null);

const navItems = [
  { path: "#/docs/zh", label: "文档 · 中文", view: "docs", param: "zh" },
  { path: "#/docs/en", label: "文档 · English", view: "docs", param: "en" },
  { path: `#/case/${fixtures[0]?.id ?? ""}`, label: "功能用例", view: "case", param: fixtures[0]?.id ?? "" },
] as const;

function isActive(item: (typeof navItems)[number]): boolean {
  if (item.view === "case" && route.value.view === "case") return true;
  return item.view === route.value.view && item.param === route.value.param;
}

function isTable(name: string): boolean {
  return /\.(csv|ini|toml)$/.test(name);
}
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <a class="brand" href="#/docs/zh">
        <span class="logo">config2ts</span>
        <span class="tagline">配置表 → 类型安全 TypeScript</span>
      </a>
      <nav class="nav">
        <a
          v-for="item in navItems"
          :key="item.path"
          class="nav-item"
          :class="{ active: isActive(item) }"
          :href="item.path"
        >{{ item.label }}</a>
      </nav>
      <a class="gh-link" href="https://github.com/livingyang/config2ts" target="_blank" rel="noreferrer">GitHub →</a>
    </header>

    <div class="body">
      <nav v-if="route.view === 'case'" class="sidebar">
        <div class="side-title">测试用例</div>
        <button
          v-for="c in fixtures"
          :key="c.id"
          class="case-item"
          :class="{ active: currentCase?.id === c.id }"
          type="button"
          @click="go(`#/case/${c.id}`)"
        >
          <span class="case-name">{{ c.id }}</span>
        </button>
        <p class="side-note">以下输入与输出与单元测试中的 golden file 完全一致，由 <code>fixtures:regen</code> 生成。</p>
      </nav>

      <main class="content" :class="{ wide: route.view === 'case' }">
        <DocsView v-if="route.view === 'docs'" :lang="route.param === 'en' ? 'en' : 'zh'" />
        <template v-else-if="currentCase">
          <h1 class="case-title">{{ currentCase.title }}</h1>
          <p class="case-desc">{{ currentCase.description }}</p>

          <section class="panel">
            <h2 class="panel-title">输入 · 源配置表</h2>
            <div v-for="f in currentCase.files" :key="f.name" class="stack">
              <div class="file-label">{{ f.name }}</div>
              <CsvTable v-if="isTable(f.name)" :filename="f.name" :raw="f.raw" />
              <CodeBlock v-else :filename="f.name" :code="f.raw" />
            </div>
          </section>

          <div class="arrow">↓ 转换</div>

          <section class="panel">
            <h2 class="panel-title">输出 · 生成 TypeScript</h2>
            <CodeBlock filename="expected.ts" :code="currentCase.expected" />
          </section>
        </template>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.topbar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--panel);
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
  text-decoration: none;
  color: var(--text);
}
.logo {
  font-family: var(--mono);
  font-weight: 700;
  font-size: 18px;
  color: var(--accent);
}
.tagline {
  font-size: 13px;
  color: var(--muted);
}
.nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.nav-item {
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  padding: 5px 12px;
  border-radius: 6px;
}
.nav-item:hover {
  color: var(--text);
  background: var(--hover);
}
.nav-item.active {
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  font-weight: 600;
}
.gh-link {
  font-size: 13px;
  color: var(--text);
  text-decoration: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 12px;
}
.gh-link:hover {
  border-color: var(--accent);
}
.body {
  display: flex;
  flex: 1;
  min-height: 0;
}
.sidebar {
  width: 230px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.side-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  padding: 0 8px 8px;
}
.case-item {
  text-align: left;
  border: none;
  background: transparent;
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.case-item:hover {
  background: var(--hover);
}
.case-item.active {
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent);
  font-weight: 600;
}
.side-note {
  margin-top: auto;
  font-size: 11.5px;
  color: var(--muted);
  line-height: 1.6;
  padding: 12px 8px 0;
  border-top: 1px solid var(--border);
}
.side-note code {
  font-family: var(--mono);
}
.content {
  flex: 1;
  min-width: 0;
  padding: 28px 36px 64px;
  max-width: 960px;
}
.content.wide {
  max-width: 1100px;
}
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
@media (max-width: 800px) {
  .body {
    flex-direction: column;
  }
  .sidebar {
    width: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    flex-direction: row;
    flex-wrap: wrap;
  }
  .side-note {
    display: none;
  }
  .content {
    padding: 20px 16px 48px;
  }
  .tagline {
    display: none;
  }
}
</style>
