<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import { fixtures } from "./fixtures";
import { docsLang, t } from "./i18n";
import LanguageSelect from "./components/LanguageSelect.vue";

const route = useRoute();

const inCaseView = computed(() => route.name === "case");
const activeCaseId = computed(() => (route.name === "case" ? String(route.params.caseId) : ""));
const docsTarget = computed(() => `/docs/${docsLang()}`);
// Injected from the root package.json by vite.config.ts (see VITE_APP_VERSION).
const version = (import.meta.env.VITE_APP_VERSION as string) || "";
</script>

<template>
  <div class="layout">
    <header class="topbar">
      <RouterLink class="brand" :to="docsTarget">
        <span class="logo">config2ts</span>
        <span v-if="version" class="version" :title="`v${version}`">v{{ version }}</span>
        <span class="tagline">{{ t("site.tagline") }}</span>
      </RouterLink>

      <nav class="nav">
        <RouterLink class="nav-item" :class="{ active: route.name === 'docs' }" :to="docsTarget">
          {{ t("nav.docs") }}
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="{ active: route.name === 'changelog' }"
          :to="{ name: 'changelog' }"
        >
          {{ t("nav.changelog") }}
        </RouterLink>
        <RouterLink
          class="nav-item"
          :class="{ active: inCaseView }"
          :to="{ name: 'case', params: { caseId: fixtures[0]?.id ?? '' } }"
        >
          {{ t("nav.cases") }}
        </RouterLink>
      </nav>

      <div class="actions">
        <LanguageSelect />
        <a
          class="icon-btn"
          href="https://github.com/livingyang/config2ts"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
        </a>
      </div>
    </header>

    <div class="body">
      <nav v-if="inCaseView" class="sidebar">
        <div class="side-title">{{ t("case.sidebar.title") }}</div>
        <RouterLink
          v-for="c in fixtures"
          :key="c.id"
          class="case-item"
          :class="{ active: activeCaseId === c.id }"
          :to="{ name: 'case', params: { caseId: c.id } }"
        >{{ c.id }}</RouterLink>
        <p class="side-note">{{ t("case.sidebar.note") }}</p>
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
.version {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  padding: 1px 8px;
  border-radius: 999px;
  line-height: 1.5;
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
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--muted);
}
.icon-btn:hover {
  color: var(--text);
  border-color: var(--accent);
}
.icon-btn svg {
  width: 16px;
  height: 16px;
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
