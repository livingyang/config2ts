<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { fixtures } from "./fixtures";

const route = useRoute();

const inCaseView = computed(() => route.name === "case");
const activeCaseId = computed(() => (route.name === "case" ? String(route.params.caseId) : ""));

const navItems = computed(() => [
  { to: "/docs/zh", label: "文档 · 中文" },
  { to: "/docs/en", label: "文档 · English" },
  { to: { name: "case", params: { caseId: fixtures[0]?.id ?? "" } }, label: "功能用例" },
]);

function isActive(to: (typeof navItems.value)[number]["to"]): boolean {
  if (typeof to === "object") return inCaseView.value;
  return route.path === to;
}
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <RouterLink class="brand" to="/docs/zh">
        <span class="logo">config2ts</span>
        <span class="tagline">配置表 → 类型安全 TypeScript</span>
      </RouterLink>
      <nav class="nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.label"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
          :to="item.to"
        >{{ item.label }}</RouterLink>
      </nav>
      <a class="gh-link" href="https://github.com/livingyang/config2ts" target="_blank" rel="noreferrer">GitHub →</a>
    </header>

    <div class="body">
      <nav v-if="inCaseView" class="sidebar">
        <div class="side-title">测试用例</div>
        <RouterLink
          v-for="c in fixtures"
          :key="c.id"
          class="case-item"
          :class="{ active: activeCaseId === c.id }"
          :to="{ name: 'case', params: { caseId: c.id } }"
        >{{ c.id }}</RouterLink>
        <p class="side-note">以下输入与输出与单元测试中的 golden file 完全一致，由 <code>fixtures:regen</code> 生成。</p>
      </nav>

      <main class="content" :class="{ wide: inCaseView }">
        <RouterView />
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
  display: block;
  text-decoration: none;
  color: var(--text);
  font-family: var(--mono);
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 6px;
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
