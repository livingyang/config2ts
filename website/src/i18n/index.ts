import { ref } from "vue";
import { UiCsv } from "./ui";

export type Lang = "zh" | "en" | "ja";

export const LANGS: { id: Lang; labelKey: string }[] = [
  { id: "zh", labelKey: "lang.zh" },
  { id: "en", labelKey: "lang.en" },
  { id: "ja", labelKey: "lang.ja" },
];

const STORAGE_KEY = "config2ts.lang";

function storedLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "zh" || v === "en" || v === "ja") return v;
  } catch {
    /* storage unavailable — fall through */
  }
  return "zh";
}

export const lang = ref<Lang>(storedLang());

export function setLang(next: Lang): void {
  lang.value = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable — language still switches for this session */
  }
}

/**
 * Look up a UI string from the same table the demo renders (website/src/i18n/ui.csv,
 * compiled to ui.ts by config2ts). Missing keys fall back to the key itself so a
 * typo is visible on screen instead of silently blank.
 */
export function t(key: string): string {
  const row = UiCsv.Map[key];
  if (!row) return key;
  return row[lang.value] || row.zh || key;
}

/** Docs exist in zh/en only; Japanese visitors get the English docs. */
export function docsLang(): "zh" | "en" {
  return lang.value === "en" ? "en" : lang.value === "ja" ? "en" : "zh";
}
