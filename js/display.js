import { APP_CONFIG } from "./config.js";
import { eventMatchesDisplayTheme, getEventThemeMeta, loadEvents, getUpcomingEvent } from "./events.js";
import {
  formatCurrentTime,
  formatEventDateText,
  formatGregorianDate,
  formatShortBadgeDate,
  formatWeekdayLabel,
  startClock,
} from "./clock.js";
import {
  getCountdownPayload,
  getDisplayPrayerKeys,
  getLocalDateKey,
  getNextPrayer,
  getPrayerDisplayTime,
  getPrayerMetaForMode,
  getTodayPrayerTimes,
  getTomorrowPrayerTimes,
  loadPrayerTimes,
} from "./prayer-times.js";
import { getThemeFromStorage } from "./storage.js";

const PRAYER_ICONS = {
  moon: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M28 7a15 15 0 1 0 13 22.5A16.5 16.5 0 0 1 28 7Z"></path>
      <path d="m33 14 1.6 3.4L38 19l-3.4 1.6L33 24l-1.6-3.4L28 19l3.4-1.6Z"></path>
    </svg>
  `,
  sunrise: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M11 30a13 13 0 0 1 26 0"></path>
      <path d="M8 36h32"></path>
      <path d="M24 10v7"></path>
      <path d="m14 19 3 3"></path>
      <path d="m34 19-3 3"></path>
      <path d="M12 41h6"></path>
      <path d="M22 41h4"></path>
      <path d="M30 41h6"></path>
    </svg>
  `,
  sun: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="8"></circle>
      <path d="M24 7v5"></path>
      <path d="M24 36v5"></path>
      <path d="M7 24h5"></path>
      <path d="M36 24h5"></path>
      <path d="m12 12 3.5 3.5"></path>
      <path d="m32.5 32.5 3.5 3.5"></path>
      <path d="m12 36 3.5-3.5"></path>
      <path d="m32.5 15.5 3.5-3.5"></path>
    </svg>
  `,
  asr: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 30a14 14 0 0 1 28 0"></path>
      <path d="M8 36h32"></path>
      <path d="M24 10v8"></path>
      <path d="M14 19h4"></path>
      <path d="M30 19h4"></path>
      <path d="m18 14 2.5 2.5"></path>
      <path d="m27.5 16.5 2.5-2.5"></path>
    </svg>
  `,
  sunset: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M11 30a13 13 0 0 1 26 0"></path>
      <path d="M8 36h32"></path>
      <path d="M24 17v12"></path>
      <path d="m18.5 24 5.5 5.5L29.5 24"></path>
      <path d="M11 14h4"></path>
      <path d="M33 14h4"></path>
      <path d="M24 9v3"></path>
    </svg>
  `,
  night: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M29 8a16 16 0 1 0 11 27 17 17 0 0 1-11-27Z"></path>
      <path d="m18 14 1.2 2.5L22 17.8l-2.8 1.3L18 21.6l-1.2-2.5L14 17.8l2.8-1.3Z"></path>
      <path d="m33 18 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"></path>
    </svg>
  `,
  midnight: `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="12"></circle>
      <path d="M24 16v8l5 3"></path>
      <path d="M24 8v3"></path>
      <path d="M24 37v3"></path>
      <path d="M8 24h3"></path>
      <path d="M37 24h3"></path>
    </svg>
  `,
};

const FALLBACK_HIJRI = {
  arabic: "التاريخ الهجري قيد التحديث",
  danish: "Hijri-dato opdateres",
};

const DEFAULT_EVENT_META = {
  titleArabic: "—",
  titleDanish: "—",
  descriptionArabic: "—",
  descriptionDanish: "—",
  locationArabic: "—",
  locationDanish: "—",
};

