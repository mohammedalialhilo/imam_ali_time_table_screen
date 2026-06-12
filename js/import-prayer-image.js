const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const STRICT_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const HEADER_TOKENS = ["ugedag", "date", "subh", "solopgang", "dhuhr", "solnedgang", "maghrib", "midnat"];
const DANISH_WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag", "lordag", "sondag"];

export const IMPORT_MONTH_OPTIONS = [
  { value: 1, label: "January / Januar" },
  { value: 2, label: "February / Februar" },
  { value: 3, label: "March / Marts" },
  { value: 4, label: "April / April" },
  { value: 5, label: "May / Maj" },
  { value: 6, label: "June / Juni" },
  { value: 7, label: "July / Juli" },
  { value: 8, label: "August / August" },
  { value: 9, label: "September / September" },
  { value: 10, label: "October / Oktober" },
  { value: 11, label: "November / November" },
  { value: 12, label: "December / December" },
];

export const SAMPLE_TIMETABLE_TEXT = `Ugedag Date Subh Solopgang Dhuhr Solnedgang Maghrib Midnat
onsdag 1 01:44 04:30 13:14 21:56 22:37 23:50
torsdag 2 01:44 04:31 13:14 21:56 22:36 23:50
fredag 3 01:44 04:32 13:14 21:55 22:35 23:50
lørdag 4 01:44 04:33 13:14 21:55 22:35 23:50
søndag 5 01:44 04:34 13:14 21:54 22:34 23:49
mandag 6 01:45 04:35 13:14 21:53 22:33 23:49
tirsdag 7 01:45 04:36 13:15 21:52 22:32 23:49
onsdag 8 01:45 04:37 13:15 21:52 22:31 23:48
torsdag 9 01:45 04:39 13:15 21:51 22:30 23:48
fredag 10 01:45 04:40 13:15 21:50 22:28 23:48
lørdag 11 01:45 04:41 13:15 21:49 22:27 23:47
søndag 12 01:46 04:42 13:15 21:48 22:26 23:47
mandag 13 01:46 04:44 13:15 21:46 22:24 23:46
tirsdag 14 01:46 04:45 13:16 21:45 22:23 23:46
onsdag 15 01:46 04:47 13:16 21:44 22:21 23:45
torsdag 16 01:46 04:48 13:16 21:43 22:20 23:44
fredag 17 01:46 04:50 13:16 21:41 22:18 23:44
lørdag 18 01:46 04:51 13:16 21:40 22:16 23:43
søndag 19 01:46 04:53 13:16 21:38 22:15 23:42
mandag 20 01:46 04:54 13:16 21:37 22:13 23:42
tirsdag 21 01:46 04:56 13:16 21:35 22:11 23:41
onsdag 22 01:46 04:58 13:16 21:34 22:09 23:40
torsdag 23 01:46 04:59 13:16 21:32 22:07 23:39
fredag 24 01:47 05:01 13:16 21:31 22:06 23:39
lørdag 25 01:47 05:03 13:16 21:29 22:04 23:38
søndag 26 01:47 05:04 13:16 21:27 22:02 23:37
mandag 27 01:47 05:06 13:16 21:25 21:59 23:36
tirsdag 28 01:47 05:08 13:16 21:23 21:57 23:35
onsdag 29 01:47 05:10 13:16 21:22 21:55 23:34
torsdag 30 01:47 05:11 13:16 21:20 21:53 23:33
fredag 31 01:46 05:13 13:16 21:18 21:51 23:32`;

function pad(value) {
  return String(value).padStart(2, "0");
}

function isDateKey(value) {
  return DATE_KEY_PATTERN.test(String(value ?? "").trim());
}

function isStrictTime(value) {
  return STRICT_TIME_PATTERN.test(String(value ?? "").trim());
}

function isRealCalendarDate(year, month, day) {
  const candidate = new Date(year, month - 1, day, 12, 0, 0, 0);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
}

