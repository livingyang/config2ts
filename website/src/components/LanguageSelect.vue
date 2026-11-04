<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LANGS, docsLang, lang, setLang, t, type Lang } from "../i18n";

const route = useRoute();
const router = useRouter();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

function toggle(): void {
  open.value = !open.value;
}

function choose(next: Lang): void {
  open.value = false;
  setLang(next);
  // Docs only exist in zh/en — keep the route in sync with the chosen language
  // (ja viewers get the English docs, announced by a banner in DocsView).
  if (route.name === "docs" && route.params.lang !== docsLang()) {
    router.replace({ name: "docs", params: { lang: docsLang() } });
  }
}

function onDocumentClick(e: MouseEvent): void {
  if (open.value && root.value && !root.value.contains(e.target as Node)) {
    open.value = false;
  }
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape" && open.value) {
    open.value = false;
    (root.value?.querySelector(".lang-btn") as HTMLButtonElement | null)?.focus();
  }
}

onMounted(() => document.addEventListener("click", onDocumentClick));
onUnmounted(() => document.removeEventListener("click", onDocumentClick));
</script>

<template>
  <div ref="root" class="lang" @keydown="onKeydown">
    <button
      class="lang-btn"
      type="button"
      :aria-label="t('lang.label')"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 2.7 4 5.9 4 9s-1.4 6.3-4 9c-2.6-2.7-4-5.9-4-9s1.4-6.3 4-9z" />
      </svg>
      <span class="label">{{ t(`lang.${lang}`) }}</span>
      <svg class="chevron" :class="{ flip: open }" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </button>

    <Transition name="drop">
      <ul v-if="open" class="menu" role="listbox" :aria-label="t('lang.label')">
        <li v-for="l in LANGS" :key="l.id">
          <button
            class="menu-item"
            :class="{ active: lang === l.id }"
            type="button"
            role="option"
            :aria-selected="lang === l.id"
            @click="choose(l.id)"
          >
            <span>{{ t(l.labelKey) }}</span>
            <svg v-if="lang === l.id" class="check" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path d="M2 6.2 4.8 9 10 3.4" />
            </svg>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang {
  position: relative;
}
/* Same chrome as the GitHub icon button: 32px tall, 8px radius, subtle border */
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
}
.lang-btn:hover,
.lang-btn[aria-expanded="true"] {
  color: var(--text);
  border-color: var(--accent);
  background: var(--hover);
}
.icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.label {
  line-height: 1;
  white-space: nowrap;
}
.chevron {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}
.chevron.flip {
  transform: rotate(180deg);
}
.menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 150px;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  z-index: 100;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
.menu-item:hover {
  background: var(--hover);
}
.menu-item.active {
  color: var(--accent);
  font-weight: 600;
}
.check {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}
.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