const elements = {
  body: document.body,
  featureBanner: document.querySelector("#feature-banner"),
  themeLogo: document.querySelector("#theme-logo"),
  logoFallback: document.querySelector("#logo-fallback"),
  bannerContextAr: document.querySelector("#banner-context-ar"),
  bannerContextDa: document.querySelector("#banner-context-da"),
  headlineDay: document.querySelector("#headline-day"),
  headlineMonth: document.querySelector("#headline-month"),
  headlineTitleAr: document.querySelector("#headline-title-ar"),
  headlineTitleDa: document.querySelector("#headline-title-da"),
  headlineDescriptionAr: document.querySelector("#headline-description-ar"),
  headlineDescriptionDa: document.querySelector("#headline-description-da"),
  headlineTagAr: document.querySelector("#headline-tag-ar"),
  headlineTagDa: document.querySelector("#headline-tag-da"),
  headlineMetaAr: document.querySelector("#headline-meta-ar"),
  headlineMetaDa: document.querySelector("#headline-meta-da"),
  noticeTitleAr: document.querySelector("#notice-title-ar"),
  noticeTitleDa: document.querySelector("#notice-title-da"),
  noticeBodyAr: document.querySelector("#notice-body-ar"),
  noticeBodyDa: document.querySelector("#notice-body-da"),
  clockTime: document.querySelector("#clock-time"),
  gregorianAr: document.querySelector("#gregorian-ar"),
  gregorianDa: document.querySelector("#gregorian-da"),
  hijriAr: document.querySelector("#hijri-ar"),
  hijriDa: document.querySelector("#hijri-da"),
  themePill: document.querySelector("#theme-pill"),
  nextPrayerIcon: document.querySelector("#next-prayer-icon"),
  nextPrayerNameAr: document.querySelector("#next-prayer-name-ar"),
  nextPrayerNameDa: document.querySelector("#next-prayer-name-da"),
  countdownMain: document.querySelector("#countdown-main"),
  countdownAr: document.querySelector("#countdown-ar"),
  countdownDa: document.querySelector("#countdown-da"),
  prayerStatus: document.querySelector("#prayer-status"),
  prayerStatusAr: document.querySelector("#prayer-status-ar"),
  prayerStatusDa: document.querySelector("#prayer-status-da"),
  prayerList: document.querySelector("#prayer-list"),
  dataSourceIndicator: document.querySelector("#data-source-indicator"),
  eventPanel: document.querySelector(".event-panel"),
  eventThemeLabel: document.querySelector("#event-theme-label"),
  eventDay: document.querySelector("#event-day"),
  eventMonth: document.querySelector("#event-month"),
  eventHijriShort: document.querySelector("#event-hijri-short"),
  eventMedia: document.querySelector("#event-media"),
  eventImage: document.querySelector("#event-image"),
  eventImageFallback: document.querySelector("#event-image-fallback"),
  eventImageSymbol: document.querySelector("#event-image-symbol"),
  eventImageLabelAr: document.querySelector("#event-image-label-ar"),
  eventImageLabelDa: document.querySelector("#event-image-label-da"),
  eventTitleAr: document.querySelector("#event-title-ar"),
  eventTitleDa: document.querySelector("#event-title-da"),
  eventDescriptionAr: document.querySelector("#event-description-ar"),
  eventDescriptionDa: document.querySelector("#event-description-da"),
  eventTimeItem: document.querySelector("#event-time-item"),
  eventTimeAr: document.querySelector("#event-time-ar"),
  eventTimeDa: document.querySelector("#event-time-da"),
  eventLocationItem: document.querySelector("#event-location-item"),
  eventLocationAr: document.querySelector("#event-location-ar"),
  eventLocationDa: document.querySelector("#event-location-da"),
  footerAr: document.querySelector("#footer-ar"),
  footerDa: document.querySelector("#footer-da"),
};

const state = {
  theme: APP_CONFIG.defaultTheme,
  prayerMode: APP_CONFIG.prayerDisplayMode,
  prayerItems: [],
  prayerSource: "inline-sample",
  eventItems: [],
  currentDateKey: "",
  todayEntry: null,
  tomorrowEntry: null,
  featureEvent: null,
  upcomingEvent: null,
  midnightReloadTimer: 0,
  dataRefreshTimer: 0,
};

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setIcon(container, iconName) {
  if (container) {
    container.innerHTML = PRAYER_ICONS[iconName] ?? PRAYER_ICONS.sun;
  }
}

function applyTheme(theme) {
  state.theme = APP_CONFIG.themes[theme] ? theme : APP_CONFIG.defaultTheme;
  elements.body.dataset.theme = state.theme;
  elements.featureBanner.classList.toggle("friday-banner", state.theme === "teal");
  elements.featureBanner.classList.toggle("muharram-banner", state.theme === "muharram");
  setText(elements.themePill, APP_CONFIG.themes[state.theme].label);
  updateFooter();
  updateLogo();
  renderNoticeCard();
}

function updateLogo() {
  const logoPath = APP_CONFIG.themes[state.theme].logo;
  elements.themeLogo.src = logoPath;
  elements.themeLogo.hidden = false;
  elements.logoFallback.hidden = true;
  elements.themeLogo.onerror = () => {
    elements.themeLogo.hidden = true;
    elements.logoFallback.hidden = false;
  };
}

