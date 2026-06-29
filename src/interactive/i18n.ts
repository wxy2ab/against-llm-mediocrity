import type { Lang } from "./types";

export function resolveLang(): Lang {
  return new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
}

export function persistLang(lang: Lang): void {
  history.replaceState({}, "", `${location.pathname}?lang=${lang}${location.hash}`);
}

export function applyDocumentLang(lang: Lang, title: string): void {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.title = title;
}
