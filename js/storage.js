import { APP_CONFIG } from "./config.js";

function isStorageAvailable() {
  try {
    const probeKey = "__imam_ali_display_probe__";
    window.localStorage.setItem(probeKey, "ok");
    window.localStorage.removeItem(probeKey);
    return true;
  } catch (error) {
    return false;
  }
}

function readJson(key) {
  if (!isStorageAvailable()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    return null;
  }
}

function writeJson(key, value) {
  if (!isStorageAvailable()) {
    return false;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  return true;
}

export function getPrayerTimesFromStorage() {
  return readJson(APP_CONFIG.storageKeys.prayerTimes);
}

export function savePrayerTimesToStorage(value) {
  return writeJson(APP_CONFIG.storageKeys.prayerTimes, value);
}

export function getEventsFromStorage() {
  return readJson(APP_CONFIG.storageKeys.events);
}

export function saveEventsToStorage(value) {
  return writeJson(APP_CONFIG.storageKeys.events, value);
}

export function getThemeFromStorage() {
  const storedTheme = readJson(APP_CONFIG.storageKeys.theme);
  return APP_CONFIG.themes[storedTheme] ? storedTheme : APP_CONFIG.defaultTheme;
}

export function saveThemeToStorage(theme) {
  const safeTheme = APP_CONFIG.themes[theme] ? theme : APP_CONFIG.defaultTheme;
  return writeJson(APP_CONFIG.storageKeys.theme, safeTheme);
}

export function clearStoredDisplayData() {
  if (!isStorageAvailable()) {
    return false;
  }

  const { prayerTimes, events, theme } = APP_CONFIG.storageKeys;
  window.localStorage.removeItem(prayerTimes);
  window.localStorage.removeItem(events);
  window.localStorage.removeItem(theme);
  return true;
}

export function hasLocalStorageSupport() {
  return isStorageAvailable();
}