function updateFooter() {
  const footerCopy = APP_CONFIG.footerMessages[state.theme];
  setText(elements.footerAr, footerCopy.arabic);
  setText(elements.footerDa, footerCopy.danish);
}

function getThemeFeatureEvent(events, theme, now) {
  const themedEvents = events.filter((event) => event.active && eventMatchesDisplayTheme(event, theme));
  return getUpcomingEvent(themedEvents, now) ?? getUpcomingEvent(events, now);
}

function renderNoticeCard() {
  const noticeCopy = APP_CONFIG.noticeMessages[state.theme];
  setText(elements.noticeTitleAr, noticeCopy.titleArabic);
  setText(elements.noticeTitleDa, noticeCopy.titleDanish);
  setText(elements.noticeBodyAr, noticeCopy.bodyArabic);
  setText(elements.noticeBodyDa, noticeCopy.bodyDanish);
}

function renderHeadline(event) {
  const fallback = APP_CONFIG.headlineFallbacks[state.theme];
  const context = APP_CONFIG.bannerContexts[state.theme];
  const badge = event ? formatShortBadgeDate(event.date) : formatShortBadgeDate(new Date());
  setText(elements.headlineDay, badge.day);
  setText(elements.headlineMonth, badge.month);
  setText(elements.bannerContextAr, context.arabic);
  setText(elements.bannerContextDa, context.danish);

  setText(elements.headlineTitleAr, event?.titleArabic || fallback.titleArabic);
  setText(elements.headlineTitleDa, event?.titleDanish || fallback.titleDanish);
  setText(elements.headlineDescriptionAr, event?.descriptionArabic || fallback.descriptionArabic);
  setText(elements.headlineDescriptionDa, event?.descriptionDanish || fallback.descriptionDanish);
  setText(elements.headlineTagAr, context.tagArabic ?? fallback.tagArabic);
  setText(elements.headlineTagDa, context.tagDanish ?? fallback.tagDanish);

  if (event) {
    const weekday = formatWeekdayLabel(event.date);
    setText(elements.headlineMetaAr, `${weekday.arabic} - ${event.time}`);
    setText(elements.headlineMetaDa, `${weekday.danish} - ${event.time}`);
    return;
  }

  setText(elements.headlineMetaAr, context.metaArabic);
  setText(elements.headlineMetaDa, context.metaDanish);
}

function renderClock(now) {
  setText(elements.clockTime, formatCurrentTime(now));

  const gregorian = formatGregorianDate(now);
  setText(elements.gregorianAr, gregorian.arabic);
  setText(elements.gregorianDa, gregorian.danish);

  setText(elements.hijriAr, state.todayEntry?.hijriDateArabic || FALLBACK_HIJRI.arabic);
  setText(elements.hijriDa, state.todayEntry?.hijriDateLatin || FALLBACK_HIJRI.danish);
}

function renderPrayerStatus(nextPrayer) {
  if (!elements.prayerStatus) {
    return;
  }

  if (!state.todayEntry) {
    setText(elements.prayerStatusAr, APP_CONFIG.prayerMessages.missingTodayDetail.arabic);
    setText(elements.prayerStatusDa, APP_CONFIG.prayerMessages.missingTodayDetail.danish);
    elements.prayerStatus.hidden = true;
    return;
  }

  if (nextPrayer?.status === "day-completed" && !state.tomorrowEntry) {
    setText(elements.prayerStatusAr, APP_CONFIG.prayerMessages.dayCompleted.arabic);
    setText(elements.prayerStatusDa, APP_CONFIG.prayerMessages.dayCompleted.danish);
    elements.prayerStatus.hidden = true;
    return;
  }

  elements.prayerStatus.hidden = true;
}

function renderPrayerList(nextPrayer) {
  const nextPrayerKey = nextPrayer?.key ?? null;

  const rows = getDisplayPrayerKeys(state.prayerMode).map((key) => {
    const meta = getPrayerMetaForMode(key, state.prayerMode);
    const isNext = nextPrayerKey === key && nextPrayer?.status !== "missing-today";

    return `
      <li class="prayer-card${isNext ? " is-next" : ""}">
        <div class="prayer-icon" aria-hidden="true">${PRAYER_ICONS[meta.icon] ?? ""}</div>
        <div class="prayer-item-copy">
          <p class="prayer-name-ar arabic">${meta.arabic}</p>
          <p class="prayer-name-da latin">${meta.danish}</p>
        </div>
        <p class="prayer-time time-text">${getPrayerDisplayTime(state.todayEntry, key)}</p>
      </li>
    `;
  }).join("");

  elements.prayerList.innerHTML = rows;
}

