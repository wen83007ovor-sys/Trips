let currentLang = "zh-TW";
let fabOpen = true;
let previewMode = false;

export function getLang() { return currentLang; }
export function setLang(lang) { currentLang = lang; }

export function isFabOpen() { return fabOpen; }
export function setFabOpen(v) { fabOpen = v; }

export function isPreviewMode() { return previewMode; }
export function setPreviewMode(v) { previewMode = v; }
