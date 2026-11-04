import { createRouter, createWebHashHistory } from "vue-router";
import DocsView from "./views/DocsView.vue";
import CaseView from "./views/CaseView.vue";
import { fixtures } from "./fixtures";
import { docsLang } from "./i18n";

const firstCase = fixtures[0]?.id ?? "";

// Hash history keeps GitHub Pages happy (no 404.html rewrite needed).
// vue-router parses a second '#' inside the hash, so deep links like
// "#/docs/zh#quick-start" carry both the route and an in-document anchor.
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Land on the docs in the visitor's remembered language (ja → English docs).
    { path: "/", redirect: () => `/docs/${docsLang()}` },
    { path: "/docs/:lang(zh|en)", name: "docs", component: DocsView, props: true },
    { path: "/case/:caseId", name: "case", component: CaseView, props: true },
    { path: "/:pathMatch(.*)*", redirect: "/docs/zh" },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 76, behavior: "smooth" };
    return { top: 0 };
  },
});

export { firstCase };