function simplifyTextForMatching(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function containsDanishWeekday(line = "") {
  const simplified = simplifyTextForMatching(line);
  return DANISH_WEEKDAYS.some((weekday) => simplified.includes(simplifyTextForMatching(weekday)));
}

function normalizeTextLine(rawLine = "") {
  return String(rawLine)
    .normalize("NFKC")
    .replace(/\u00A0/g, " ")
    .replace(/\t+/g, " ")
    .replace(/\b(\d{1,2})\s*[.,]\s*(\d{2})\b/g, "$1:$2")
    .replace(/\b(\d{1,2})\s*:\s*(\d{2})\b/g, "$1:$2")
    .replace(/(\d{1,2}:\d{2})[,;]+/g, "$1")
    .replace(/[|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeHeader(line) {
  const lower = simplifyTextForMatching(line);
  const matches = HEADER_TOKENS.filter((token) => lower.includes(token)).length;
  return matches >= 3;
}

function looksLikeNoiseLine(line = "") {
  const lower = simplifyTextForMatching(line);
  if (!lower) {
    return true;
  }

  return (
    /(?:^|\s)\d{1,3}%/.test(lower) ||
    lower.includes("bedetider") ||
    lower.includes("kobenhavn") ||
    lower.includes("imam ali moske") ||
    /^jul\s*\d{4}$/.test(lower)
  );
}

function cleanTimeCandidate(value = "") {
  return String(value)
    .trim()
    .replace(/[oO]/g, "0")
    .replace(/[,;]+$/g, "")
    .replace(/[.,]/g, ":")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s+/g, "");
}

export function normalizeLooseTime(value = "") {
  const cleaned = cleanTimeCandidate(value);
  if (!cleaned) {
    return "";
  }

  const directMatch = cleaned.match(/^(\d{1,2}):(\d{2})$/);
  if (directMatch) {
    const hours = Number(directMatch[1]);
    const minutes = Number(directMatch[2]);
    const normalized = `${pad(hours)}:${pad(minutes)}`;
    return isStrictTime(normalized) ? normalized : "";
  }

  const compactMatch = cleaned.match(/^(\d{3,4})$/);
  if (compactMatch) {
    const rawDigits = compactMatch[1].padStart(4, "0");
    const normalized = `${rawDigits.slice(0, 2)}:${rawDigits.slice(2)}`;
    return isStrictTime(normalized) ? normalized : "";
  }

  return "";
}

function buildDateKey(year, month, day) {
  if (!isRealCalendarDate(year, month, day)) {
    return "";
  }

  return `${year}-${pad(month)}-${pad(day)}`;
}

function extractDayNumber(line, firstTimeIndex) {
  const relevantSlice = line.slice(0, firstTimeIndex >= 0 ? firstTimeIndex : line.length);
  const scrubbed = DANISH_WEEKDAYS.reduce(
    (value, weekday) => value.replace(new RegExp(weekday, "gi"), " "),
    relevantSlice,
  );
  const matches = [...scrubbed.matchAll(/\b([0-3]?\d)\b/g)];
  if (matches.length === 0) {
    return null;
  }

  const day = Number(matches[matches.length - 1][1]);
  return day >= 1 && day <= 31 ? day : null;
}

function extractTimeTokens(line) {
  return [...line.matchAll(/\b[0-2]?\d\s*[:.]\s*\d{2}\b/g)]
    .map((match) => normalizeLooseTime(match[0]))
    .filter(Boolean);
}

function shouldRecordSkippedLine(line, timeTokens) {
  if (looksLikeHeader(line) || looksLikeNoiseLine(line)) {
    return false;
  }

  return containsDanishWeekday(line) || (/\d/.test(line) && timeTokens.length >= 4);
}

function getSkippedLineReason(hasWeekday, dayNumber, timeTokens) {
  if (!hasWeekday) {
    return "Could not detect a Danish weekday on this line.";
  }

  if (!dayNumber) {
    return "Could not detect a usable day number on this line.";
  }

  if (timeTokens.length < 5) {
    return "Could not detect enough prayer-time values on this line.";
  }

  return "This line needs manual review before it can be parsed.";
}

export function cleanupTimetableText(rawText = "") {
  return String(rawText ?? "")
    .split(/\r?\n/)
    .map((line) => normalizeTextLine(line))
    .filter((line) => line && !looksLikeHeader(line) && !looksLikeNoiseLine(line))
    .join("\n");
}

export function createEmptyImportedPrayerRow(overrides = {}) {
  return {
    date: "",
    hijriDateArabic: "",
    hijriDateLatin: "",
    fajr: "",
    sunrise: "",
    dhuhr: "",
    asr: "",
    sunset: "",
    maghrib: "",
    isha: "",
    midnight: "",
    sourceLine: "",
    sourceLineNumber: 0,
    fieldErrors: {},
    errors: [],
    statusText: "Klar til gennemgang / جاهز للمراجعة",
    ...overrides,
  };
}

function normalizeImportedRow(row = {}, options = {}) {
  const preserveRawValues = options.preserveRawValues === true;
  const normalizeTimeValue = (value) => {
    const stringValue = String(value ?? "").trim();
    return preserveRawValues ? stringValue : normalizeLooseTime(stringValue);
  };

  const normalized = createEmptyImportedPrayerRow({
    date: String(row.date ?? "").trim(),
    hijriDateArabic: String(row.hijriDateArabic ?? "").trim(),
    hijriDateLatin: String(row.hijriDateLatin ?? "").trim(),
    fajr: normalizeTimeValue(row.fajr),
    sunrise: normalizeTimeValue(row.sunrise),
    dhuhr: normalizeTimeValue(row.dhuhr),
    asr: normalizeTimeValue(row.asr),
    sunset: normalizeTimeValue(row.sunset),
    maghrib: normalizeTimeValue(row.maghrib),
    isha: normalizeTimeValue(row.isha),
    midnight: normalizeTimeValue(row.midnight),
    sourceLine: String(row.sourceLine ?? "").trim(),
    sourceLineNumber: Number(row.sourceLineNumber ?? 0) || 0,
    fieldErrors: typeof row.fieldErrors === "object" && row.fieldErrors !== null ? row.fieldErrors : {},
  });

  return normalized;
}

function getRowErrors(row) {
  const errors = [];
  const fieldErrors = {};
  const requiredFields = ["date", "fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"];
  const optionalTimeFields = ["asr", "isha"];

  function addFieldError(field, message) {
    errors.push(message);
    if (!fieldErrors[field]) {
      fieldErrors[field] = [];
    }
    fieldErrors[field].push(message);
  }

  if (!isDateKey(row.date)) {
    addFieldError("date", "Date must use YYYY-MM-DD.");
  } else {
    const [year, month, day] = row.date.split("-").map(Number);
    if (!isRealCalendarDate(year, month, day)) {
      addFieldError("date", "Date is not a real calendar date.");
    }
  }

  requiredFields
    .filter((field) => field !== "date")
    .forEach((field) => {
      if (!isStrictTime(row[field])) {
        addFieldError(field, `${field} must use HH:mm.`);
      }
    });

  optionalTimeFields.forEach((field) => {
    if (row[field] && !isStrictTime(row[field])) {
      addFieldError(field, `${field} must use HH:mm or stay empty.`);
    }
  });

  return {
    errors,
    fieldErrors,
  };
}

export function validateImportedPrayerRows(rows = [], options = {}) {
  const normalizedRows = Array.isArray(rows) ? rows.map((row) => normalizeImportedRow(row, options)) : [];
  const duplicateMap = new Map();

  normalizedRows.forEach((row) => {
    if (row.date) {
      duplicateMap.set(row.date, (duplicateMap.get(row.date) ?? 0) + 1);
    }
  });

  const decoratedRows = normalizedRows.map((row) => {
    const { errors, fieldErrors } = getRowErrors(row);
    if (row.date && duplicateMap.get(row.date) > 1) {
      if (!fieldErrors.date) {
        fieldErrors.date = [];
      }
      fieldErrors.date.push("Date is duplicated in the preview.");
      errors.push("Date is duplicated in the preview.");
    }

    return {
      ...row,
      fieldErrors,
      errors,
      statusText: errors.length > 0
        ? errors.join(" ")
        : "Ready to save / Klar til at gemme / جاهز للحفظ",
    };
  });

  const errorCount = decoratedRows.reduce((total, row) => total + row.errors.length, 0);

  return {
    rows: decoratedRows,
    valid: decoratedRows.length > 0 && errorCount === 0,
    errorCount,
  };
}

export function parseTimetableText(rawText, options = {}) {
  const safeMonth = Number(options.month);
  const safeYear = Number(options.year);
  const lines = String(rawText ?? "").split(/\r?\n/);
  const parsedRows = [];
  const skippedLines = [];

  if (!Number.isInteger(safeMonth) || safeMonth < 1 || safeMonth > 12 || !Number.isInteger(safeYear)) {
    return {
      rows: [],
      skippedLines: [],
      valid: false,
      errorCount: 1,
      message: "Choose a valid month and year before parsing.",
    };
  }

  lines.forEach((rawLine, index) => {
    const normalizedLine = normalizeTextLine(rawLine);
    if (!normalizedLine || looksLikeHeader(normalizedLine) || looksLikeNoiseLine(normalizedLine)) {
      return;
    }

    const firstTimeMatch = normalizedLine.match(/\b[0-2]?\d\s*[:.]\s*\d{2}\b/);
    const firstTimeIndex = firstTimeMatch?.index ?? -1;
    const hasWeekday = containsDanishWeekday(normalizedLine);
    const dayNumber = extractDayNumber(normalizedLine, firstTimeIndex);
    const timeTokens = extractTimeTokens(normalizedLine);

    if (!hasWeekday || timeTokens.length < 5) {
      if (shouldRecordSkippedLine(normalizedLine, timeTokens)) {
        skippedLines.push({
          lineNumber: index + 1,
          rawLine: normalizedLine,
          reason: getSkippedLineReason(hasWeekday, dayNumber, timeTokens),
        });
      }
      return;
    }

    const row = createEmptyImportedPrayerRow({
      date: dayNumber ? buildDateKey(safeYear, safeMonth, dayNumber) : "",
      fajr: timeTokens[0] ?? "",
      sunrise: timeTokens[1] ?? "",
      dhuhr: timeTokens[2] ?? "",
      sunset: timeTokens[3] ?? "",
      maghrib: timeTokens[4] ?? "",
      midnight: timeTokens[5] ?? "",
      sourceLine: normalizedLine,
      sourceLineNumber: index + 1,
    });

    parsedRows.push(row);
  });

  const validation = validateImportedPrayerRows(parsedRows);
  const message = validation.rows.length === 0
    ? "No timetable rows were parsed. Paste or correct the text and try again."
    : `Parsed ${validation.rows.length} rows. Review every value before saving.`;

  return {
    ...validation,
    skippedLines,
    message,
  };
}

export function importedRowsToPrayerEntries(rows = []) {
  return rows.map((row) => ({
    date: row.date,
    hijriDateArabic: row.hijriDateArabic || "",
    hijriDateLatin: row.hijriDateLatin || "",
    fajr: row.fajr || "",
    sunrise: row.sunrise || "",
    dhuhr: row.dhuhr || "",
    asr: row.asr || "",
    sunset: row.sunset || "",
    maghrib: row.maghrib || "",
    isha: row.isha || "",
    midnight: row.midnight || "",
  }));
}

export function summarizeImportedRows(rows = []) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      count: 0,
      firstDate: "—",
      lastDate: "—",
    };
  }

  const ordered = rows
    .filter((row) => isDateKey(row.date))
    .sort((left, right) => left.date.localeCompare(right.date));
  return {
    count: rows.length,
    firstDate: ordered[0]?.date ?? "—",
    lastDate: ordered[ordered.length - 1]?.date ?? "—",
  };
}
