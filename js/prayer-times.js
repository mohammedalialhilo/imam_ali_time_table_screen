import { APP_CONFIG, SAMPLE_PRAYER_TIMES } from "./config.js";
import { getPrayerTimesFromStorage } from "./storage.js";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatArabicNumber(value) {
  return new Intl.NumberFormat("ar").format(value);
}

function addDaysToDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createDateTime(dateKey, timeValue) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hours, minutes] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function normalizePrayerEntry(entry) {
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
      errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
    }

    APP_CONFIG.prayerOrder.forEach((key) => {
      if (!TIME_PATTERN.test(entry[key])) {
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

async function loadSamplePrayerTimesFromFile() {
  if (typeof window === "undefined" || window.location.protocol === "file:" || typeof fetch !== "function") {
    return null;
  }

  try {
    const response = await fetch(APP_CONFIG.samplePaths.prayerTimes, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const validation = validatePrayerTimesArray(payload);
    return validation.valid ? validation.normalized : null;
  } catch (error) {
    return null;
  }
}

export async function loadPrayerTimes() {
  const stored = getPrayerTimesFromStorage();
  const storedValidation = validatePrayerTimesArray(stored);
  if (storedValidation.valid && storedValidation.normalized.length > 0) {
    return { items: storedValidation.normalized, source: "localStorage" };
  }

  const fileData = await loadSamplePrayerTimesFromFile();
  if (fileData && fileData.length > 0) {
    return { items: fileData, source: "sample-file" };
  }

  return {
    items: validatePrayerTimesArray(SAMPLE_PRAYER_TIMES).normalized,
    source: "inline-sample",
  };
}

export function getResolvedPrayerEntries(prayerTimes, currentDateKey) {
  if (!Array.isArray(prayerTimes) || prayerTimes.length === 0) {
    return { today: null, nextDay: null };
  }

  const sorted = [...prayerTimes].sort((left, right) => left.date.localeCompare(right.date));
  const exactIndex = sorted.findIndex((entry) => entry.date === currentDateKey);

  if (exactIndex >= 0) {
    return {
      today: sorted[exactIndex],
      nextDay: sorted[exactIndex + 1] ?? sorted[0],
    };
  }

  const futureIndex = sorted.findIndex((entry) => entry.date > currentDateKey);
  if (futureIndex === 0) {
    return { today: sorted[0], nextDay: sorted[1] ?? sorted[0] };
  }

  if (futureIndex > 0) {
    return {
      today: sorted[futureIndex - 1],
      nextDay: sorted[futureIndex] ?? sorted[futureIndex - 1],
    };
  }

  return {
    today: sorted[sorted.length - 1],
    nextDay: sorted[0],
  };
}

export function getNextPrayerInfo(todayEntry, now, nextDayEntry) {
  if (!todayEntry) {
    return null;
  }

  for (const key of APP_CONFIG.countdownPrayerKeys) {
    const candidate = createDateTime(todayEntry.date, todayEntry[key]);
    if (candidate.getTime() > now.getTime()) {
      return { key, label: APP_CONFIG.prayerMeta[key], time: todayEntry[key], at: candidate };
    }
  }

  const fallbackDate = nextDayEntry?.date ?? addDaysToDateKey(todayEntry.date, 1);
  const fallbackTime = nextDayEntry?.fajr ?? todayEntry.fajr;

  return {
    key: "fajr",
    label: APP_CONFIG.prayerMeta.fajr,
    time: fallbackTime,
    at: createDateTime(fallbackDate, fallbackTime),
  };
}

export function getCountdownPayload(targetDate, now = new Date()) {
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
    arabic: `${formatArabicNumber(hours)} س ${formatArabicNumber(minutes)} د ${formatArabicNumber(seconds)} ث`,
    danish: `${hours} t ${minutes} m ${seconds} s`,
  };
}