function setNextPrayerFallback(primaryArabic, primaryDanish) {
  setIcon(elements.nextPrayerIcon, "sun");
  setText(elements.nextPrayerNameAr, primaryArabic);
  setText(elements.nextPrayerNameDa, primaryDanish);
  setText(elements.countdownMain, "--:--:--");
  setText(elements.countdownAr, APP_CONFIG.prayerMessages.countdownUnavailable.arabic);
  setText(elements.countdownDa, APP_CONFIG.prayerMessages.countdownUnavailable.danish);
}

function renderNextPrayer(now) {
  const nextPrayer = getNextPrayer(state.todayEntry, now, state.tomorrowEntry, state.prayerMode);

  if (nextPrayer.status === "missing-today") {
    setNextPrayerFallback(
      APP_CONFIG.prayerMessages.missingToday.arabic,
      APP_CONFIG.prayerMessages.missingToday.danish,
    );
    renderPrayerStatus(nextPrayer);
    renderPrayerList(nextPrayer);
    return nextPrayer;
  }

  if (nextPrayer.status === "day-completed") {
    setNextPrayerFallback(
      APP_CONFIG.prayerMessages.dayCompleted.arabic,
      APP_CONFIG.prayerMessages.dayCompleted.danish,
    );
    renderPrayerStatus(nextPrayer);
    renderPrayerList(nextPrayer);
    return nextPrayer;
  }

  setIcon(elements.nextPrayerIcon, nextPrayer.label.icon);
  setText(elements.nextPrayerNameAr, nextPrayer.label.arabic);
  setText(elements.nextPrayerNameDa, nextPrayer.label.danish);

  const countdown = getCountdownPayload(nextPrayer.at, now);
  setText(elements.countdownMain, countdown.main);
  setText(elements.countdownAr, countdown.arabic);
  setText(elements.countdownDa, countdown.danish);

  renderPrayerStatus(nextPrayer);
  renderPrayerList(nextPrayer);
  return nextPrayer;
}

function renderEventMedia(eventThemeKey, imageDataUrl = "") {
  const themeMeta = getEventThemeMeta(eventThemeKey);
  elements.eventMedia.dataset.eventCategory = themeMeta.key;
  setText(elements.eventImageSymbol, themeMeta.symbol);
  setText(elements.eventImageLabelAr, themeMeta.placeholderArabic);
  setText(elements.eventImageLabelDa, themeMeta.placeholderDanish);

  if (imageDataUrl) {
    elements.eventImage.src = imageDataUrl;
    elements.eventImage.hidden = false;
    elements.eventImageFallback.hidden = true;
    elements.eventImage.onerror = () => {
      elements.eventImage.hidden = true;
      elements.eventImageFallback.hidden = false;
    };
    return;
  }

  elements.eventImage.hidden = true;
  elements.eventImage.removeAttribute("src");
  elements.eventImageFallback.hidden = false;
}

