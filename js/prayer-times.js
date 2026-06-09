import { APP_CONFIG, SAMPLE_PRAYER_TIMES } from "./config.js";
import { getPrayerTimesFromStorage } from "./storage.js";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function pad(value) {
  return String(value).padStart(2, "0");
}

function isValidDateKey(dateKey) {
  return DATE_KEY_PATTERN.test(String(dateKey ?? "").trim());
}

function isValidTimeString(timeString) {
  return TIME_PATTERN.test(String(timeString ?? "").trim());
}

function normalizePrayerEntry(entry = {}) {
  const normalized = {
    date: String(entry.date ?? "").trim(),
    hijriDateArabic: String(entry.hijriDateArabic ?? "").trim(),
    hijriDateLatin: String(entry.hijriDateLatin ?? "").trim(),
  };

  APP_CONFIG.prayerOrder.forEach((key) => {
    normalized[key] = String(entry[key] ?? "").trim();
  });

  return normalized;
}

function sanitizePrayerEntry(entry) {
  const normalized = normalizePrayerEntry(entry);
  if (!isValidDateKey(normalized.date)) {
    return null;
  }

  const sanitized = { ...normalized };
  APP_CONFIG.prayerOrder.forEach((key) => {
    sanitized[key] = isValidTimeString(normalized[key]) ? normalized[key] : "";
  });

  return sanitized;
}

function sortPrayerEntries(entries) {
  return [...entries].sort((left, right) => left.date.localeCompare(right.date));
}

function sanitizePrayerTimesArray(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  const uniqueEntries = new Map();
  input.forEach((entry) => {
    const sanitized = sanitizePrayerEntry(entry);
    if (sanitized) {
      uniqueEntries.set(sanitized.date, sanitized);
    }
  });

  return sortPrayerEntries([...uniqueEntries.values()]);
}

function normalizePrayerPayload(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.prayerTimes)) {
    return payload.prayerTimes;
  }

  const collectedEntries = [];
  if (payload?.prayerTimes && typeof payload.prayerTimes === "object") {
    collectedEntries.push(payload.prayerTimes);
  }

  if (payload?.tomorrowPrayerTimes && typeof payload.tomorrowPrayerTimes === "object") {
    collectedEntries.push(payload.tomorrowPrayerTimes);
  }

  if (collectedEntries.length > 0) {
    return collectedEntries;
  }

  if (payload && typeof payload === "object" && "date" in payload) {
    return [payload];
  }

  return [];
}

async function fetchPrayerTimesJson(url) {
  if (typeof window === "undefined" || window.location.protocol === "file:" || typeof fetch !== "function") {
    return [];
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    return sanitizePrayerTimesArray(normalizePrayerPayload(payload));
  } catch (error) {
    return [];
  }
}

async function loadSamplePrayerTimesFromFile() {
  return fetchPrayerTimesJson(APP_CONFIG.samplePaths.prayerTimes);
}

async function loadPrayerTimesFromFunction(date = new Date()) {
  const requestedDate = getLocalDateKey(date);
  const endpoint = `${APP_CONFIG.apiPaths.todayPrayerTimes}?date=${encodeURIComponent(requestedDate)}`;
  return fetchPrayerTimesJson(endpoint);
}

function addLocalDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, 0, 0, 0, 0);
}

function findPrayerEntry(prayerTimes, dateKey) {
  if (!Array.isArray(prayerTimes) || !isValidDateKey(dateKey)) {
    return null;
  }

  return prayerTimes.find((entry) => entry.date === dateKey) ?? null;
}

function buildPrayerCandidate(entry, prayerKey) {
  if (!entry || !APP_CONFIG.prayerMeta[prayerKey]) {
    return null;
  }

  const time = String(entry[prayerKey] ?? "").trim();
  const at = parseTimeForDate(entry.date, time);
  if (!at) {
    return null;
  }

  return {
    key: prayerKey,
    label: APP_CONFIG.prayerMeta[prayerKey],
    time,
    at,
    dateKey: entry.date,
  };
}

