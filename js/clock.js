function getLocaleDateFormatter(locale, options = {}) {
  return new Intl.DateTimeFormat(locale, options);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

export function toDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatCurrentTime(date = new Date()) {
  return getLocaleDateFormatter("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatGregorianDate(date = new Date()) {
  return {
    arabic: getLocaleDateFormatter("ar-EG-u-ca-gregory", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
    danish: getLocaleDateFormatter("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
  };
}

export function formatShortBadgeDate(dateInput) {
  const date = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : dateInput;
  const day = getLocaleDateFormatter("en-GB", { day: "2-digit" }).format(date);
  const month = getLocaleDateFormatter("en-GB", { month: "short" }).format(date).replace(".", "");
  return { day, month };
}

export function formatWeekdayLabel(dateInput) {
  const date = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : dateInput;
  return {
    arabic: getLocaleDateFormatter("ar-EG", { weekday: "long" }).format(date),
    danish: getLocaleDateFormatter("da-DK", { weekday: "long" }).format(date),
  };
}

export function formatEventDateText(dateInput) {
  const date = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : dateInput;
  return {
    arabic: getLocaleDateFormatter("ar-EG-u-ca-gregory", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
    danish: getLocaleDateFormatter("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
  };
}

export function startClock(tick) {
  tick(new Date());
  return window.setInterval(() => tick(new Date()), 1000);
}