function renderEvent(event) {
  elements.eventPanel?.classList.toggle("is-empty", !event);
  elements.eventThemeLabel.hidden = false;

  if (!event) {
    const fallbackTheme = state.theme === "muharram" ? "muharram" : "normal";
    const themeMeta = getEventThemeMeta(fallbackTheme);
    setText(elements.eventThemeLabel, themeMeta.label);
    setText(elements.eventDay, "--");
    setText(elements.eventMonth, "---");
    setText(elements.eventHijriShort, "");
    renderEventMedia(themeMeta.key);
    setText(elements.eventTitleAr, APP_CONFIG.eventMessages.noneUpcoming.arabic);
    setText(elements.eventTitleDa, APP_CONFIG.eventMessages.noneUpcoming.danish);
    setText(elements.eventDescriptionAr, "");
    setText(elements.eventDescriptionDa, "");
    setText(elements.eventTimeAr, "");
    setText(elements.eventTimeDa, "");
    setText(elements.eventLocationAr, "");
    setText(elements.eventLocationDa, "");
    elements.eventDescriptionAr.hidden = true;
    elements.eventDescriptionDa.hidden = true;
    elements.eventTimeItem.hidden = true;
    elements.eventLocationItem.hidden = true;
    elements.eventPanel.classList.remove("has-description");
    elements.eventDescriptionAr.title = "";
    elements.eventDescriptionDa.title = "";
    return;
  }

  const badge = formatShortBadgeDate(event.date);
  const weekday = formatWeekdayLabel(event.date);
  const eventDateText = formatEventDateText(event.date);
  const themeMeta = getEventThemeMeta(event.theme);
  const hasDescription = Boolean(event.descriptionArabic || event.descriptionDanish);
  const hasLocation = Boolean(event.locationArabic || event.locationDanish);

  renderEventMedia(themeMeta.key, event.imageDataUrl);
  setText(elements.eventThemeLabel, themeMeta.label);
  setText(elements.eventDay, badge.day);
  setText(elements.eventMonth, badge.month);
  setText(elements.eventHijriShort, weekday.arabic);
  setText(elements.eventTitleAr, event.titleArabic || DEFAULT_EVENT_META.titleArabic);
  setText(elements.eventTitleDa, event.titleDanish || DEFAULT_EVENT_META.titleDanish);
  setText(elements.eventDescriptionAr, event.descriptionArabic || "");
  setText(elements.eventDescriptionDa, event.descriptionDanish || "");
  setText(elements.eventTimeAr, `\u0627\u0644\u0633\u0627\u0639\u0629 ${event.time}`);
  setText(elements.eventTimeDa, `Kl. ${event.time}`);
  setText(elements.eventLocationAr, event.locationArabic || "");
  setText(elements.eventLocationDa, event.locationDanish || "");
  elements.eventDescriptionAr.hidden = !hasDescription;
  elements.eventDescriptionDa.hidden = !hasDescription;
  elements.eventTimeItem.hidden = false;
  elements.eventLocationItem.hidden = !hasLocation;
  elements.eventPanel.classList.toggle("has-description", hasDescription);

  elements.eventDescriptionAr.title = eventDateText.arabic;
  elements.eventDescriptionDa.title = eventDateText.danish;
}

function renderSourceBadge() {
  const labels = {
    "supabase-function": "Supabase",
    localStorage: "Local data",
    "sample-file": "Sample JSON",
    "inline-sample": "Inline sample",
  };

  setText(elements.dataSourceIndicator, labels[state.prayerSource] ?? "Sample");
  elements.dataSourceIndicator.hidden = false;
}

function scheduleMidnightReload(now = new Date()) {
  if (state.midnightReloadTimer) {
    window.clearTimeout(state.midnightReloadTimer);
  }

  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 3, 0);
  const delay = Math.max(1000, nextMidnight.getTime() - now.getTime());
  state.midnightReloadTimer = window.setTimeout(() => {
    window.location.reload();
  }, delay);
}

function syncDayState(now) {
  state.currentDateKey = getLocalDateKey(now);
  state.todayEntry = getTodayPrayerTimes(state.prayerItems, now);
  state.tomorrowEntry = getTomorrowPrayerTimes(state.prayerItems, now);
  state.featureEvent = getThemeFeatureEvent(state.eventItems, state.theme, now);

  const generalUpcomingEvent = getUpcomingEvent(state.eventItems, now);
  state.upcomingEvent = state.theme === "muharram"
    ? state.featureEvent ?? generalUpcomingEvent
    : generalUpcomingEvent;

  renderHeadline(state.featureEvent);
  renderEvent(state.upcomingEvent);
  scheduleMidnightReload(now);
}

async function refreshDisplayData(now = new Date()) {
  const [prayerPayload, eventPayload] = await Promise.all([loadPrayerTimes(), loadEvents()]);
  state.prayerItems = prayerPayload.items;
  state.prayerSource = prayerPayload.source;
  state.eventItems = eventPayload.items;
  renderSourceBadge();
  syncDayState(now);
}

async function initDisplay() {
  applyTheme(getThemeFromStorage());

  const now = new Date();
  await refreshDisplayData(now);
  renderClock(now);
  renderNextPrayer(now);

  state.dataRefreshTimer = window.setInterval(() => {
    void refreshDisplayData(new Date());
  }, 60_000);

  startClock((tickDate) => {
    const nextDateKey = getLocalDateKey(tickDate);
    if (nextDateKey !== state.currentDateKey) {
      window.location.reload();
      return;
    }

    renderClock(tickDate);
    renderNextPrayer(tickDate);
  });
}

initDisplay();