export function validatePrayerTimesArray(input) {
  if (!Array.isArray(input)) {
    return {
      valid: false,
      errors: ["Prayer times must be an array of daily objects."],
      normalized: [],
    };
  }

  const errors = [];
  const normalized = input.map(normalizePrayerEntry);

  normalized.forEach((entry, index) => {
    if (!isValidDateKey(entry.date)) {
      errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
    }

    APP_CONFIG.prayerOrder.forEach((key) => {
      if (!isValidTimeString(entry[key])) {
        errors.push(`Entry ${index + 1}: ${key} must use HH:mm.`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    normalized,
  };
}

export async function loadPrayerTimes() {
  const storedPrayerTimes = sanitizePrayerTimesArray(getPrayerTimesFromStorage());
  if (storedPrayerTimes.length > 0) {
    return { items: storedPrayerTimes, source: "localStorage" };
  }

  const filePrayerTimes = await loadSamplePrayerTimesFromFile();
  if (filePrayerTimes.length > 0) {
    return { items: filePrayerTimes, source: "sample-file" };
  }

  const functionPrayerTimes = await loadPrayerTimesFromFunction();
  if (functionPrayerTimes.length > 0) {
    return { items: functionPrayerTimes, source: "netlify-function" };
  }

  return {
    items: sanitizePrayerTimesArray(SAMPLE_PRAYER_TIMES),
    source: "inline-sample",
  };
}

export function getLocalDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseTimeForDate(dateKey, timeString) {
  if (!isValidDateKey(dateKey) || !isValidTimeString(timeString)) {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  const parsedDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function getTodayPrayerTimes(prayerTimes, date = new Date()) {
  return findPrayerEntry(prayerTimes, getLocalDateKey(date));
}

export function getTomorrowPrayerTimes(prayerTimes, date = new Date()) {
  return findPrayerEntry(prayerTimes, getLocalDateKey(addLocalDays(date, 1)));
}

export function getNextPrayer(todayEntry, now = new Date(), tomorrowEntry = null) {
  if (!todayEntry) {
    return {
      status: "missing-today",
      key: null,
      label: null,
      time: "",
      at: null,
      dateKey: getLocalDateKey(now),
      dayOffset: 0,
    };
  }

  for (const prayerKey of APP_CONFIG.prayerOrder) {
    const candidate = buildPrayerCandidate(todayEntry, prayerKey);
    if (candidate && candidate.at.getTime() >= now.getTime()) {
      return {
        ...candidate,
        status: "upcoming-today",
        dayOffset: 0,
      };
    }
  }

  const tomorrowFajr = buildPrayerCandidate(tomorrowEntry, "fajr");
  if (tomorrowFajr && tomorrowFajr.at.getTime() >= now.getTime()) {
    return {
      ...tomorrowFajr,
      status: "upcoming-tomorrow",
      dayOffset: 1,
    };
  }

  return {
    status: "day-completed",
    key: null,
    label: null,
    time: "",
    at: null,
    dateKey: todayEntry.date,
    dayOffset: 0,
  };
}

export function getPrayerDisplayTime(entry, prayerKey) {
  const value = String(entry?.[prayerKey] ?? "").trim();
  return isValidTimeString(value) ? value : "--:--";
}

export function getCountdownPayload(targetDate, now = new Date()) {
  if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) {
    return {
      totalMs: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      main: "--:--:--",
      arabic: APP_CONFIG.prayerMessages.countdownUnavailable.arabic,
      danish: APP_CONFIG.prayerMessages.countdownUnavailable.danish,
    };
  }

  const totalMs = Math.max(0, targetDate.getTime() - now.getTime());
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);

  return {
    totalMs,
    hours,
    minutes,
    seconds,
    main: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    arabic: `${hours}س ${minutes}د ${seconds}ث`,
    danish: `${hours}t ${minutes}m ${seconds}s`,
  };
}
