(() => {
  // js/config.js
  var APP_CONFIG = {
    timezone: "Europe/Copenhagen",
    defaultTheme: "teal",
    prayerDisplayMode: "imamAliCopenhagen",
    themes: {
      teal: {
        label: "Teal",
        labelArabic: "\u0627\u0644\u0641\u064A\u0631\u0648\u0632\u064A",
        logo: "assets/logo-teal.png"
      },
      muharram: {
        label: "Muharram",
        labelArabic: "\u0645\u062D\u0631\u0645",
        logo: "assets/logo-red.png"
      }
    },
    eventCategories: {
      normal: {
        label: "Normal",
        labelArabic: "\u0639\u0627\u062F\u064A",
        labelDanish: "Normal",
        placeholderArabic: "\u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0633\u062C\u062F",
        placeholderDanish: "Mosk\xE9-arrangement",
        symbol: "N",
        displayThemes: ["teal"]
      },
      muharram: {
        label: "Muharram",
        labelArabic: "\u0645\u062D\u0631\u0645",
        labelDanish: "Muharram",
        placeholderArabic: "\u0641\u0639\u0627\u0644\u064A\u0629 \u0645\u062D\u0631\u0645",
        placeholderDanish: "Muharram-arrangement",
        symbol: "M",
        displayThemes: ["muharram"]
      },
      ramadan: {
        label: "Ramadan",
        labelArabic: "\u0631\u0645\u0636\u0627\u0646",
        labelDanish: "Ramadan",
        placeholderArabic: "\u0628\u0631\u0646\u0627\u0645\u062C \u0631\u0645\u0636\u0627\u0646",
        placeholderDanish: "Ramadan-program",
        symbol: "R",
        displayThemes: ["teal"]
      },
      eid: {
        label: "Eid",
        labelArabic: "\u0639\u064A\u062F",
        labelDanish: "Eid",
        placeholderArabic: "\u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0639\u064A\u062F",
        placeholderDanish: "Eid-arrangement",
        symbol: "E",
        displayThemes: ["teal"]
      },
      majlis: {
        label: "Majlis",
        labelArabic: "\u0645\u062C\u0644\u0633",
        labelDanish: "Majlis",
        placeholderArabic: "\u0645\u062C\u0644\u0633",
        placeholderDanish: "Majlis",
        symbol: "J",
        displayThemes: ["teal", "muharram"]
      },
      friday: {
        label: "Friday prayer",
        labelArabic: "\u0627\u0644\u062C\u0645\u0639\u0629",
        labelDanish: "Fredagsb\xF8n",
        placeholderArabic: "\u0635\u0644\u0627\u0629 \u0627\u0644\u062C\u0645\u0639\u0629",
        placeholderDanish: "Fredagsb\xF8n",
        symbol: "F",
        displayThemes: ["teal"]
      }
    },
    storageKeys: {
      prayerTimes: "imamAliDisplay.prayerTimes",
      events: "imamAliDisplay.events",
      theme: "imamAliDisplay.theme"
    },
    prayerFields: ["fajr", "sunrise", "dhuhr", "asr", "sunset", "maghrib", "isha", "midnight"],
    prayerDisplayModes: {
      standard: {
        order: ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"],
        countdownOrder: ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"],
        labels: {
          fajr: { arabic: "\u0627\u0644\u0641\u062C\u0631", danish: "Fajr" },
          sunrise: { arabic: "\u0627\u0644\u0634\u0631\u0648\u0642", danish: "Solopgang" },
          dhuhr: { arabic: "\u0627\u0644\u0638\u0647\u0631", danish: "Middag" },
          asr: { arabic: "\u0627\u0644\u0639\u0635\u0631", danish: "Eftermiddag" },
          maghrib: { arabic: "\u0627\u0644\u0645\u063A\u0631\u0628", danish: "Maghrib" },
          isha: { arabic: "\u0627\u0644\u0639\u0634\u0627\u0621", danish: "Nat" }
        }
      },
      imamAliCopenhagen: {
        order: ["fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"],
        countdownOrder: ["fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"],
        labels: {
          fajr: { arabic: "\u0627\u0644\u0635\u0628\u062D", danish: "Subh" },
          sunrise: { arabic: "\u0627\u0644\u0634\u0631\u0648\u0642", danish: "Solopgang" },
          dhuhr: { arabic: "\u0627\u0644\u0638\u0647\u0631", danish: "Dhuhr" },
          sunset: { arabic: "\u0627\u0644\u063A\u0631\u0648\u0628", danish: "Solnedgang" },
          maghrib: { arabic: "\u0627\u0644\u0645\u063A\u0631\u0628", danish: "Maghrib" },
          midnight: { arabic: "\u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", danish: "Midnat" }
        }
      }
    },
    prayerMeta: {
      fajr: { icon: "moon" },
      sunrise: { icon: "sunrise" },
      dhuhr: { icon: "sun" },
      asr: { icon: "asr" },
      sunset: { icon: "sunset" },
      maghrib: { icon: "sunset" },
      isha: { icon: "night" },
      midnight: { icon: "midnight" }
    },
    samplePaths: {
      prayerTimes: "data/prayer-times.sample.json",
      events: "data/events.sample.json"
    },
    apiPaths: {
      publicSupabaseConfig: "/.netlify/functions/public-supabase-config",
      authGetProfile: "/.netlify/functions/auth-get-profile",
      adminListUsers: "/.netlify/functions/admin-list-users",
      adminCreateUser: "/.netlify/functions/admin-create-user",
      adminUpdateUserRole: "/.netlify/functions/admin-update-user-role",
      adminDisableUser: "/.netlify/functions/admin-disable-user",
      adminDeleteUser: "/.netlify/functions/admin-delete-user",
      todayPrayerTimes: "/.netlify/functions/get-today-prayer-times",
      upcomingEvent: "/.netlify/functions/get-upcoming-event",
      adminPrayerTimes: "/.netlify/functions/get-admin-prayer-times",
      adminEvents: "/.netlify/functions/get-admin-events",
      savePrayerTimes: "/.netlify/functions/save-prayer-times",
      saveEvent: "/.netlify/functions/save-event",
      archiveEvent: "/.netlify/functions/archive-event",
      deleteEvent: "/.netlify/functions/delete-event",
      restoreEvent: "/.netlify/functions/restore-event",
      restorePrayerTimes: "/.netlify/functions/restore-prayer-times",
      permanentlyDeleteEvent: "/.netlify/functions/permanently-delete-event",
      permanentlyDeletePrayerTimes: "/.netlify/functions/permanently-delete-prayer-times"
    },
    syncMessages: {
      connected: "Connected to Supabase. Updates will sync to mosque screens.",
      localOnly: "Saved locally only. This will not update other screens until Supabase is connected.",
      saveError: "Error saving to Supabase. Please check Netlify environment variables.",
      unavailable: "Supabase unavailable. Changes are saved locally only."
    },
    footerMessages: {
      teal: {
        arabic: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643\u0645 - \u0646\u0633\u0639\u062F \u0628\u0632\u064A\u0627\u0631\u062A\u0643\u0645",
        danish: "Alle er velkomne - Vi gl\xE6der os til at se dig"
      },
      muharram: {
        arabic: "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643 \u064A\u0627 \u0623\u0628\u0627 \u0639\u0628\u062F \u0627\u0644\u0644\u0647 \u0627\u0644\u062D\u0633\u064A\u0646",
        danish: "Fred v\xE6re med dig, o Abu Abdullah al-Hussein"
      }
    },
    bannerContexts: {
      teal: {
        arabic: "\u0635\u0644\u0627\u0629 \u0627\u0644\u062C\u0645\u0639\u0629",
        danish: "Fredagsb\xF8n",
        metaArabic: "\u0627\u0644\u062C\u0645\u0639\u0629 - 13:30",
        metaDanish: "Fredag - 13:30",
        tagArabic: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0623\u0633\u0628\u0648\u0639\u064A",
        tagDanish: "Weekly program"
      },
      muharram: {
        arabic: "\u0634\u0647\u0631 \u0645\u062D\u0631\u0645 \u0627\u0644\u062D\u0631\u0627\u0645",
        danish: "Muharram 1448",
        metaArabic: "\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u0645\u062C\u0627\u0644\u0633 \u0648\u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0627\u062A",
        metaDanish: "Majalis og s\xE6rlige begivenheder",
        tagArabic: "\u0645\u062D\u0631\u0645",
        tagDanish: "Muharram"
      }
    },
    headlineFallbacks: {
      teal: {
        titleArabic: "\u0635\u0644\u0627\u0629 \u0627\u0644\u062C\u0645\u0639\u0629",
        titleDanish: "Fredagsb\xF8n (Jumu'ah)",
        descriptionArabic: "\u062C\u062F\u0648\u0644 \u0627\u0644\u064A\u0648\u0645 \u0645\u0639\u0631\u0648\u0636 \u0645\u0628\u0627\u0634\u0631\u0629 \u0645\u0646 \u0634\u0627\u0634\u0629 \u0627\u0644\u0645\u0633\u062C\u062F",
        descriptionDanish: "Dagens skema vises direkte p\xE5 mosk\xE9ens sk\xE6rm",
        tagArabic: "\u0627\u0644\u0628\u0631\u0646\u0627\u0645\u062C \u0627\u0644\u064A\u0648\u0645\u064A",
        tagDanish: "Dagsprogram"
      },
      muharram: {
        titleArabic: "\u0634\u0647\u0631 \u0645\u062D\u0631\u0645 \u0627\u0644\u062D\u0631\u0627\u0645",
        titleDanish: "Muharram al-Haram",
        descriptionArabic: "\u0646\u0633\u062E\u0629 \u0645\u062D\u0631\u0645 \u0627\u0644\u0645\u0647\u064A\u0623\u0629 \u0644\u0644\u0645\u062C\u0627\u0644\u0633 \u0648\u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0627\u0644\u062E\u0627\u0635\u0629",
        descriptionDanish: "Muharram-version klargjort til majalis og s\xE6rlige arrangementer",
        tagArabic: "\u0645\u062D\u0631\u0645 1448",
        tagDanish: "Muharram 1448"
      }
    },
    noticeMessages: {
      teal: {
        titleArabic: "\u0627\u0628\u0642\u064E \u0639\u0644\u0649 \u0627\u0637\u0644\u0627\u0639",
        titleDanish: "Hold dig opdateret",
        bodyArabic: "\u062A\u0627\u0628\u0639 \u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0627\u0644\u0642\u0627\u062F\u0645\u0629 \u0639\u0644\u0649 \u0645\u0648\u0642\u0639\u0646\u0627 \u0648\u0648\u0633\u0627\u0626\u0644 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A.",
        bodyDanish: "F\xF8lg med i kommende begivenheder p\xE5 vores hjemmeside og sociale medier."
      },
      muharram: {
        titleArabic: "\u0630\u0643\u0631\u0649 \u0645\u062D\u0631\u0645",
        titleDanish: "Muharram p\xE5mindelse",
        bodyArabic: "\u0646\u0633\u062E\u0629 \u0645\u062D\u0631\u0645 \u0645\u0647\u064A\u0623\u0629 \u0644\u0644\u0645\u062C\u0627\u0644\u0633 \u0648\u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0627\u0644\u062E\u0627\u0635\u0629 \u0648\u0625\u062D\u064A\u0627\u0621 \u0627\u0644\u0630\u0643\u0631\u0649.",
        bodyDanish: "Muharram-layoutet er klargjort til majalis og s\xE6rlige mindeh\xF8jtideligheder."
      }
    },
    prayerMessages: {
      missingToday: {
        arabic: "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u064A\u0648\u0645 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631\u0629",
        danish: "Dagens b\xF8nnetider mangler"
      },
      missingTodayDetail: {
        arabic: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0648\u0627\u0642\u064A\u062A \u0645\u062D\u0641\u0648\u0638\u0629 \u0644\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u064A\u0648\u0645.",
        danish: "Der findes ingen gemte b\xF8nnetider for dagens dato."
      },
      dayCompleted: {
        arabic: "\u0627\u0646\u062A\u0647\u062A \u0635\u0644\u0648\u0627\u062A \u0627\u0644\u064A\u0648\u0645",
        danish: "Dagens b\xF8nner er afsluttet"
      },
      countdownUnavailable: {
        arabic: "--\u0633 --\u062F --\u062B",
        danish: "--t --m --s"
      },
      invalidTime: {
        arabic: "\u0648\u0642\u062A \u063A\u064A\u0631 \u0635\u0627\u0644\u062D",
        danish: "Ugyldig tid"
      }
    },
    eventMessages: {
      noneUpcoming: {
        arabic: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0642\u0627\u062F\u0645\u0629 \u062D\u0627\u0644\u064A\u0627\u064B",
        danish: "Der er ingen kommende begivenheder lige nu"
      },
      noneUpcomingDetail: {
        arabic: "\u0633\u064A\u062A\u0645 \u0639\u0631\u0636 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0639\u0646\u062F \u0625\u0636\u0627\u0641\u062A\u0647\u0627 \u0648\u062A\u0641\u0639\u064A\u0644\u0647\u0627.",
        danish: "Den n\xE6ste begivenhed vises her, n\xE5r den er tilf\xF8jet og aktiv."
      }
    }
  };
  var SAMPLE_PRAYER_TIMES = [
    {
      date: "2026-06-09",
      hijriDateArabic: "23 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "23 Dhu al-Hijjah 1447 H",
      fajr: "02:29",
      sunrise: "04:28",
      dhuhr: "13:09",
      asr: "17:39",
      sunset: "21:11",
      maghrib: "21:51",
      isha: "23:43",
      midnight: "23:50"
    },
    {
      date: "2026-06-10",
      hijriDateArabic: "24 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "24 Dhu al-Hijjah 1447 H",
      fajr: "02:28",
      sunrise: "04:27",
      dhuhr: "13:09",
      asr: "17:40",
      sunset: "21:12",
      maghrib: "21:52",
      isha: "23:44",
      midnight: "23:51"
    },
    {
      date: "2026-06-11",
      hijriDateArabic: "25 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "25 Dhu al-Hijjah 1447 H",
      fajr: "02:27",
      sunrise: "04:27",
      dhuhr: "13:09",
      asr: "17:40",
      sunset: "21:13",
      maghrib: "21:53",
      isha: "23:45",
      midnight: "23:52"
    },
    {
      date: "2026-06-12",
      hijriDateArabic: "26 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "26 Dhu al-Hijjah 1447 H",
      fajr: "02:26",
      sunrise: "04:26",
      dhuhr: "13:10",
      asr: "17:41",
      sunset: "21:14",
      maghrib: "21:54",
      isha: "23:46",
      midnight: "23:53"
    },
    {
      date: "2026-06-13",
      hijriDateArabic: "27 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "27 Dhu al-Hijjah 1447 H",
      fajr: "02:25",
      sunrise: "04:26",
      dhuhr: "13:10",
      asr: "17:41",
      sunset: "21:15",
      maghrib: "21:55",
      isha: "23:47",
      midnight: "23:54"
    },
    {
      date: "2026-06-14",
      hijriDateArabic: "28 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "28 Dhu al-Hijjah 1447 H",
      fajr: "02:24",
      sunrise: "04:26",
      dhuhr: "13:10",
      asr: "17:42",
      sunset: "21:16",
      maghrib: "21:56",
      isha: "23:48",
      midnight: "23:55"
    },
    {
      date: "2026-06-15",
      hijriDateArabic: "29 \u0630\u0648 \u0627\u0644\u062D\u062C\u0629 1447 \u0647\u0640",
      hijriDateLatin: "29 Dhu al-Hijjah 1447 H",
      fajr: "02:24",
      sunrise: "04:26",
      dhuhr: "13:10",
      asr: "17:42",
      sunset: "21:17",
      maghrib: "21:57",
      isha: "23:48",
      midnight: "23:56"
    },
    {
      date: "2026-07-01",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:44",
      sunrise: "04:30",
      dhuhr: "13:14",
      asr: "",
      sunset: "21:56",
      maghrib: "22:37",
      isha: "",
      midnight: "23:50"
    },
    {
      date: "2026-07-02",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:44",
      sunrise: "04:31",
      dhuhr: "13:14",
      asr: "",
      sunset: "21:56",
      maghrib: "22:36",
      isha: "",
      midnight: "23:50"
    },
    {
      date: "2026-07-03",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:44",
      sunrise: "04:32",
      dhuhr: "13:14",
      asr: "",
      sunset: "21:55",
      maghrib: "22:35",
      isha: "",
      midnight: "23:50"
    },
    {
      date: "2026-07-04",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:44",
      sunrise: "04:33",
      dhuhr: "13:14",
      asr: "",
      sunset: "21:55",
      maghrib: "22:35",
      isha: "",
      midnight: "23:50"
    },
    {
      date: "2026-07-05",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:44",
      sunrise: "04:34",
      dhuhr: "13:14",
      asr: "",
      sunset: "21:54",
      maghrib: "22:34",
      isha: "",
      midnight: "23:49"
    },
    {
      date: "2026-07-06",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:45",
      sunrise: "04:35",
      dhuhr: "13:14",
      asr: "",
      sunset: "21:53",
      maghrib: "22:33",
      isha: "",
      midnight: "23:49"
    },
    {
      date: "2026-07-07",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:45",
      sunrise: "04:36",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:52",
      maghrib: "22:32",
      isha: "",
      midnight: "23:49"
    },
    {
      date: "2026-07-08",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:45",
      sunrise: "04:37",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:52",
      maghrib: "22:31",
      isha: "",
      midnight: "23:48"
    },
    {
      date: "2026-07-09",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:45",
      sunrise: "04:39",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:51",
      maghrib: "22:30",
      isha: "",
      midnight: "23:48"
    },
    {
      date: "2026-07-10",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:45",
      sunrise: "04:40",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:50",
      maghrib: "22:28",
      isha: "",
      midnight: "23:48"
    },
    {
      date: "2026-07-11",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:45",
      sunrise: "04:41",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:49",
      maghrib: "22:27",
      isha: "",
      midnight: "23:47"
    },
    {
      date: "2026-07-12",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:42",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:48",
      maghrib: "22:26",
      isha: "",
      midnight: "23:47"
    },
    {
      date: "2026-07-13",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:44",
      dhuhr: "13:15",
      asr: "",
      sunset: "21:46",
      maghrib: "22:24",
      isha: "",
      midnight: "23:46"
    },
    {
      date: "2026-07-14",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:45",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:45",
      maghrib: "22:23",
      isha: "",
      midnight: "23:46"
    },
    {
      date: "2026-07-15",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:47",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:44",
      maghrib: "22:21",
      isha: "",
      midnight: "23:45"
    },
    {
      date: "2026-07-16",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:48",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:43",
      maghrib: "22:20",
      isha: "",
      midnight: "23:44"
    },
    {
      date: "2026-07-17",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:50",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:41",
      maghrib: "22:18",
      isha: "",
      midnight: "23:44"
    },
    {
      date: "2026-07-18",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:51",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:40",
      maghrib: "22:16",
      isha: "",
      midnight: "23:43"
    },
    {
      date: "2026-07-19",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:53",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:38",
      maghrib: "22:15",
      isha: "",
      midnight: "23:42"
    },
    {
      date: "2026-07-20",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:54",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:37",
      maghrib: "22:13",
      isha: "",
      midnight: "23:42"
    },
    {
      date: "2026-07-21",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:56",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:35",
      maghrib: "22:11",
      isha: "",
      midnight: "23:41"
    },
    {
      date: "2026-07-22",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:58",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:34",
      maghrib: "22:09",
      isha: "",
      midnight: "23:40"
    },
    {
      date: "2026-07-23",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "04:59",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:32",
      maghrib: "22:07",
      isha: "",
      midnight: "23:39"
    },
    {
      date: "2026-07-24",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:01",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:31",
      maghrib: "22:06",
      isha: "",
      midnight: "23:39"
    },
    {
      date: "2026-07-25",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:03",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:29",
      maghrib: "22:04",
      isha: "",
      midnight: "23:38"
    },
    {
      date: "2026-07-26",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:04",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:27",
      maghrib: "22:02",
      isha: "",
      midnight: "23:37"
    },
    {
      date: "2026-07-27",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:06",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:25",
      maghrib: "21:59",
      isha: "",
      midnight: "23:36"
    },
    {
      date: "2026-07-28",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:08",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:23",
      maghrib: "21:57",
      isha: "",
      midnight: "23:35"
    },
    {
      date: "2026-07-29",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:10",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:22",
      maghrib: "21:55",
      isha: "",
      midnight: "23:34"
    },
    {
      date: "2026-07-30",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:47",
      sunrise: "05:11",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:20",
      maghrib: "21:53",
      isha: "",
      midnight: "23:33"
    },
    {
      date: "2026-07-31",
      hijriDateArabic: "",
      hijriDateLatin: "",
      fajr: "01:46",
      sunrise: "05:13",
      dhuhr: "13:16",
      asr: "",
      sunset: "21:18",
      maghrib: "21:51",
      isha: "",
      midnight: "23:32"
    }
  ];
  var SAMPLE_EVENTS = [
    {
      id: "event-001",
      titleArabic: "\u0635\u0644\u0627\u0629 \u0627\u0644\u062C\u0645\u0639\u0629",
      titleDanish: "Fredagsb\xF8n (Jumu'ah)",
      date: "2026-06-12",
      time: "13:30",
      locationArabic: "\u0627\u0644\u062C\u0627\u0645\u0639 \u0627\u0644\u0631\u0626\u064A\u0633\u064A",
      locationDanish: "Hovedmoskeen",
      descriptionArabic: "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643\u0645 - \u0646\u0633\u0639\u062F \u0628\u0632\u064A\u0627\u0631\u062A\u0643\u0645",
      descriptionDanish: "Alle er velkomne - Vi gl\xE6der os til at se dig",
      theme: "friday",
      active: true
    },
    {
      id: "event-002",
      titleArabic: "\u0645\u062C\u0644\u0633 \u0627\u0644\u0644\u064A\u0644\u0629 \u0627\u0644\u0623\u0648\u0644\u0649 \u0645\u0646 \u0645\u062D\u0631\u0645",
      titleDanish: "Majlis \u2013 f\xF8rste aften af Muharram",
      date: "2026-06-13",
      time: "19:30",
      locationArabic: "\u0627\u0644\u062C\u0627\u0645\u0639 \u0627\u0644\u0631\u0626\u064A\u0633\u064A",
      locationDanish: "Hovedmoskeen",
      descriptionArabic: "\u0630\u0643\u0631\u0649 \u0627\u0633\u062A\u0634\u0647\u0627\u062F \u0627\u0644\u0625\u0645\u0627\u0645 \u0627\u0644\u062D\u0633\u064A\u0646 \u0639\u0644\u064A\u0647 \u0627\u0644\u0633\u0644\u0627\u0645",
      descriptionDanish: "Mindeh\xF8jtidelighed for Imam Hussein",
      theme: "muharram",
      active: true
    }
  ];

  // js/remote-data.js
  var remoteAuthTokenProvider = null;
  function canUseRemoteFunctions() {
    return typeof window !== "undefined" && window.location.protocol !== "file:" && typeof fetch === "function";
  }
  function buildJsonHeaders(headers = {}) {
    return {
      Accept: "application/json",
      ...headers
    };
  }
  function buildQueryString(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== void 0 && value !== null && value !== "") {
        searchParams.set(key, String(value));
      }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : "";
  }
  function setRemoteAuthTokenProvider(provider) {
    remoteAuthTokenProvider = typeof provider === "function" ? provider : null;
  }
  async function requestJson(url, options = {}) {
    if (!canUseRemoteFunctions()) {
      return {
        ok: false,
        skipped: true,
        status: 0,
        data: null,
        error: "Remote functions are unavailable in direct file-open mode."
      };
    }
    const headers = buildJsonHeaders(options.headers);
    if (remoteAuthTokenProvider) {
      const token = await remoteAuthTokenProvider();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    const requestOptions = {
      cache: "no-store",
      ...options,
      headers
    };
    if (options.body && typeof options.body !== "string") {
      requestOptions.body = JSON.stringify(options.body);
      requestOptions.headers = buildJsonHeaders({
        "Content-Type": "application/json",
        ...headers
      });
    }
    try {
      const response = await fetch(url, requestOptions);
      let data = null;
      try {
        data = await response.json();
      } catch (error) {
        data = null;
      }
      return {
        ok: response.ok,
        skipped: false,
        status: response.status,
        data,
        error: response.ok ? "" : String(data?.error ?? data?.details ?? `HTTP ${response.status}`)
      };
    } catch (error) {
      return {
        ok: false,
        skipped: false,
        status: 0,
        data: null,
        error: error.message
      };
    }
  }
  function getRemoteFailureMessage(result, fallbackMessage = APP_CONFIG.syncMessages.unavailable) {
    if (result?.skipped) {
      return APP_CONFIG.syncMessages.localOnly;
    }
    if (result?.status === 401) {
      return "Your admin session is missing or has expired. Please log in again.";
    }
    if (result?.status === 403) {
      return "You do not have permission to perform this action.";
    }
    if (result?.status === 503) {
      return APP_CONFIG.syncMessages.saveError;
    }
    if (result?.error) {
      return `${fallbackMessage} ${result.error}`.trim();
    }
    return fallbackMessage;
  }
  async function loadPublicSupabaseConfig() {
    return requestJson(APP_CONFIG.apiPaths.publicSupabaseConfig);
  }
  async function loadAuthProfile() {
    return requestJson(APP_CONFIG.apiPaths.authGetProfile);
  }
  async function loadUpcomingEventFromRemote() {
    return requestJson(APP_CONFIG.apiPaths.upcomingEvent);
  }
  async function loadAdminPrayerTimesFromRemote(options = {}) {
    const query = buildQueryString({
      archived: options.archived ?? false
    });
    return requestJson(`${APP_CONFIG.apiPaths.adminPrayerTimes}${query}`);
  }
  async function loadAdminEventsFromRemote(options = {}) {
    const query = buildQueryString({
      archived: options.archived ?? false
    });
    return requestJson(`${APP_CONFIG.apiPaths.adminEvents}${query}`);
  }
  async function savePrayerTimesRemotely(items) {
    return requestJson(APP_CONFIG.apiPaths.savePrayerTimes, {
      method: "POST",
      body: { items }
    });
  }
  async function saveEventRemotely(event) {
    return requestJson(APP_CONFIG.apiPaths.saveEvent, {
      method: "POST",
      body: event
    });
  }
  async function archiveEventRemotely(eventId) {
    return requestJson(APP_CONFIG.apiPaths.archiveEvent, {
      method: "POST",
      body: { id: eventId }
    });
  }
  async function restoreEventRemotely(eventId) {
    return requestJson(APP_CONFIG.apiPaths.restoreEvent, {
      method: "POST",
      body: { id: eventId }
    });
  }
  async function restorePrayerTimesRemotely(payload) {
    return requestJson(APP_CONFIG.apiPaths.restorePrayerTimes, {
      method: "POST",
      body: payload
    });
  }
  async function permanentlyDeleteEventRemotely(eventId) {
    return requestJson(APP_CONFIG.apiPaths.permanentlyDeleteEvent, {
      method: "POST",
      body: { id: eventId, confirm: true }
    });
  }
  async function permanentlyDeletePrayerTimesRemotely(payload) {
    return requestJson(APP_CONFIG.apiPaths.permanentlyDeletePrayerTimes, {
      method: "POST",
      body: { ...payload, confirm: true }
    });
  }
  async function loadAdminUsersFromRemote() {
    return requestJson(APP_CONFIG.apiPaths.adminListUsers);
  }
  async function createAdminUserRemotely(payload) {
    return requestJson(APP_CONFIG.apiPaths.adminCreateUser, {
      method: "POST",
      body: payload
    });
  }
  async function updateAdminUserRoleRemotely(payload) {
    return requestJson(APP_CONFIG.apiPaths.adminUpdateUserRole, {
      method: "POST",
      body: payload
    });
  }
  async function disableAdminUserRemotely(userId) {
    return requestJson(APP_CONFIG.apiPaths.adminDisableUser, {
      method: "POST",
      body: { id: userId }
    });
  }
  async function deleteAdminUserRemotely(userId, options = {}) {
    return requestJson(APP_CONFIG.apiPaths.adminDeleteUser, {
      method: "POST",
      body: {
        id: userId,
        permanent: options.permanent === true
      }
    });
  }
  async function checkSupabaseConnection() {
    const result = await loadUpcomingEventFromRemote();
    if (result.ok) {
      return {
        connected: true,
        message: APP_CONFIG.syncMessages.connected,
        detail: "Supabase"
      };
    }
    return {
      connected: false,
      message: result.status === 503 ? APP_CONFIG.syncMessages.saveError : APP_CONFIG.syncMessages.unavailable,
      detail: result.skipped ? "localStorage fallback" : "localStorage fallback",
      error: result.error
    };
  }

  // js/storage.js
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
  function getPrayerTimesFromStorage() {
    return readJson(APP_CONFIG.storageKeys.prayerTimes);
  }
  function savePrayerTimesToStorage(value) {
    return writeJson(APP_CONFIG.storageKeys.prayerTimes, value);
  }
  function getEventsFromStorage() {
    return readJson(APP_CONFIG.storageKeys.events);
  }
  function saveEventsToStorage(value) {
    return writeJson(APP_CONFIG.storageKeys.events, value);
  }
  function getThemeFromStorage() {
    const storedTheme = readJson(APP_CONFIG.storageKeys.theme);
    return APP_CONFIG.themes[storedTheme] ? storedTheme : APP_CONFIG.defaultTheme;
  }
  function saveThemeToStorage(theme) {
    const safeTheme = APP_CONFIG.themes[theme] ? theme : APP_CONFIG.defaultTheme;
    return writeJson(APP_CONFIG.storageKeys.theme, safeTheme);
  }
  function clearStoredDisplayData() {
    if (!isStorageAvailable()) {
      return false;
    }
    clearStoredPrayerTimes();
    clearStoredEvents();
    clearStoredTheme();
    return true;
  }
  function hasLocalStorageSupport() {
    return isStorageAvailable();
  }
  function clearStoredPrayerTimes() {
    if (!isStorageAvailable()) {
      return false;
    }
    window.localStorage.removeItem(APP_CONFIG.storageKeys.prayerTimes);
    return true;
  }
  function clearStoredEvents() {
    if (!isStorageAvailable()) {
      return false;
    }
    window.localStorage.removeItem(APP_CONFIG.storageKeys.events);
    return true;
  }
  function clearStoredTheme() {
    if (!isStorageAvailable()) {
      return false;
    }
    window.localStorage.removeItem(APP_CONFIG.storageKeys.theme);
    return true;
  }

  // js/events.js
  var DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  var TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
  var IMAGE_DATA_URL_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;
  var FALLBACK_EVENT_CATEGORIES = {
    normal: {
      label: "Normal",
      labelArabic: "\u0639\u0627\u062F\u064A",
      labelDanish: "Normal",
      placeholderArabic: "\u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0633\u062C\u062F",
      placeholderDanish: "Mosk\xE9-arrangement",
      symbol: "N",
      displayThemes: ["teal"]
    },
    muharram: {
      label: "Muharram",
      labelArabic: "\u0645\u062D\u0631\u0645",
      labelDanish: "Muharram",
      placeholderArabic: "\u0641\u0639\u0627\u0644\u064A\u0629 \u0645\u062D\u0631\u0645",
      placeholderDanish: "Muharram-arrangement",
      symbol: "M",
      displayThemes: ["muharram"]
    },
    ramadan: {
      label: "Ramadan",
      labelArabic: "\u0631\u0645\u0636\u0627\u0646",
      labelDanish: "Ramadan",
      placeholderArabic: "\u0628\u0631\u0646\u0627\u0645\u062C \u0631\u0645\u0636\u0627\u0646",
      placeholderDanish: "Ramadan-program",
      symbol: "R",
      displayThemes: ["teal"]
    },
    eid: {
      label: "Eid",
      labelArabic: "\u0639\u064A\u062F",
      labelDanish: "Eid",
      placeholderArabic: "\u0641\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0639\u064A\u062F",
      placeholderDanish: "Eid-arrangement",
      symbol: "E",
      displayThemes: ["teal"]
    },
    majlis: {
      label: "Majlis",
      labelArabic: "\u0645\u062C\u0644\u0633",
      labelDanish: "Majlis",
      placeholderArabic: "\u0645\u062C\u0644\u0633",
      placeholderDanish: "Majlis",
      symbol: "J",
      displayThemes: ["teal", "muharram"]
    },
    friday: {
      label: "Friday prayer",
      labelArabic: "\u0627\u0644\u062C\u0645\u0639\u0629",
      labelDanish: "Fredagsb\xF8n",
      placeholderArabic: "\u0635\u0644\u0627\u0629 \u0627\u0644\u062C\u0645\u0639\u0629",
      placeholderDanish: "Fredagsb\xF8n",
      symbol: "F",
      displayThemes: ["teal"]
    }
  };
  var LEGACY_THEME_MAP = {
    teal: "normal",
    muharram: "muharram"
  };
  function getEventCategories() {
    return APP_CONFIG.eventCategories ?? FALLBACK_EVENT_CATEGORIES;
  }
  function isValidDateKey(value) {
    return DATE_KEY_PATTERN.test(String(value ?? "").trim());
  }
  function isValidTimeString(value) {
    return TIME_PATTERN.test(String(value ?? "").trim());
  }
  function isRealCalendarDate(dateKey) {
    if (!isValidDateKey(dateKey)) {
      return false;
    }
    const [year, month, day] = dateKey.split("-").map(Number);
    const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
  }
  function normalizeString(value) {
    return String(value ?? "").trim();
  }
  function normalizeIsoTimestamp(value) {
    const normalized = normalizeString(value);
    if (!normalized) {
      return "";
    }
    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString();
  }
  function normalizeImageDataUrl(value) {
    const normalized = normalizeString(value);
    return IMAGE_DATA_URL_PATTERN.test(normalized) ? normalized : "";
  }
  function getSafeThemeKey(theme) {
    const normalized = normalizeString(theme).toLowerCase();
    const mapped = LEGACY_THEME_MAP[normalized] ?? normalized;
    return getEventCategories()[mapped] ? mapped : "normal";
  }
  function normalizeActiveValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "false") {
        return false;
      }
      if (normalized === "true") {
        return true;
      }
    }
    if (typeof value === "number") {
      return value !== 0;
    }
    return value == null ? true : Boolean(value);
  }
  function normalizeArchivedValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
    }
    if (typeof value === "number") {
      return value !== 0;
    }
    return false;
  }
  function createEventId() {
    const randomPart = Math.random().toString(36).slice(2, 8);
    return `event-${Date.now().toString(36)}-${randomPart}`;
  }
  function sortEventsByDateTime(events = []) {
    return [...events].sort((left, right) => {
      const leftDate = getEventDateTime(left).getTime();
      const rightDate = getEventDateTime(right).getTime();
      return leftDate - rightDate;
    });
  }
  function normalizeEventEntry(event = {}, index = 0) {
    return {
      id: normalizeString(event.id) || `event-${index + 1}`,
      titleArabic: normalizeString(event.titleArabic),
      titleDanish: normalizeString(event.titleDanish),
      date: normalizeString(event.date),
      time: normalizeString(event.time),
      locationArabic: normalizeString(event.locationArabic),
      locationDanish: normalizeString(event.locationDanish),
      descriptionArabic: normalizeString(event.descriptionArabic),
      descriptionDanish: normalizeString(event.descriptionDanish),
      imageDataUrl: normalizeImageDataUrl(event.imageDataUrl),
      theme: getSafeThemeKey(event.theme),
      active: normalizeActiveValue(event.active),
      archived: normalizeArchivedValue(event.archived),
      createdAt: normalizeIsoTimestamp(event.createdAt),
      updatedAt: normalizeIsoTimestamp(event.updatedAt)
    };
  }
  function sanitizeEventEntry(event = {}, index = 0) {
    const normalized = normalizeEventEntry(event, index);
    if (!isValidDateKey(normalized.date) || !isRealCalendarDate(normalized.date)) {
      return null;
    }
    if (!isValidTimeString(normalized.time)) {
      return null;
    }
    return normalized;
  }
  function sanitizeEventsArray(input, options = {}) {
    if (!Array.isArray(input)) {
      return [];
    }
    const includeArchived = options.includeArchived === true;
    const byId = /* @__PURE__ */ new Map();
    input.forEach((event, index) => {
      const sanitized = sanitizeEventEntry(event, index);
      if (sanitized && (includeArchived || !sanitized.archived)) {
        byId.set(sanitized.id, sanitized);
      }
    });
    return sortEventsByDateTime([...byId.values()]);
  }
  function buildStoredEvent(eventData = {}, existingEvent = null) {
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const requestedId = normalizeString(eventData.id);
    return {
      id: existingEvent?.id || requestedId || createEventId(),
      titleArabic: normalizeString(eventData.titleArabic),
      titleDanish: normalizeString(eventData.titleDanish),
      date: normalizeString(eventData.date),
      time: normalizeString(eventData.time),
      locationArabic: normalizeString(eventData.locationArabic),
      locationDanish: normalizeString(eventData.locationDanish),
      descriptionArabic: normalizeString(eventData.descriptionArabic),
      descriptionDanish: normalizeString(eventData.descriptionDanish),
      imageDataUrl: normalizeImageDataUrl(eventData.imageDataUrl || existingEvent?.imageDataUrl),
      theme: getSafeThemeKey(eventData.theme || existingEvent?.theme),
      active: typeof eventData.active === "boolean" ? eventData.active : normalizeActiveValue(existingEvent?.active),
      archived: typeof eventData.archived === "boolean" ? eventData.archived : normalizeArchivedValue(existingEvent?.archived),
      createdAt: existingEvent?.createdAt || normalizeIsoTimestamp(eventData.createdAt) || nowIso,
      updatedAt: nowIso
    };
  }
  function withSavedEvents(items) {
    return {
      ok: saveEvents(items),
      items
    };
  }
  function getEventThemeMeta(theme) {
    const safeTheme = getSafeThemeKey(theme);
    return {
      key: safeTheme,
      ...getEventCategories()[safeTheme]
    };
  }
  function getEventDateTime(event) {
    const safeDate = normalizeString(event?.date);
    const safeTime = normalizeString(event?.time);
    if (!isValidDateKey(safeDate) || !isValidTimeString(safeTime)) {
      return /* @__PURE__ */ new Date(0);
    }
    const [year, month, day] = safeDate.split("-").map(Number);
    const [hours, minutes] = safeTime.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  }
  function validateEventsArray(input) {
    if (!Array.isArray(input)) {
      return {
        valid: false,
        errors: ["Events must be an array of event objects."],
        normalized: []
      };
    }
    const errors = [];
    const normalized = input.map((event, index) => normalizeEventEntry(event, index));
    const duplicateIds = /* @__PURE__ */ new Map();
    normalized.forEach((event) => {
      if (event.id) {
        duplicateIds.set(event.id, (duplicateIds.get(event.id) ?? 0) + 1);
      }
    });
    normalized.forEach((event, index) => {
      if (!event.id) {
        errors.push(`Entry ${index + 1}: id is required.`);
      }
      if (!event.titleArabic) {
        errors.push(`Entry ${index + 1}: titleArabic is required.`);
      }
      if (!event.titleDanish) {
        errors.push(`Entry ${index + 1}: titleDanish is required.`);
      }
      if (!isValidDateKey(event.date)) {
        errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
      } else if (!isRealCalendarDate(event.date)) {
        errors.push(`Entry ${index + 1}: date is not a real calendar date.`);
      }
      if (!isValidTimeString(event.time)) {
        errors.push(`Entry ${index + 1}: time must use HH:mm.`);
      }
      if (typeof input[index]?.active !== "boolean") {
        errors.push(`Entry ${index + 1}: active must be boolean.`);
      }
      if (event.imageDataUrl && !IMAGE_DATA_URL_PATTERN.test(event.imageDataUrl)) {
        errors.push(`Entry ${index + 1}: imageDataUrl must be an image data URL when provided.`);
      }
      if (event.id && duplicateIds.get(event.id) > 1) {
        errors.push(`Entry ${index + 1}: duplicate id ${event.id}.`);
      }
    });
    return {
      valid: errors.length === 0,
      errors,
      normalized: sortEventsByDateTime(normalized)
    };
  }
  function getSavedEvents(options = {}) {
    return sanitizeEventsArray(getEventsFromStorage(), options);
  }
  function saveEvents(events) {
    return saveEventsToStorage(sortEventsByDateTime(sanitizeEventsArray(events, { includeArchived: true })));
  }
  function createEvent(eventData, baseEvents = getSavedEvents({ includeArchived: true })) {
    const items = sortEventsByDateTime([
      ...sanitizeEventsArray(baseEvents, { includeArchived: true }),
      sanitizeEventEntry(buildStoredEvent(eventData), 0)
    ].filter(Boolean));
    return withSavedEvents(items);
  }
  function updateEvent(eventId, eventData, baseEvents = getSavedEvents({ includeArchived: true })) {
    const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).map((event) => event.id === eventId ? sanitizeEventEntry(buildStoredEvent(eventData, event), 0) : event).filter(Boolean);
    return withSavedEvents(sortEventsByDateTime(items));
  }
  function deleteEvent(eventId, baseEvents = getSavedEvents({ includeArchived: true })) {
    const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).filter((event) => event.id !== eventId);
    return withSavedEvents(items);
  }
  function duplicateEvent(eventId, baseEvents = getSavedEvents({ includeArchived: true })) {
    const items = sanitizeEventsArray(baseEvents, { includeArchived: true });
    const original = items.find((event) => event.id === eventId);
    if (!original) {
      return { ok: false, items };
    }
    const copy = sanitizeEventEntry(buildStoredEvent({
      ...original,
      id: createEventId(),
      titleArabic: `${original.titleArabic} - \u0646\u0633\u062E\u0629`,
      titleDanish: `${original.titleDanish} (copy)`,
      createdAt: "",
      updatedAt: ""
    }), 0);
    return withSavedEvents(sortEventsByDateTime([...items, copy].filter(Boolean)));
  }
  function toggleEventActive(eventId, baseEvents = getSavedEvents({ includeArchived: true })) {
    const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).map((event) => event.id === eventId ? sanitizeEventEntry(buildStoredEvent({ ...event, active: !event.active }, event), 0) : event).filter(Boolean);
    return withSavedEvents(sortEventsByDateTime(items));
  }
  function setEventArchived(eventId, archived, baseEvents = getSavedEvents({ includeArchived: true })) {
    const items = sanitizeEventsArray(baseEvents, { includeArchived: true }).map((event) => event.id === eventId ? sanitizeEventEntry(buildStoredEvent({ ...event, archived }, event), 0) : event).filter(Boolean);
    return withSavedEvents(sortEventsByDateTime(items));
  }

  // js/import-prayer-image.js
  var DATE_KEY_PATTERN2 = /^\d{4}-\d{2}-\d{2}$/;
  var STRICT_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
  var HEADER_TOKENS = ["ugedag", "date", "subh", "solopgang", "dhuhr", "solnedgang", "maghrib", "midnat"];
  var DANISH_WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "l\xF8rdag", "s\xF8ndag", "lordag", "sondag"];
  var IMPORT_MONTH_OPTIONS = [
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
    { value: 12, label: "December / December" }
  ];
  var SAMPLE_TIMETABLE_TEXT = `Ugedag Date Subh Solopgang Dhuhr Solnedgang Maghrib Midnat
onsdag 1 01:44 04:30 13:14 21:56 22:37 23:50
torsdag 2 01:44 04:31 13:14 21:56 22:36 23:50
fredag 3 01:44 04:32 13:14 21:55 22:35 23:50
l\xF8rdag 4 01:44 04:33 13:14 21:55 22:35 23:50
s\xF8ndag 5 01:44 04:34 13:14 21:54 22:34 23:49
mandag 6 01:45 04:35 13:14 21:53 22:33 23:49
tirsdag 7 01:45 04:36 13:15 21:52 22:32 23:49
onsdag 8 01:45 04:37 13:15 21:52 22:31 23:48
torsdag 9 01:45 04:39 13:15 21:51 22:30 23:48
fredag 10 01:45 04:40 13:15 21:50 22:28 23:48
l\xF8rdag 11 01:45 04:41 13:15 21:49 22:27 23:47
s\xF8ndag 12 01:46 04:42 13:15 21:48 22:26 23:47
mandag 13 01:46 04:44 13:15 21:46 22:24 23:46
tirsdag 14 01:46 04:45 13:16 21:45 22:23 23:46
onsdag 15 01:46 04:47 13:16 21:44 22:21 23:45
torsdag 16 01:46 04:48 13:16 21:43 22:20 23:44
fredag 17 01:46 04:50 13:16 21:41 22:18 23:44
l\xF8rdag 18 01:46 04:51 13:16 21:40 22:16 23:43
s\xF8ndag 19 01:46 04:53 13:16 21:38 22:15 23:42
mandag 20 01:46 04:54 13:16 21:37 22:13 23:42
tirsdag 21 01:46 04:56 13:16 21:35 22:11 23:41
onsdag 22 01:46 04:58 13:16 21:34 22:09 23:40
torsdag 23 01:46 04:59 13:16 21:32 22:07 23:39
fredag 24 01:47 05:01 13:16 21:31 22:06 23:39
l\xF8rdag 25 01:47 05:03 13:16 21:29 22:04 23:38
s\xF8ndag 26 01:47 05:04 13:16 21:27 22:02 23:37
mandag 27 01:47 05:06 13:16 21:25 21:59 23:36
tirsdag 28 01:47 05:08 13:16 21:23 21:57 23:35
onsdag 29 01:47 05:10 13:16 21:22 21:55 23:34
torsdag 30 01:47 05:11 13:16 21:20 21:53 23:33
fredag 31 01:46 05:13 13:16 21:18 21:51 23:32`;
  function pad(value) {
    return String(value).padStart(2, "0");
  }
  function isDateKey(value) {
    return DATE_KEY_PATTERN2.test(String(value ?? "").trim());
  }
  function isStrictTime(value) {
    return STRICT_TIME_PATTERN.test(String(value ?? "").trim());
  }
  function isRealCalendarDate2(year, month, day) {
    const candidate = new Date(year, month - 1, day, 12, 0, 0, 0);
    return candidate.getFullYear() === year && candidate.getMonth() === month - 1 && candidate.getDate() === day;
  }
  function simplifyTextForMatching(value = "") {
    return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function containsDanishWeekday(line = "") {
    const simplified = simplifyTextForMatching(line);
    return DANISH_WEEKDAYS.some((weekday) => simplified.includes(simplifyTextForMatching(weekday)));
  }
  function normalizeTextLine(rawLine = "") {
    return String(rawLine).normalize("NFKC").replace(/\u00A0/g, " ").replace(/\t+/g, " ").replace(/\b(\d{1,2})\s*[.,]\s*(\d{2})\b/g, "$1:$2").replace(/\b(\d{1,2})\s*:\s*(\d{2})\b/g, "$1:$2").replace(/(\d{1,2}:\d{2})[,;]+/g, "$1").replace(/[|]+/g, " ").replace(/\s+/g, " ").trim();
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
    return /(?:^|\s)\d{1,3}%/.test(lower) || lower.includes("bedetider") || lower.includes("kobenhavn") || lower.includes("imam ali moske") || /^jul\s*\d{4}$/.test(lower);
  }
  function cleanTimeCandidate(value = "") {
    return String(value).trim().replace(/[oO]/g, "0").replace(/[,;]+$/g, "").replace(/[.,]/g, ":").replace(/\s*:\s*/g, ":").replace(/\s+/g, "");
  }
  function normalizeLooseTime(value = "") {
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
    if (!isRealCalendarDate2(year, month, day)) {
      return "";
    }
    return `${year}-${pad(month)}-${pad(day)}`;
  }
  function extractDayNumber(line, firstTimeIndex) {
    const relevantSlice = line.slice(0, firstTimeIndex >= 0 ? firstTimeIndex : line.length);
    const scrubbed = DANISH_WEEKDAYS.reduce(
      (value, weekday) => value.replace(new RegExp(weekday, "gi"), " "),
      relevantSlice
    );
    const matches = [...scrubbed.matchAll(/\b([0-3]?\d)\b/g)];
    if (matches.length === 0) {
      return null;
    }
    const day = Number(matches[matches.length - 1][1]);
    return day >= 1 && day <= 31 ? day : null;
  }
  function extractTimeTokens(line) {
    return [...line.matchAll(/\b[0-2]?\d\s*[:.]\s*\d{2}\b/g)].map((match) => normalizeLooseTime(match[0])).filter(Boolean);
  }
  function shouldRecordSkippedLine(line, timeTokens) {
    if (looksLikeHeader(line) || looksLikeNoiseLine(line)) {
      return false;
    }
    return containsDanishWeekday(line) || /\d/.test(line) && timeTokens.length >= 4;
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
  function cleanupTimetableText(rawText = "") {
    return String(rawText ?? "").split(/\r?\n/).map((line) => normalizeTextLine(line)).filter((line) => line && !looksLikeHeader(line) && !looksLikeNoiseLine(line)).join("\n");
  }
  function createEmptyImportedPrayerRow(overrides = {}) {
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
      statusText: "Klar til gennemgang / \u062C\u0627\u0647\u0632 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629",
      ...overrides
    };
  }
  function normalizeImportedRow(row = {}) {
    const normalized = createEmptyImportedPrayerRow({
      date: String(row.date ?? "").trim(),
      hijriDateArabic: String(row.hijriDateArabic ?? "").trim(),
      hijriDateLatin: String(row.hijriDateLatin ?? "").trim(),
      fajr: normalizeLooseTime(row.fajr),
      sunrise: normalizeLooseTime(row.sunrise),
      dhuhr: normalizeLooseTime(row.dhuhr),
      asr: normalizeLooseTime(row.asr),
      sunset: normalizeLooseTime(row.sunset),
      maghrib: normalizeLooseTime(row.maghrib),
      isha: normalizeLooseTime(row.isha),
      midnight: normalizeLooseTime(row.midnight),
      sourceLine: String(row.sourceLine ?? "").trim(),
      sourceLineNumber: Number(row.sourceLineNumber ?? 0) || 0,
      fieldErrors: typeof row.fieldErrors === "object" && row.fieldErrors !== null ? row.fieldErrors : {}
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
      if (!isRealCalendarDate2(year, month, day)) {
        addFieldError("date", "Date is not a real calendar date.");
      }
    }
    requiredFields.filter((field) => field !== "date").forEach((field) => {
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
      fieldErrors
    };
  }
  function validateImportedPrayerRows(rows = []) {
    const normalizedRows = Array.isArray(rows) ? rows.map(normalizeImportedRow) : [];
    const duplicateMap = /* @__PURE__ */ new Map();
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
        statusText: errors.length > 0 ? errors.join(" ") : "Ready to save / Klar til at gemme / \u062C\u0627\u0647\u0632 \u0644\u0644\u062D\u0641\u0638"
      };
    });
    const errorCount = decoratedRows.reduce((total, row) => total + row.errors.length, 0);
    return {
      rows: decoratedRows,
      valid: decoratedRows.length > 0 && errorCount === 0,
      errorCount
    };
  }
  function parseTimetableText(rawText, options = {}) {
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
        message: "Choose a valid month and year before parsing."
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
            reason: getSkippedLineReason(hasWeekday, dayNumber, timeTokens)
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
        sourceLineNumber: index + 1
      });
      parsedRows.push(row);
    });
    const validation = validateImportedPrayerRows(parsedRows);
    const message = validation.rows.length === 0 ? "No timetable rows were parsed. Paste or correct the text and try again." : `Parsed ${validation.rows.length} rows. Review every value before saving.`;
    return {
      ...validation,
      skippedLines,
      message
    };
  }
  function importedRowsToPrayerEntries(rows = []) {
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
      midnight: row.midnight || ""
    }));
  }
  function summarizeImportedRows(rows = []) {
    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        count: 0,
        firstDate: "\u2014",
        lastDate: "\u2014"
      };
    }
    const ordered = rows.filter((row) => isDateKey(row.date)).sort((left, right) => left.date.localeCompare(right.date));
    return {
      count: rows.length,
      firstDate: ordered[0]?.date ?? "\u2014",
      lastDate: ordered[ordered.length - 1]?.date ?? "\u2014"
    };
  }

  // js/prayer-times.js
  var DATE_KEY_PATTERN3 = /^\d{4}-\d{2}-\d{2}$/;
  var TIME_PATTERN2 = /^([01]\d|2[0-3]):([0-5]\d)$/;
  function isValidDateKey2(dateKey) {
    return DATE_KEY_PATTERN3.test(String(dateKey ?? "").trim());
  }
  function isValidTimeString2(timeString) {
    return TIME_PATTERN2.test(String(timeString ?? "").trim());
  }
  function normalizeBoolean(value, fallback = false) {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") {
        return true;
      }
      if (normalized === "false") {
        return false;
      }
    }
    if (typeof value === "number") {
      return value !== 0;
    }
    return fallback;
  }
  function isRealCalendarDate3(dateKey) {
    if (!isValidDateKey2(dateKey)) {
      return false;
    }
    const [year, month, day] = dateKey.split("-").map(Number);
    const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);
    return parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === day;
  }
  function normalizePrayerEntry(entry = {}) {
    const normalized = {
      date: String(entry.date ?? "").trim(),
      hijriDateArabic: String(entry.hijriDateArabic ?? "").trim(),
      hijriDateLatin: String(entry.hijriDateLatin ?? "").trim(),
      archived: normalizeBoolean(entry.archived, false)
    };
    APP_CONFIG.prayerFields.forEach((key) => {
      normalized[key] = String(entry[key] ?? "").trim();
    });
    return normalized;
  }
  function sanitizePrayerEntry(entry) {
    const normalized = normalizePrayerEntry(entry);
    if (!isValidDateKey2(normalized.date) || !isRealCalendarDate3(normalized.date)) {
      return null;
    }
    const sanitized = { ...normalized };
    APP_CONFIG.prayerFields.forEach((key) => {
      sanitized[key] = isValidTimeString2(normalized[key]) ? normalized[key] : "";
    });
    return sanitized;
  }
  function sortPrayerEntries(entries) {
    return [...entries].sort((left, right) => left.date.localeCompare(right.date));
  }
  function sanitizePrayerTimesArray(input, options = {}) {
    if (!Array.isArray(input)) {
      return [];
    }
    const includeArchived = options.includeArchived === true;
    const uniqueEntries = /* @__PURE__ */ new Map();
    input.forEach((entry) => {
      const sanitized = sanitizePrayerEntry(entry);
      if (sanitized && (includeArchived || !sanitized.archived)) {
        uniqueEntries.set(sanitized.date, sanitized);
      }
    });
    return sortPrayerEntries([...uniqueEntries.values()]);
  }
  function validateFlexibleSchema(entry, index, errors, schema) {
    const requiredBaseFields = ["fajr", "sunrise", "dhuhr", "maghrib"];
    requiredBaseFields.forEach((key) => {
      if (!isValidTimeString2(entry[key])) {
        errors.push(`Entry ${index + 1}: ${key} must use HH:mm.`);
      }
    });
    if (schema === "standard") {
      if (!isValidTimeString2(entry.asr)) {
        errors.push(`Entry ${index + 1}: asr must use HH:mm.`);
      }
      if (!isValidTimeString2(entry.isha)) {
        errors.push(`Entry ${index + 1}: isha must use HH:mm.`);
      }
      return;
    }
    if (schema === "imamAliCopenhagen") {
      if (!isValidTimeString2(entry.sunset)) {
        errors.push(`Entry ${index + 1}: sunset must use HH:mm.`);
      }
      if (!isValidTimeString2(entry.midnight)) {
        errors.push(`Entry ${index + 1}: midnight must use HH:mm.`);
      }
      return;
    }
    if (!isValidTimeString2(entry.asr) && !isValidTimeString2(entry.sunset)) {
      errors.push(`Entry ${index + 1}: provide either asr or sunset in HH:mm.`);
    }
    if (!isValidTimeString2(entry.isha) && !isValidTimeString2(entry.midnight)) {
      errors.push(`Entry ${index + 1}: provide either isha or midnight in HH:mm.`);
    }
  }
  function validatePrayerTimesArray(input, options = {}) {
    if (!Array.isArray(input)) {
      return {
        valid: false,
        errors: ["Prayer times must be an array of daily objects."],
        normalized: []
      };
    }
    const schema = options.schema ?? "any";
    const errors = [];
    const normalized = input.map(normalizePrayerEntry);
    const duplicateDates = /* @__PURE__ */ new Map();
    normalized.forEach((entry) => {
      if (entry.date) {
        duplicateDates.set(entry.date, (duplicateDates.get(entry.date) ?? 0) + 1);
      }
    });
    normalized.forEach((entry, index) => {
      if (!isValidDateKey2(entry.date)) {
        errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
      } else if (!isRealCalendarDate3(entry.date)) {
        errors.push(`Entry ${index + 1}: date is not a real calendar date.`);
      }
      APP_CONFIG.prayerFields.forEach((key) => {
        if (entry[key] && !isValidTimeString2(entry[key])) {
          errors.push(`Entry ${index + 1}: ${key} must use HH:mm or stay empty.`);
        }
      });
      validateFlexibleSchema(entry, index, errors, schema);
      if (entry.date && duplicateDates.get(entry.date) > 1) {
        errors.push(`Entry ${index + 1}: duplicate date ${entry.date}.`);
      }
    });
    return {
      valid: errors.length === 0,
      errors,
      normalized
    };
  }
  function getSavedPrayerTimes(options = {}) {
    return sanitizePrayerTimesArray(getPrayerTimesFromStorage(), options);
  }

  // js/supabase-browser.js
  var SUPABASE_CDN_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
  var supabaseLibraryPromise = null;
  var supabaseClientPromise = null;
  function canUseBrowserAuth() {
    return typeof window !== "undefined" && typeof document !== "undefined" && window.location.protocol !== "file:";
  }
  function loadSupabaseLibrary() {
    if (window.supabase?.createClient) {
      return Promise.resolve(window.supabase);
    }
    if (supabaseLibraryPromise) {
      return supabaseLibraryPromise;
    }
    supabaseLibraryPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[data-supabase-browser="true"]');
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.supabase));
        existingScript.addEventListener("error", () => reject(new Error("Could not load Supabase browser library.")));
        return;
      }
      const script = document.createElement("script");
      script.src = SUPABASE_CDN_URL;
      script.async = true;
      script.dataset.supabaseBrowser = "true";
      script.onload = () => {
        if (window.supabase?.createClient) {
          resolve(window.supabase);
          return;
        }
        reject(new Error("Supabase browser library did not initialize correctly."));
      };
      script.onerror = () => reject(new Error("Could not load Supabase browser library."));
      document.head.appendChild(script);
    });
    return supabaseLibraryPromise;
  }
  async function getSupabaseBrowserClient() {
    if (!canUseBrowserAuth()) {
      throw new Error("Supabase login requires http/https or a deployed Netlify site.");
    }
    if (supabaseClientPromise) {
      return supabaseClientPromise;
    }
    supabaseClientPromise = (async () => {
      const [library, configResult] = await Promise.all([
        loadSupabaseLibrary(),
        loadPublicSupabaseConfig()
      ]);
      if (!configResult.ok) {
        if (configResult.status === 404) {
          throw new Error("Supabase admin functions are not available on this site yet.");
        }
        throw new Error(configResult.error || "Supabase public config is unavailable.");
      }
      const supabaseUrl = String(configResult.data?.supabaseUrl ?? "").trim();
      const supabaseAnonKey = String(configResult.data?.supabaseAnonKey ?? "").trim();
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase public config is incomplete.");
      }
      return library.createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    })();
    return supabaseClientPromise;
  }

  // js/admin.js
  var TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
  var MAX_EVENT_IMAGE_BYTES = 2 * 1024 * 1024;
  var ALLOWED_EVENT_IMAGE_TYPES = /* @__PURE__ */ new Set(["image/png", "image/jpeg", "image/webp"]);
  var PREVIEW_FIELDS = [
    { key: "date", label: "Date", shortLabel: "Date", placeholder: "2026-07-03", inputMode: "numeric", columnClass: "preview-col-date" },
    { key: "fajr", label: "Fajr / Subh", shortLabel: "Fajr", placeholder: "01:44", inputMode: "numeric", columnClass: "preview-col-fajr" },
    { key: "sunrise", label: "Sunrise / Solopgang", shortLabel: "Sunrise", placeholder: "04:32", inputMode: "numeric", columnClass: "preview-col-sunrise" },
    { key: "dhuhr", label: "Dhuhr", shortLabel: "Dhuhr", placeholder: "13:14", inputMode: "numeric", columnClass: "preview-col-dhuhr" },
    { key: "asr", label: "Asr (optional)", shortLabel: "Asr", placeholder: "17:39", inputMode: "numeric", columnClass: "preview-col-asr" },
    { key: "sunset", label: "Sunset / Solnedgang", shortLabel: "Sunset", placeholder: "21:55", inputMode: "numeric", columnClass: "preview-col-sunset" },
    { key: "maghrib", label: "Maghrib", shortLabel: "Maghrib", placeholder: "22:35", inputMode: "numeric", columnClass: "preview-col-maghrib" },
    { key: "isha", label: "Isha (optional)", shortLabel: "Isha", placeholder: "23:43", inputMode: "numeric", columnClass: "preview-col-isha" },
    { key: "midnight", label: "Midnight / Midnat", shortLabel: "Midnight", placeholder: "23:50", inputMode: "numeric", columnClass: "preview-col-midnight" }
  ];
  var elements = {
    body: document.body,
    dashboard: document.querySelector("#admin-dashboard"),
    adminThemeBadge: document.querySelector("#admin-theme-badge"),
    dashboardActions: document.querySelector("#admin-dashboard-actions"),
    authSummary: document.querySelector("#admin-auth-summary"),
    authEmail: document.querySelector("#admin-auth-email"),
    authRole: document.querySelector("#admin-auth-role"),
    logoutButton: document.querySelector("#admin-logout-button"),
    authView: document.querySelector("#admin-auth-view"),
    authLoading: document.querySelector("#admin-auth-loading"),
    loginCard: document.querySelector("#admin-login-card"),
    loginForm: document.querySelector("#admin-login-form"),
    loginEmail: document.querySelector("#admin-login-email"),
    loginPassword: document.querySelector("#admin-login-password"),
    loginStatus: document.querySelector("#admin-login-status"),
    accessDeniedCard: document.querySelector("#admin-access-denied-card"),
    accessDeniedMessage: document.querySelector("#admin-access-denied-message"),
    accessDeniedLogout: document.querySelector("#admin-access-denied-logout"),
    generalStatus: document.querySelector("#admin-general-status"),
    adminStatusNote: document.querySelector("#status-panel-note"),
    dangerStatus: document.querySelector("#danger-status"),
    prayerTimesInput: document.querySelector("#prayer-times-input"),
    eventsInput: document.querySelector("#events-input"),
    importTextInput: document.querySelector("#import-text-input"),
    prayerTimesStatus: document.querySelector("#prayer-times-status"),
    eventsStatus: document.querySelector("#events-status"),
    themeStatus: document.querySelector("#theme-status"),
    imageImportStatus: document.querySelector("#image-import-status"),
    parseStatus: document.querySelector("#parse-status"),
    importSaveStatus: document.querySelector("#import-save-status"),
    previewSummary: document.querySelector("#preview-summary"),
    previewErrors: document.querySelector("#preview-errors"),
    statusPrayerCount: document.querySelector("#status-prayer-count"),
    statusPrayerFirstDate: document.querySelector("#status-prayer-first-date"),
    statusPrayerLastDate: document.querySelector("#status-prayer-last-date"),
    statusEventCount: document.querySelector("#status-event-count"),
    statusCurrentTheme: document.querySelector("#status-current-theme"),
    statusDataSource: document.querySelector("#status-data-source"),
    loadSampleData: document.querySelector("#load-sample-data"),
    validatePrayerTimes: document.querySelector("#validate-prayer-times"),
    savePrayerTimes: document.querySelector("#save-prayer-times"),
    validateEvents: document.querySelector("#validate-events"),
    saveEvents: document.querySelector("#save-events"),
    saveTheme: document.querySelector("#save-theme"),
    clearLocalData: document.querySelector("#clear-local-data"),
    clearPrayerTimes: document.querySelector("#clear-prayer-times"),
    clearEvents: document.querySelector("#clear-events"),
    themeInputs: [...document.querySelectorAll('input[name="theme"]')],
    importMonth: document.querySelector("#import-month"),
    importYear: document.querySelector("#import-year"),
    imageInput: document.querySelector("#timetable-image-input"),
    runOcrButton: document.querySelector("#run-ocr-button"),
    useSampleImportText: document.querySelector("#use-sample-import-text"),
    imagePreviewPanel: document.querySelector("#image-preview-panel"),
    imagePreview: document.querySelector("#timetable-image-preview"),
    parseTimetable: document.querySelector("#parse-timetable"),
    previewTableContainer: document.querySelector("#preview-table-container"),
    saveImportedPrayerTimes: document.querySelector("#save-imported-prayer-times"),
    reparsePreview: document.querySelector("#reparse-preview"),
    autoFixImportText: document.querySelector("#autofix-import-text"),
    clearPreview: document.querySelector("#clear-preview"),
    parseSkippedContainer: document.querySelector("#parse-skipped-container"),
    parseSkippedLines: document.querySelector("#parse-skipped-lines"),
    toggleManualEntry: document.querySelector("#toggle-manual-entry"),
    manualJsonSection: document.querySelector("#manual-json-section"),
    eventForm: document.querySelector("#event-form"),
    eventId: document.querySelector("#event-id"),
    eventTitleArabic: document.querySelector("#event-title-arabic"),
    eventTitleDanish: document.querySelector("#event-title-danish"),
    eventDate: document.querySelector("#event-date"),
    eventTime: document.querySelector("#event-time"),
    eventLocationArabic: document.querySelector("#event-location-arabic"),
    eventLocationDanish: document.querySelector("#event-location-danish"),
    eventDescriptionArabic: document.querySelector("#event-description-arabic"),
    eventDescriptionDanish: document.querySelector("#event-description-danish"),
    eventTheme: document.querySelector("#event-theme"),
    eventActive: document.querySelector("#event-active"),
    eventImageInput: document.querySelector("#event-image-input"),
    eventImagePreviewShell: document.querySelector("#event-image-preview-shell"),
    eventImagePreview: document.querySelector("#event-image-preview"),
    eventImagePlaceholderSymbol: document.querySelector("#event-image-placeholder-symbol"),
    eventImagePlaceholderAr: document.querySelector("#event-image-placeholder-ar"),
    eventImagePlaceholderDa: document.querySelector("#event-image-placeholder-da"),
    eventImageStatus: document.querySelector("#event-image-status"),
    eventFormErrors: document.querySelector("#event-form-errors"),
    eventSubmitButton: document.querySelector("#event-submit-button"),
    eventCancelEdit: document.querySelector("#event-cancel-edit"),
    eventFormStatus: document.querySelector("#event-form-status"),
    savedEventsList: document.querySelector("#saved-events-list"),
    eventDataSource: document.querySelector("#event-data-source"),
    toggleEventJsonEntry: document.querySelector("#toggle-event-json-entry"),
    eventJsonSection: document.querySelector("#event-json-section"),
    archivedStatus: document.querySelector("#archived-status"),
    toggleArchivedPrayerTimes: document.querySelector("#toggle-archived-prayer-times"),
    toggleArchivedEvents: document.querySelector("#toggle-archived-events"),
    archivedPrayerTimesSection: document.querySelector("#archived-prayer-times-section"),
    archivedEventsSection: document.querySelector("#archived-events-section"),
    archivedPrayerTimesList: document.querySelector("#archived-prayer-times-list"),
    archivedEventsList: document.querySelector("#archived-events-list"),
    archivedPrayerCount: document.querySelector("#archived-prayer-count"),
    archivedEventCount: document.querySelector("#archived-event-count"),
    superAdminPanel: document.querySelector("#super-admin-panel"),
    adminUserForm: document.querySelector("#admin-user-form"),
    adminUserEmail: document.querySelector("#admin-user-email"),
    adminUserPassword: document.querySelector("#admin-user-password"),
    adminUserRole: document.querySelector("#admin-user-role"),
    refreshAdminUsers: document.querySelector("#refresh-admin-users"),
    adminUsersStatus: document.querySelector("#admin-users-status"),
    adminUsersCount: document.querySelector("#admin-users-count"),
    adminUsersList: document.querySelector("#admin-users-list")
  };
  var state = {
    previewRows: [],
    currentImageFile: null,
    currentImageUrl: "",
    tesseractPromise: null,
    eventImageDataUrl: "",
    editingEventId: "",
    supabaseConnected: false,
    supabaseChecked: false,
    remoteAdminDataLoaded: false,
    remotePrayerTimes: [],
    remoteEvents: [],
    archivedPrayerTimes: [],
    archivedEvents: [],
    dashboardInitialized: false,
    authClient: null,
    authSession: null,
    adminProfile: null,
    adminUsers: [],
    authResolved: false,
    authBusy: false,
    pendingLogoutMessage: "",
    pendingLogoutTone: "success"
  };
  function setText(element, value) {
    if (element) {
      element.textContent = value;
    }
  }
  function setStatus(element, message, tone = "") {
    if (!element) {
      return;
    }
    element.textContent = message;
    element.className = "status-line";
    if (tone) {
      element.classList.add(`is-${tone}`);
    }
  }
  function getRoleLabel(role) {
    return role === "super_admin" ? "Super admin" : "Admin";
  }
  function getRoleLabelArabic(role) {
    return role === "super_admin" ? "\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0623\u0639\u0644\u0649" : "\u0625\u062F\u0627\u0631\u064A";
  }
  function canManageAdminAccounts() {
    return state.adminProfile?.role === "super_admin";
  }
  function getCurrentAccessToken() {
    return state.authSession?.access_token ?? "";
  }
  function syncRemoteAuthProvider() {
    setRemoteAuthTokenProvider(() => getCurrentAccessToken());
  }
  function renderAdminSummaryReset() {
    setText(elements.authEmail, "\u2014");
    setText(elements.authRole, "\u2014");
    elements.body.dataset.adminRole = "";
    elements.superAdminPanel.hidden = true;
    state.adminUsers = [];
    renderAdminUsers();
  }
  function setAuthView(screen) {
    const isDashboard = screen === "dashboard";
    elements.authView.hidden = isDashboard;
    elements.authLoading.hidden = screen !== "loading";
    elements.loginCard.hidden = screen !== "login";
    elements.accessDeniedCard.hidden = screen !== "denied";
    elements.dashboard.hidden = !isDashboard;
    elements.dashboardActions.hidden = !isDashboard;
    elements.authSummary.hidden = !isDashboard;
  }
  function renderAuthSummary() {
    const email = state.adminProfile?.email || state.authSession?.user?.email || "\u2014";
    const role = state.adminProfile?.role || "";
    setText(elements.authEmail, email);
    setText(elements.authRole, role ? `${getRoleLabel(role)} / ${getRoleLabelArabic(role)}` : "\u2014");
    elements.body.dataset.adminRole = role || "";
    elements.superAdminPanel.hidden = !canManageAdminAccounts();
  }
  function showAuthLoading(message = "Verifying Supabase session and admin permissions.") {
    setAuthView("loading");
    const description = elements.authLoading.querySelector(".auth-copy");
    setText(description, message);
  }
  function showLoginScreen(message = "Enter your admin email and password to continue.", tone = "") {
    state.adminProfile = null;
    renderAdminSummaryReset();
    setAuthView("login");
    setStatus(elements.loginStatus, message, tone);
  }
  function showAccessDenied(message) {
    state.adminProfile = null;
    renderAdminSummaryReset();
    setAuthView("denied");
    setText(elements.accessDeniedMessage, message);
  }
  async function ensureAuthClient() {
    if (state.authClient) {
      return state.authClient;
    }
    state.authClient = await getSupabaseBrowserClient();
    return state.authClient;
  }
  function getAuthFailureMessage(result, fallbackMessage) {
    if (result?.status === 401) {
      return "Invalid login or expired session.";
    }
    if (result?.status === 403) {
      return String(result?.data?.error ?? result?.error ?? fallbackMessage);
    }
    return getRemoteFailureMessage(result, fallbackMessage);
  }
  async function handleRemoteAccessFailure(result) {
    if (result?.status !== 401 && result?.status !== 403) {
      return false;
    }
    await signOutAdmin("Your session expired or admin access was removed. Please log in again.", "warning");
    return true;
  }
  async function loadCurrentAdminProfile() {
    const profileResult = await loadAuthProfile();
    if (!profileResult.ok) {
      return profileResult;
    }
    state.adminProfile = profileResult.data?.profile ?? null;
    renderAuthSummary();
    return profileResult;
  }
  async function refreshAdminUsers() {
    if (!canManageAdminAccounts()) {
      state.adminUsers = [];
      renderAdminUsers();
      return null;
    }
    const result = await loadAdminUsersFromRemote();
    if (!result.ok) {
      setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not load admin accounts."), "error");
      renderAdminUsers();
      return result;
    }
    state.adminUsers = Array.isArray(result.data?.items) ? result.data.items : [];
    renderAdminUsers();
    setStatus(elements.adminUsersStatus, "Admin accounts loaded.", "success");
    return result;
  }
  function renderAdminUsers() {
    if (!elements.adminUsersList || !elements.adminUsersCount) {
      return;
    }
    const users = Array.isArray(state.adminUsers) ? state.adminUsers : [];
    setText(elements.adminUsersCount, `${users.length} account${users.length === 1 ? "" : "s"}`);
    if (!canManageAdminAccounts()) {
      elements.adminUsersList.innerHTML = `
      <div class="saved-events-empty">
        Admin account management is available only to super admins.
      </div>
    `;
      return;
    }
    if (users.length === 0) {
      elements.adminUsersList.innerHTML = `
      <div class="saved-events-empty">
        No admin accounts loaded yet.
      </div>
    `;
      return;
    }
    elements.adminUsersList.innerHTML = users.map((user) => {
      const isCurrentUser = user.id === state.adminProfile?.id;
      const activeLabel = user.active ? "Active" : "Disabled";
      return `
      <article class="admin-user-card">
        <div class="admin-user-copy">
          <h4>${escapeHtml(user.email)}</h4>
          <div class="admin-user-badges">
            <span class="saved-event-status ${user.active ? "is-active" : "is-inactive"}">${activeLabel}</span>
            <span>${escapeHtml(getRoleLabel(user.role))}</span>
            ${isCurrentUser ? "<span>You</span>" : ""}
          </div>
          <p class="admin-user-meta">
            Updated: ${escapeHtml(user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "\u2014")}
          </p>
        </div>
        <div class="admin-user-controls">
          <label class="admin-field">
            <span class="admin-label">Role</span>
            <select class="admin-role-select" data-role-select="${escapeHtml(user.id)}">
              <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
              <option value="super_admin" ${user.role === "super_admin" ? "selected" : ""}>Super admin</option>
            </select>
          </label>
          <div class="button-row admin-user-action-row">
            <button type="button" class="button-secondary" data-admin-action="save-role" data-user-id="${escapeHtml(user.id)}">
              Save role
            </button>
            <button type="button" class="button-warning" data-admin-action="disable" data-user-id="${escapeHtml(user.id)}" ${user.active ? "" : "disabled"}>
              ${user.active ? "Disable" : "Disabled"}
            </button>
            <button type="button" class="button-danger" data-admin-action="delete" data-user-id="${escapeHtml(user.id)}" ${user.active ? "disabled" : ""}>
              Delete
            </button>
          </div>
        </div>
      </article>
    `;
    }).join("");
  }
  function getSelectedRoleForUser(userId) {
    const selector = `[data-role-select="${CSS.escape(userId)}"]`;
    const select = elements.adminUsersList.querySelector(selector);
    return select instanceof HTMLSelectElement ? select.value : "";
  }
  async function activateAuthenticatedDashboard() {
    renderAuthSummary();
    setAuthView("dashboard");
    await refreshSupabaseConnectionState();
    if (canManageAdminAccounts()) {
      await refreshAdminUsers();
    } else {
      state.adminUsers = [];
      renderAdminUsers();
    }
  }
  async function resolveAdminAccess() {
    if (state.authBusy) {
      return;
    }
    state.authBusy = true;
    showAuthLoading();
    try {
      const client = await ensureAuthClient();
      const { data, error } = await client.auth.getSession();
      if (error) {
        showLoginScreen("Supabase session could not be restored. Please log in again.", "warning");
        return;
      }
      state.authSession = data.session ?? null;
      syncRemoteAuthProvider();
      if (!state.authSession?.access_token) {
        showLoginScreen();
        return;
      }
      const profileResult = await loadCurrentAdminProfile();
      if (!profileResult.ok) {
        if (profileResult.status === 401) {
          await client.auth.signOut();
          state.authSession = null;
          syncRemoteAuthProvider();
          showLoginScreen("Your session expired. Please log in again.", "warning");
          return;
        }
        if (profileResult.status === 403) {
          showAccessDenied(String(profileResult.data?.error ?? "This account does not have admin access."));
          return;
        }
        showLoginScreen(getAuthFailureMessage(profileResult, "Supabase unavailable."), "error");
        return;
      }
      await activateAuthenticatedDashboard();
    } catch (error) {
      showLoginScreen(error.message || "Supabase unavailable.", "error");
    } finally {
      state.authResolved = true;
      state.authBusy = false;
    }
  }
  async function signOutAdmin(message = "Signed out successfully.", tone = "success") {
    state.pendingLogoutMessage = message;
    state.pendingLogoutTone = tone;
    try {
      const client = await ensureAuthClient();
      await client.auth.signOut();
    } catch (_error) {
    }
    state.authSession = null;
    state.adminProfile = null;
    state.adminUsers = [];
    state.supabaseConnected = false;
    state.supabaseChecked = false;
    state.remoteAdminDataLoaded = false;
    syncRemoteAuthProvider();
    renderAdminSummaryReset();
    showLoginScreen(message, tone);
  }
  function prettyJson(value) {
    return JSON.stringify(value, null, 2);
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function sortByDate(entries) {
    return [...entries].sort((left, right) => left.date.localeCompare(right.date));
  }
  function mergePrayerEntries(existingEntries, incomingEntries) {
    const merged = /* @__PURE__ */ new Map();
    [...existingEntries, ...incomingEntries].forEach((entry) => {
      merged.set(entry.date, entry);
    });
    return sortByDate([...merged.values()]);
  }
  function getThemeLabel(theme) {
    return APP_CONFIG.themes[theme]?.label ?? APP_CONFIG.themes[APP_CONFIG.defaultTheme].label;
  }
  function getStoredPrayerData(options = {}) {
    return sortByDate(getSavedPrayerTimes(options));
  }
  function getSavedPrayerData(options = {}) {
    if (state.supabaseConnected && state.remoteAdminDataLoaded) {
      if (options.includeArchived) {
        return sortByDate([...state.remotePrayerTimes, ...state.archivedPrayerTimes]);
      }
      return sortByDate(state.remotePrayerTimes);
    }
    return getStoredPrayerData(options);
  }
  function getSampleEvents() {
    const validation = validateEventsArray(SAMPLE_EVENTS);
    return validation.valid ? validation.normalized : [];
  }
  function getStoredEventCollection(options = {}) {
    const savedEvents = getSavedEvents(options);
    if (savedEvents.length > 0) {
      return {
        items: savedEvents,
        source: "localStorage"
      };
    }
    return {
      items: getSampleEvents(),
      source: "sample"
    };
  }
  function getCurrentEventCollection(options = {}) {
    if (state.supabaseConnected && state.remoteAdminDataLoaded) {
      if (options.includeArchived) {
        return {
          items: [...state.remoteEvents, ...state.archivedEvents],
          source: "supabase"
        };
      }
      return {
        items: state.remoteEvents,
        source: "supabase"
      };
    }
    return getStoredEventCollection(options);
  }
  function buildEventStorageSnapshot(activeEvents) {
    const merged = /* @__PURE__ */ new Map();
    [...getArchivedEventData(), ...activeEvents].forEach((event) => {
      merged.set(event.id, event);
    });
    return [...merged.values()];
  }
  function getDisplaySourceLabel(collectionSource) {
    if (collectionSource === "supabase") {
      return "Supabase";
    }
    if (collectionSource === "localStorage") {
      return "localStorage";
    }
    if (state.supabaseConnected) {
      return "Supabase";
    }
    if (collectionSource === "sample") {
      return "Sample data";
    }
    if (state.supabaseConnected) {
      return "Supabase";
    }
    return "Sample data";
  }
  function getArchivedPrayerData() {
    if (state.supabaseConnected) {
      return sortByDate(state.archivedPrayerTimes);
    }
    return getStoredPrayerData({ includeArchived: true }).filter((entry) => entry.archived);
  }
  function getArchivedEventData() {
    if (state.supabaseConnected) {
      return [...state.archivedEvents];
    }
    return getSavedEvents({ includeArchived: true }).filter((event) => event.archived);
  }
  function updateArchivedToggleLabels() {
    setText(
      elements.toggleArchivedPrayerTimes,
      elements.archivedPrayerTimesSection.hidden ? "Show archived prayer times" : "Hide archived prayer times"
    );
    setText(
      elements.toggleArchivedEvents,
      elements.archivedEventsSection.hidden ? "Show archived events" : "Hide archived events"
    );
  }
  function syncLocalCacheWithRemote() {
    const combinedPrayerTimes = sortByDate([...state.remotePrayerTimes, ...state.archivedPrayerTimes]);
    const combinedEvents = [...state.remoteEvents, ...state.archivedEvents];
    savePrayerTimesToStorage(combinedPrayerTimes);
    saveEvents(combinedEvents);
  }
  async function refreshRemoteAdminData(options = {}) {
    if (!state.supabaseConnected) {
      state.remoteAdminDataLoaded = false;
      state.remotePrayerTimes = [];
      state.remoteEvents = [];
      state.archivedPrayerTimes = [];
      state.archivedEvents = [];
      renderArchivedData();
      refreshStatusPanel();
      return null;
    }
    const [activePrayerResult, activeEventResult, archivedPrayerResult, archivedEventResult] = await Promise.all([
      loadAdminPrayerTimesFromRemote({ archived: false }),
      loadAdminEventsFromRemote({ archived: false }),
      loadAdminPrayerTimesFromRemote({ archived: true }),
      loadAdminEventsFromRemote({ archived: true })
    ]);
    const failure = [activePrayerResult, activeEventResult, archivedPrayerResult, archivedEventResult].find((result) => !result.ok) ?? null;
    if (failure) {
      if (await handleRemoteAccessFailure(failure)) {
        return null;
      }
      state.supabaseConnected = false;
      state.remoteAdminDataLoaded = false;
      setStatus(
        elements.archivedStatus,
        getRemoteFailureMessage(failure, "Archived data could not be loaded from Supabase."),
        "warning"
      );
      renderArchivedData();
      refreshStatusPanel();
      return null;
    }
    state.remoteAdminDataLoaded = true;
    state.remotePrayerTimes = sortByDate(activePrayerResult.data?.items ?? []);
    state.remoteEvents = activeEventResult.data?.items ?? [];
    state.archivedPrayerTimes = sortByDate(archivedPrayerResult.data?.items ?? []);
    state.archivedEvents = archivedEventResult.data?.items ?? [];
    syncLocalCacheWithRemote();
    if (options.hydrateEditors) {
      updateManualEditorFromSavedPrayerData(state.remotePrayerTimes);
      syncEventEditor(state.remoteEvents);
    }
    renderSavedEvents();
    renderArchivedData();
    refreshStatusPanel();
    setStatus(elements.archivedStatus, "Archived data loaded from Supabase.", "success");
    return {
      prayerTimes: state.remotePrayerTimes,
      events: state.remoteEvents,
      archivedPrayerTimes: state.archivedPrayerTimes,
      archivedEvents: state.archivedEvents
    };
  }
  async function refreshSupabaseConnectionState() {
    if (!state.authSession?.access_token || !state.adminProfile) {
      state.supabaseConnected = false;
      state.supabaseChecked = true;
      return {
        connected: false,
        message: "Admin login is required before Supabase admin tools can load.",
        detail: "authentication required"
      };
    }
    const result = await checkSupabaseConnection();
    state.supabaseConnected = result.connected;
    state.supabaseChecked = true;
    if (result.connected) {
      await refreshRemoteAdminData({ hydrateEditors: true });
    } else {
      renderArchivedData();
      refreshStatusPanel();
    }
    setStatus(
      elements.generalStatus,
      result.connected ? APP_CONFIG.syncMessages.connected : APP_CONFIG.syncMessages.unavailable,
      result.connected ? "success" : "warning"
    );
    return result;
  }
  async function syncPrayerTimesWithRemote(entries) {
    const result = await savePrayerTimesRemotely(entries);
    if (await handleRemoteAccessFailure(result)) {
      return result;
    }
    state.supabaseConnected = result.ok;
    state.supabaseChecked = true;
    if (result.ok) {
      await refreshRemoteAdminData({ hydrateEditors: true });
    } else {
      refreshStatusPanel();
    }
    return result;
  }
  async function syncEventWithRemote(event) {
    const result = await saveEventRemotely(event);
    if (await handleRemoteAccessFailure(result)) {
      return result;
    }
    state.supabaseConnected = result.ok;
    state.supabaseChecked = true;
    if (result.ok) {
      await refreshRemoteAdminData({ hydrateEditors: true });
    } else {
      refreshStatusPanel();
    }
    return result;
  }
  async function syncEventCollectionWithRemote(events) {
    if (!Array.isArray(events) || events.length === 0) {
      state.supabaseChecked = true;
      return {
        ok: true,
        skipped: false,
        status: 200,
        data: { count: 0 },
        error: ""
      };
    }
    const results = await Promise.all(events.map((item) => saveEventRemotely(item)));
    const failedResult = results.find((result) => !result.ok) ?? null;
    if (await handleRemoteAccessFailure(failedResult)) {
      return failedResult;
    }
    const allSkipped = results.every((result) => result.skipped);
    state.supabaseConnected = !failedResult && !allSkipped;
    state.supabaseChecked = true;
    if (!failedResult && !allSkipped) {
      await refreshRemoteAdminData({ hydrateEditors: true });
    } else {
      refreshStatusPanel();
    }
    if (failedResult) {
      return failedResult;
    }
    if (allSkipped) {
      return {
        ok: false,
        skipped: true,
        status: 0,
        data: null,
        error: "Remote functions are unavailable in direct file-open mode."
      };
    }
    return {
      ok: true,
      skipped: false,
      status: 200,
      data: { count: results.length },
      error: ""
    };
  }
  async function syncEventArchiveWithRemote(eventId) {
    const result = await archiveEventRemotely(eventId);
    if (await handleRemoteAccessFailure(result)) {
      return result;
    }
    state.supabaseConnected = result.ok;
    state.supabaseChecked = true;
    if (result.ok) {
      await refreshRemoteAdminData({ hydrateEditors: true });
    } else {
      refreshStatusPanel();
    }
    return result;
  }
  function applyTheme(theme) {
    const safeTheme = APP_CONFIG.themes[theme] ? theme : APP_CONFIG.defaultTheme;
    elements.body.dataset.theme = safeTheme;
    setText(elements.adminThemeBadge, APP_CONFIG.themes[safeTheme].label);
    elements.themeInputs.forEach((input) => {
      input.checked = input.value === safeTheme;
    });
  }
  function parseJsonFromTextarea(textarea) {
    try {
      return { ok: true, value: JSON.parse(textarea.value) };
    } catch (error) {
      return { ok: false, error };
    }
  }
  function formatValidationErrors(errors) {
    return errors.join(" ");
  }
  function populateMonthOptions() {
    elements.importMonth.innerHTML = IMPORT_MONTH_OPTIONS.map((monthOption) => `<option value="${monthOption.value}">${monthOption.label}</option>`).join("");
  }
  function setDefaultImportPeriod() {
    const now = /* @__PURE__ */ new Date();
    elements.importMonth.value = String(now.getMonth() + 1);
    elements.importYear.value = String(now.getFullYear());
  }
  function refreshStatusPanel() {
    const prayerEntries = getSavedPrayerData();
    const eventCollection = getCurrentEventCollection();
    const savedEvents = eventCollection.items;
    const currentTheme = getThemeFromStorage();
    setText(elements.statusPrayerCount, String(prayerEntries.length));
    setText(elements.statusPrayerFirstDate, prayerEntries[0]?.date ?? "--");
    setText(elements.statusPrayerLastDate, prayerEntries[prayerEntries.length - 1]?.date ?? "--");
    setText(elements.statusEventCount, String(savedEvents.length));
    setText(elements.statusCurrentTheme, getThemeLabel(currentTheme));
    setText(elements.statusDataSource, getDisplaySourceLabel(state.supabaseConnected && prayerEntries.length > 0 ? "supabase" : eventCollection.source));
    if (!state.supabaseChecked) {
      setStatus(elements.adminStatusNote, "Checking Supabase connection status...", "warning");
      return;
    }
    if (state.supabaseConnected) {
      setStatus(elements.adminStatusNote, APP_CONFIG.syncMessages.connected, "success");
      return;
    }
    if (prayerEntries.length === 0 && savedEvents.length === 0) {
      setStatus(
        elements.adminStatusNote,
        `${APP_CONFIG.syncMessages.unavailable} The display will use bundled sample data.`,
        "warning"
      );
      return;
    }
    if (prayerEntries.length === 0) {
      setStatus(
        elements.adminStatusNote,
        `${APP_CONFIG.syncMessages.unavailable} Prayer times still come from sample data. Events or theme settings are saved in this browser.`,
        "warning"
      );
      return;
    }
    setStatus(
      elements.adminStatusNote,
      `${APP_CONFIG.syncMessages.unavailable} Saved browser data is available in this browser and can be read by index.html.`,
      "success"
    );
  }
  function syncEventEditor(events = getCurrentEventCollection().items) {
    elements.eventsInput.value = prettyJson(events);
  }
  function populateEditors() {
    const savedPrayerTimes = getSavedPrayerData();
    elements.prayerTimesInput.value = prettyJson(savedPrayerTimes.length > 0 ? savedPrayerTimes : SAMPLE_PRAYER_TIMES);
    syncEventEditor();
  }
  function loadSampleDataIntoEditors() {
    elements.prayerTimesInput.value = prettyJson(SAMPLE_PRAYER_TIMES);
    elements.eventsInput.value = prettyJson(SAMPLE_EVENTS);
  }
  function setGeneralReadyState() {
    if (hasLocalStorageSupport()) {
      setStatus(
        elements.generalStatus,
        "Ready. Upload a timetable image or paste timetable text, then review the preview before saving.",
        "success"
      );
      return;
    }
    setStatus(
      elements.generalStatus,
      "This browser does not allow localStorage. Supabase saves may still work when deployed, but browser-local fallback data will not be stored here.",
      "warning"
    );
  }
  function toggleManualSection(forceVisible) {
    const shouldShow = typeof forceVisible === "boolean" ? forceVisible : elements.manualJsonSection.hidden;
    elements.manualJsonSection.hidden = !shouldShow;
    elements.toggleManualEntry.textContent = shouldShow ? "Hide manual JSON entry" : "\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u064A\u062F\u0648\u064A\u0627\u064B / Enter data manually";
  }
  function toggleEventJsonSection(forceVisible) {
    const shouldShow = typeof forceVisible === "boolean" ? forceVisible : elements.eventJsonSection.hidden;
    elements.eventJsonSection.hidden = !shouldShow;
    elements.toggleEventJsonEntry.textContent = shouldShow ? "Hide event JSON entry" : "\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0627\u062A \u0628\u0635\u064A\u063A\u0629 JSON \u064A\u062F\u0648\u064A\u0627\u064B / Enter event JSON manually";
  }
  function clearImagePreview() {
    if (state.currentImageUrl) {
      URL.revokeObjectURL(state.currentImageUrl);
    }
    state.currentImageUrl = "";
    state.currentImageFile = null;
    elements.imagePreview.src = "";
    elements.imagePreviewPanel.hidden = true;
    elements.runOcrButton.disabled = true;
  }
  function showImagePreview(file) {
    if (!file) {
      clearImagePreview();
      return;
    }
    if (state.currentImageUrl) {
      URL.revokeObjectURL(state.currentImageUrl);
    }
    state.currentImageFile = file;
    state.currentImageUrl = URL.createObjectURL(file);
    elements.imagePreview.src = state.currentImageUrl;
    elements.imagePreviewPanel.hidden = false;
    elements.runOcrButton.disabled = false;
  }
  function renderSkippedLines(skippedLines = []) {
    if (!Array.isArray(skippedLines) || skippedLines.length === 0) {
      elements.parseSkippedContainer.hidden = true;
      elements.parseSkippedLines.innerHTML = "";
      return;
    }
    elements.parseSkippedContainer.hidden = false;
    elements.parseSkippedLines.innerHTML = skippedLines.map((item) => `
      <li>
        <strong>Line ${item.lineNumber}:</strong> ${escapeHtml(item.rawLine)}
        <span>${escapeHtml(item.reason || "Needs manual review.")}</span>
      </li>
    `).join("");
  }
  function updatePreviewActionState() {
    const hasImportText = Boolean(elements.importTextInput.value.trim());
    const hasPreviewRows = state.previewRows.length > 0;
    elements.reparsePreview.disabled = !hasImportText;
    elements.autoFixImportText.disabled = !hasImportText;
    elements.clearPreview.disabled = !hasPreviewRows;
  }
  function getPreviewFieldMessages(row, field) {
    return row.fieldErrors?.[field] ?? [];
  }
  function buildPreviewInput(row, rowIndex, field, extraClass = "") {
    const fieldMessages = getPreviewFieldMessages(row, field.key);
    const invalidClass = fieldMessages.length > 0 ? " is-invalid" : "";
    const titleAttribute = fieldMessages.length > 0 ? ` title="${escapeHtml(fieldMessages.join(" "))}"` : "";
    return `
    <input
      class="preview-input${invalidClass}${extraClass ? ` ${extraClass}` : ""}"
      type="text"
      value="${escapeHtml(row[field.key] ?? "")}"
      placeholder="${escapeHtml(field.placeholder || "")}"
      inputmode="${escapeHtml(field.inputMode || "text")}"
      data-row-index="${rowIndex}"
      data-field="${field.key}"${titleAttribute}
    >
  `;
  }
  function renderPreviewSummary(validation) {
    if (validation.rows.length === 0) {
      elements.previewSummary.innerHTML = `
      <article class="preview-stat-card">
        <p class="preview-stat-label">Parsed rows</p>
        <p class="preview-stat-value">0</p>
      </article>
      <article class="preview-stat-card">
        <p class="preview-stat-label">First date</p>
        <p class="preview-stat-value">\u2014</p>
      </article>
      <article class="preview-stat-card">
        <p class="preview-stat-label">Last date</p>
        <p class="preview-stat-value">\u2014</p>
      </article>
      <article class="preview-stat-card preview-stat-card-errors">
        <p class="preview-stat-label">Validation issues</p>
        <p class="preview-stat-value">0</p>
      </article>
    `;
      return;
    }
    const summary = summarizeImportedRows(validation.rows);
    const errorCardClass = validation.errorCount > 0 ? "preview-stat-card preview-stat-card-errors has-errors" : "preview-stat-card preview-stat-card-errors";
    elements.previewSummary.innerHTML = `
    <article class="preview-stat-card">
      <p class="preview-stat-label">Parsed rows</p>
      <p class="preview-stat-value">${summary.count}</p>
    </article>
    <article class="preview-stat-card">
      <p class="preview-stat-label">First date</p>
      <p class="preview-stat-value">${escapeHtml(summary.firstDate)}</p>
    </article>
    <article class="preview-stat-card">
      <p class="preview-stat-label">Last date</p>
      <p class="preview-stat-value">${escapeHtml(summary.lastDate)}</p>
    </article>
    <article class="${errorCardClass}">
      <p class="preview-stat-label">Validation issues</p>
      <p class="preview-stat-value">${validation.errorCount}</p>
    </article>
  `;
  }
  function renderPreviewValidationState(validation) {
    if (validation.rows.length === 0) {
      elements.previewErrors.className = "preview-validation-panel";
      elements.previewErrors.innerHTML = `
      <p class="preview-validation-title">Parse a timetable to see validation details here.</p>
      <p class="preview-validation-copy">The preview becomes editable after parsing.</p>
    `;
      return;
    }
    if (validation.valid) {
      elements.previewErrors.className = "preview-validation-panel is-success";
      elements.previewErrors.innerHTML = `
      <p class="preview-validation-title">All preview rows are valid and ready to save.</p>
      <p class="preview-validation-copy">You can save the corrected timetable now.</p>
    `;
      return;
    }
    const issueItems = validation.rows.flatMap((row, rowIndex) => row.errors.map((error) => {
      const rowLabel = row.date ? `Row ${rowIndex + 1} (${row.date})` : `Row ${rowIndex + 1}`;
      return `${rowLabel}: ${error}`;
    })).slice(0, 4);
    const hiddenIssueCount = Math.max(validation.errorCount - issueItems.length, 0);
    elements.previewErrors.className = "preview-validation-panel is-error";
    elements.previewErrors.innerHTML = `
    <p class="preview-validation-title">${validation.errorCount} validation issues must be fixed before saving.</p>
    <ul class="preview-validation-list">
      ${issueItems.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}
      ${hiddenIssueCount > 0 ? `<li>And ${hiddenIssueCount} more issue${hiddenIssueCount === 1 ? "" : "s"}.</li>` : ""}
    </ul>
  `;
  }
  function renderPreviewTable() {
    if (state.previewRows.length === 0) {
      elements.previewTableContainer.innerHTML = `
      <div class="preview-empty-state">
        Upload a timetable image or paste timetable text to build the editable review table.
      </div>
    `;
      updatePreviewActionState();
      return;
    }
    const headerMarkup = PREVIEW_FIELDS.map((field) => `<th scope="col" class="${field.columnClass}" data-field="${field.key}">${field.label}</th>`).join("");
    const colMarkup = PREVIEW_FIELDS.map((field) => `<col class="${field.columnClass}">`).join("");
    const tableBodyMarkup = state.previewRows.map((row, rowIndex) => {
      const fieldCells = PREVIEW_FIELDS.map((field) => `
      <td class="${field.columnClass}" data-field="${field.key}">
        ${buildPreviewInput(row, rowIndex, field)}
      </td>
    `).join("");
      const statusClass = row.errors.length > 0 ? "preview-status-text is-error" : "preview-status-text";
      const statusText = row.errors.length > 0 ? row.statusText : `Valid. Source line ${row.sourceLineNumber || "--"}.`;
      return `
      <tr class="${row.errors.length > 0 ? "preview-row-error" : ""}">
        ${fieldCells}
        <td class="preview-col-status" data-field="status">
          <p class="${statusClass}" title="${escapeHtml(row.sourceLine || "")}">${escapeHtml(statusText)}</p>
        </td>
      </tr>
    `;
    }).join("");
    const cardMarkup = state.previewRows.map((row, rowIndex) => {
      const statusText = row.errors.length > 0 ? row.statusText : `Valid. Source line ${row.sourceLineNumber || "--"}.`;
      const cardFields = PREVIEW_FIELDS.map((field) => `
      <label class="preview-card-field" data-field="${field.key}">
        <span class="preview-card-label">${field.label}</span>
        ${buildPreviewInput(row, rowIndex, field, "preview-input-card")}
      </label>
    `).join("");
      return `
      <article class="preview-card${row.errors.length > 0 ? " is-error" : ""}">
        <div class="preview-card-header">
          <div>
            <p class="preview-card-kicker">Preview row ${rowIndex + 1}</p>
            <h3 class="preview-card-title">${escapeHtml(row.date || "Missing date")}</h3>
            <p class="preview-card-source">Source line ${row.sourceLineNumber || "--"}</p>
          </div>
          <span class="preview-card-badge${row.errors.length > 0 ? " is-error" : ""}">
            ${row.errors.length > 0 ? "Needs fixes" : "Valid"}
          </span>
        </div>
        <div class="preview-card-grid">
          ${cardFields}
        </div>
        <p class="preview-status-text${row.errors.length > 0 ? " is-error" : ""}" title="${escapeHtml(row.sourceLine || "")}">
          ${escapeHtml(statusText)}
        </p>
      </article>
    `;
    }).join("");
    elements.previewTableContainer.innerHTML = `
    <div class="preview-table-wrap">
      <table class="preview-table">
        <colgroup>
          ${colMarkup}
          <col class="preview-col-status">
        </colgroup>
        <thead>
          <tr>
            ${headerMarkup}
            <th scope="col" class="preview-col-status">Status</th>
          </tr>
        </thead>
        <tbody>${tableBodyMarkup}</tbody>
      </table>
    </div>
    <div class="preview-card-list">
      ${cardMarkup}
    </div>
  `;
    updatePreviewActionState();
  }
  function focusVisiblePreviewInput(rowIndex, field, selectionStart = null, selectionEnd = null, scrollLeft = 0) {
    const previewWrap = elements.previewTableContainer.querySelector(".preview-table-wrap");
    if (previewWrap) {
      previewWrap.scrollLeft = scrollLeft;
    }
    const matchingInput = [...elements.previewTableContainer.querySelectorAll(
      `input[data-row-index="${rowIndex}"][data-field="${field}"]`
    )].find((input) => input.offsetParent !== null);
    if (!(matchingInput instanceof HTMLInputElement)) {
      return;
    }
    matchingInput.focus({ preventScroll: true });
    if (typeof selectionStart === "number" && typeof selectionEnd === "number") {
      matchingInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
  function refreshPreviewValidation() {
    const validation = validateImportedPrayerRows(state.previewRows);
    state.previewRows = validation.rows;
    elements.saveImportedPrayerTimes.disabled = !validation.valid;
    renderPreviewSummary(validation);
    renderPreviewValidationState(validation);
    renderPreviewTable();
  }
  function parseImportText() {
    const rawText = elements.importTextInput.value.trim();
    if (!rawText) {
      state.previewRows = [];
      renderSkippedLines([]);
      renderPreviewTable();
      setStatus(elements.parseStatus, "Paste timetable text or review OCR text before parsing.", "error");
      setStatus(elements.importSaveStatus, "Imported prayer times are not saved yet.");
      refreshPreviewValidation();
      return;
    }
    const parseResult = parseTimetableText(rawText, {
      month: Number(elements.importMonth.value),
      year: Number(elements.importYear.value)
    });
    state.previewRows = parseResult.rows;
    renderSkippedLines(parseResult.skippedLines);
    refreshPreviewValidation();
    setStatus(
      elements.importSaveStatus,
      parseResult.rows.length > 0 ? "Preview updated. Review and correct every row before saving." : "Imported prayer times are not saved yet.",
      parseResult.rows.length > 0 ? "warning" : ""
    );
    if (parseResult.rows.length === 0) {
      setStatus(elements.parseStatus, parseResult.message, "error");
      return;
    }
    if (parseResult.valid) {
      setStatus(elements.parseStatus, parseResult.message, "success");
      return;
    }
    setStatus(elements.parseStatus, `${parseResult.message} Fix highlighted rows before saving.`, "warning");
  }
  function clearPreviewState(options = {}) {
    state.previewRows = [];
    refreshPreviewValidation();
    if (!options.preserveSkippedLines) {
      renderSkippedLines([]);
    }
    if (!options.preserveStatus) {
      setStatus(elements.importSaveStatus, "Preview cleared. Re-parse the text when you are ready.", "warning");
      setStatus(elements.parseStatus, "Preview cleared. Parse the timetable again to rebuild the review step.", "warning");
    }
  }
  function autoFixImportText() {
    const rawText = elements.importTextInput.value.trim();
    if (!rawText) {
      setStatus(elements.parseStatus, "Paste timetable text or run OCR before using auto-fix.", "error");
      return;
    }
    const cleanedText = cleanupTimetableText(rawText);
    if (!cleanedText) {
      elements.importTextInput.value = "";
      clearPreviewState({ preserveStatus: true });
      setStatus(elements.parseStatus, "Auto-fix removed the unreadable lines. Paste or OCR the timetable again.", "warning");
      setStatus(elements.importSaveStatus, "Imported prayer times are not saved yet.");
      return;
    }
    elements.importTextInput.value = cleanedText;
    setStatus(elements.parseStatus, "Common OCR issues were cleaned up. Review the text, then re-parse it.", "success");
    setStatus(elements.generalStatus, "OCR text cleaned up. Re-parse the timetable to refresh the preview.", "warning");
    updatePreviewActionState();
  }
  function populateImportSample() {
    elements.importMonth.value = "7";
    elements.importYear.value = "2026";
    elements.importTextInput.value = SAMPLE_TIMETABLE_TEXT;
    parseImportText();
  }
  function updateManualEditorFromSavedPrayerData(prayerEntries) {
    elements.prayerTimesInput.value = prettyJson(sortByDate(prayerEntries));
  }
  function buildPrayerStorageSnapshot(activePrayerEntries) {
    const archivedEntries = getArchivedPrayerData();
    return sortByDate([
      ...archivedEntries,
      ...activePrayerEntries.map((entry) => ({ ...entry, archived: false }))
    ]);
  }
  function savePrayerSnapshotLocally(allPrayerEntries) {
    const orderedEntries = sortByDate(allPrayerEntries);
    const localSaved = savePrayerTimesToStorage(orderedEntries);
    if (localSaved) {
      updateManualEditorFromSavedPrayerData(orderedEntries.filter((entry) => !entry.archived));
      renderArchivedData();
      refreshStatusPanel();
    }
    return localSaved;
  }
  async function persistPrayerDataset(prayerEntries, successMessage) {
    const localSaved = savePrayerSnapshotLocally(buildPrayerStorageSnapshot(prayerEntries));
    const remoteResult = await syncPrayerTimesWithRemote(prayerEntries);
    if (remoteResult.ok && localSaved) {
      return {
        ok: true,
        remoteSaved: true,
        localSaved: true,
        tone: "success",
        detail: successMessage,
        general: APP_CONFIG.syncMessages.connected
      };
    }
    if (remoteResult.ok) {
      return {
        ok: true,
        remoteSaved: true,
        localSaved: false,
        tone: "warning",
        detail: `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
        general: APP_CONFIG.syncMessages.connected
      };
    }
    if (localSaved) {
      return {
        ok: true,
        remoteSaved: false,
        localSaved: true,
        tone: "warning",
        detail: `${successMessage} Saved in this browser only.`,
        general: APP_CONFIG.syncMessages.localOnly,
        remoteError: getRemoteFailureMessage(remoteResult)
      };
    }
    return {
      ok: false,
      remoteSaved: false,
      localSaved: false,
      tone: "error",
      detail: "Could not save prayer times locally or remotely.",
      general: getRemoteFailureMessage(remoteResult, "Supabase unavailable. Prayer times were not saved.")
    };
  }
  async function saveImportedPrayerRows() {
    const validation = validateImportedPrayerRows(state.previewRows);
    state.previewRows = validation.rows;
    refreshPreviewValidation();
    if (!validation.valid) {
      setStatus(elements.importSaveStatus, "Highlighted preview rows still need fixes before saving.", "error");
      setStatus(elements.generalStatus, "Fix the highlighted preview rows before saving the corrected timetable.", "error");
      return;
    }
    const mergedPrayerEntries = mergePrayerEntries(
      getSavedPrayerData(),
      importedRowsToPrayerEntries(validation.rows)
    );
    const persistence = await persistPrayerDataset(
      mergedPrayerEntries,
      `Saved ${validation.rows.length} imported prayer-time rows. The merged dataset now has ${mergedPrayerEntries.length} day entries.`
    );
    if (persistence.remoteSaved) {
      setStatus(
        elements.importSaveStatus,
        "Saved to Supabase. Mosque screens will update automatically.",
        persistence.tone
      );
      setStatus(
        elements.generalStatus,
        `Saved ${validation.rows.length} corrected timetable rows to the shared dataset.`,
        persistence.tone
      );
    } else if (persistence.localSaved) {
      setStatus(
        elements.importSaveStatus,
        "Saved locally only. This will not update mosque screens until Supabase is connected.",
        "warning"
      );
      setStatus(elements.generalStatus, persistence.general, "warning");
    } else {
      setStatus(elements.importSaveStatus, persistence.detail, "error");
      setStatus(elements.generalStatus, persistence.general, "error");
    }
    setStatus(
      elements.prayerTimesStatus,
      persistence.localSaved ? "Manual JSON editor updated with the saved merged prayer-time dataset." : "Manual JSON editor could not be updated because the browser copy was not saved.",
      persistence.localSaved ? persistence.tone : persistence.remoteSaved ? "warning" : "error"
    );
  }
  function loadTesseract() {
    if (window.Tesseract) {
      return Promise.resolve(window.Tesseract);
    }
    if (state.tesseractPromise) {
      return state.tesseractPromise;
    }
    state.tesseractPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TESSERACT_CDN;
      script.async = true;
      script.onload = () => {
        if (window.Tesseract) {
          resolve(window.Tesseract);
        } else {
          state.tesseractPromise = null;
          reject(new Error("Tesseract loaded but was not available on window."));
        }
      };
      script.onerror = () => {
        state.tesseractPromise = null;
        reject(new Error("Could not load Tesseract.js from CDN."));
      };
      document.head.appendChild(script);
    });
    return state.tesseractPromise;
  }
  async function runOcrForCurrentImage() {
    if (!state.currentImageFile) {
      setStatus(elements.imageImportStatus, "Upload an image before running OCR.", "error");
      return;
    }
    setStatus(elements.imageImportStatus, "Loading OCR engine...", "warning");
    try {
      const Tesseract = await loadTesseract();
      const result = await Tesseract.recognize(state.currentImageFile, "eng", {
        logger(message) {
          if (message?.status) {
            const percent = typeof message.progress === "number" ? ` ${Math.round(message.progress * 100)}%` : "";
            setStatus(elements.imageImportStatus, `${message.status}${percent}`, "warning");
          }
        }
      });
      const extractedText = String(result?.data?.text ?? "").trim();
      elements.importTextInput.value = extractedText;
      updatePreviewActionState();
      if (!extractedText) {
        setStatus(
          elements.imageImportStatus,
          "OCR finished but no text was detected. Paste the timetable text manually below.",
          "warning"
        );
        return;
      }
      setStatus(
        elements.imageImportStatus,
        "OCR finished. Review and correct the extracted text before parsing.",
        "success"
      );
      setStatus(elements.parseStatus, "OCR text is ready. Click Parse timetable after reviewing it.", "warning");
    } catch (error) {
      setStatus(
        elements.imageImportStatus,
        "OCR is unavailable right now. The page still works: paste timetable text manually and continue.",
        "warning"
      );
    }
  }
  function handleImageSelection() {
    const file = elements.imageInput.files?.[0] ?? null;
    if (!file) {
      clearImagePreview();
      setStatus(elements.imageImportStatus, "No image uploaded yet.");
      return;
    }
    showImagePreview(file);
    setStatus(elements.imageImportStatus, "Image uploaded. OCR will now try to read the timetable.", "warning");
    runOcrForCurrentImage();
  }
  function normalizePreviewCellValue(field, value, eventType) {
    const rawValue = String(value ?? "");
    if (field === "date") {
      return rawValue.trim();
    }
    if (eventType === "change") {
      const normalized = normalizeLooseTime(rawValue);
      return normalized || rawValue.trim();
    }
    return rawValue;
  }
  function updatePreviewCell(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const rowIndex = Number(target.dataset.rowIndex);
    const field = target.dataset.field;
    if (!Number.isInteger(rowIndex) || !field || !state.previewRows[rowIndex]) {
      return;
    }
    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    const scrollLeft = elements.previewTableContainer.querySelector(".preview-table-wrap")?.scrollLeft ?? 0;
    const nextValue = normalizePreviewCellValue(field, target.value, event.type);
    if (target.value !== nextValue) {
      target.value = nextValue;
    }
    state.previewRows[rowIndex] = {
      ...state.previewRows[rowIndex],
      [field]: nextValue
    };
    refreshPreviewValidation();
    focusVisiblePreviewInput(rowIndex, field, selectionStart, selectionEnd, scrollLeft);
    setStatus(elements.importSaveStatus, "Preview changed. Save the corrected timetable after reviewing the updated rows.", "warning");
  }
  function validatePrayerTextarea() {
    const parsed = parseJsonFromTextarea(elements.prayerTimesInput);
    if (!parsed.ok) {
      setStatus(elements.prayerTimesStatus, `Invalid JSON: ${parsed.error.message}`, "error");
      return null;
    }
    const validation = validatePrayerTimesArray(parsed.value, { schema: "any" });
    if (!validation.valid) {
      setStatus(elements.prayerTimesStatus, formatValidationErrors(validation.errors), "error");
      return null;
    }
    const ordered = sortByDate(validation.normalized);
    elements.prayerTimesInput.value = prettyJson(ordered);
    setStatus(
      elements.prayerTimesStatus,
      `Prayer times are valid. ${ordered.length} day entries formatted and ready to save.`,
      "success"
    );
    return ordered;
  }
  function validateEventTextarea() {
    const parsed = parseJsonFromTextarea(elements.eventsInput);
    if (!parsed.ok) {
      setStatus(elements.eventsStatus, `Invalid JSON: ${parsed.error.message}`, "error");
      return null;
    }
    const validation = validateEventsArray(parsed.value);
    if (!validation.valid) {
      setStatus(elements.eventsStatus, formatValidationErrors(validation.errors), "error");
      return null;
    }
    elements.eventsInput.value = prettyJson(validation.normalized);
    setStatus(
      elements.eventsStatus,
      `Events are valid. ${validation.normalized.length} entries formatted and ready to save.`,
      "success"
    );
    return validation.normalized;
  }
  function setEventPlaceholderTheme(theme) {
    const themeMeta = getEventThemeMeta(theme);
    elements.eventImagePreviewShell.dataset.theme = themeMeta.key;
    setText(elements.eventImagePlaceholderSymbol, themeMeta.symbol);
    setText(elements.eventImagePlaceholderAr, themeMeta.placeholderArabic);
    setText(elements.eventImagePlaceholderDa, themeMeta.placeholderDanish);
  }
  function setEventImagePreview(dataUrl = "") {
    const hasImage = Boolean(dataUrl);
    state.eventImageDataUrl = dataUrl;
    elements.eventImagePreviewShell.dataset.hasImage = hasImage ? "true" : "false";
    if (hasImage) {
      elements.eventImagePreview.src = dataUrl;
      elements.eventImagePreview.hidden = false;
      return;
    }
    elements.eventImagePreview.hidden = true;
    elements.eventImagePreview.removeAttribute("src");
  }
  function clearEventErrors() {
    elements.eventFormErrors.hidden = true;
    elements.eventFormErrors.innerHTML = "";
  }
  function showEventErrors(errors) {
    if (!Array.isArray(errors) || errors.length === 0) {
      clearEventErrors();
      return;
    }
    elements.eventFormErrors.hidden = false;
    elements.eventFormErrors.innerHTML = errors.map((message) => `<li>${escapeHtml(message)}</li>`).join("");
  }
  function resetEventForm(options = {}) {
    elements.eventForm.reset();
    elements.eventId.value = "";
    elements.eventTheme.value = "normal";
    elements.eventActive.checked = true;
    elements.eventImageInput.value = "";
    state.eventImageDataUrl = "";
    state.editingEventId = "";
    setEventPlaceholderTheme("normal");
    setEventImagePreview("");
    clearEventErrors();
    elements.eventSubmitButton.textContent = "Save event / \u062D\u0641\u0638 \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629";
    elements.eventCancelEdit.hidden = true;
    setStatus(
      elements.eventImageStatus,
      "No image selected. A clean placeholder will be used if you save without an image."
    );
    if (!options.preserveStatus) {
      setStatus(
        elements.eventFormStatus,
        "Fill in the event details, then save. The list below updates after each change."
      );
    }
  }
  function fillEventForm(event) {
    state.editingEventId = event.id;
    elements.eventId.value = event.id;
    elements.eventTitleArabic.value = event.titleArabic || "";
    elements.eventTitleDanish.value = event.titleDanish || "";
    elements.eventDate.value = event.date || "";
    elements.eventTime.value = event.time || "";
    elements.eventLocationArabic.value = event.locationArabic || "";
    elements.eventLocationDanish.value = event.locationDanish || "";
    elements.eventDescriptionArabic.value = event.descriptionArabic || "";
    elements.eventDescriptionDanish.value = event.descriptionDanish || "";
    elements.eventTheme.value = event.theme || "normal";
    elements.eventActive.checked = Boolean(event.active);
    setEventPlaceholderTheme(event.theme || "normal");
    setEventImagePreview(event.imageDataUrl || "");
    elements.eventImageInput.value = "";
    clearEventErrors();
    elements.eventSubmitButton.textContent = "Update event / \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0641\u0639\u0627\u0644\u064A\u0629";
    elements.eventCancelEdit.hidden = false;
    setStatus(
      elements.eventImageStatus,
      event.imageDataUrl ? "Current image loaded. Choose a new image only if you want to replace it." : "This event currently uses the placeholder image.",
      event.imageDataUrl ? "success" : "warning"
    );
    setStatus(elements.eventFormStatus, "Editing event. Update the fields and save when ready.", "warning");
    elements.eventForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read file."));
      reader.readAsDataURL(file);
    });
  }
  function loadImageElement(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not decode image."));
      image.src = dataUrl;
    });
  }
  async function resizeImageDataUrl(dataUrl, fileType) {
    const image = await loadImageElement(dataUrl);
    const maxWidth = 1600;
    const maxHeight = 1600;
    const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    if (width === image.width && height === image.height && fileType === "image/png") {
      return dataUrl;
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      return dataUrl;
    }
    context.drawImage(image, 0, 0, width, height);
    const outputType = fileType === "image/png" ? "image/png" : "image/webp";
    const output = canvas.toDataURL(outputType, outputType === "image/png" ? void 0 : 0.86);
    return output || dataUrl;
  }
  async function prepareEventImage(file) {
    const warnings = [];
    if (!ALLOWED_EVENT_IMAGE_TYPES.has(file.type)) {
      throw new Error("Invalid image type. Use PNG, JPG, JPEG, or WEBP.");
    }
    if (file.size > MAX_EVENT_IMAGE_BYTES) {
      warnings.push("Large images may not save correctly in the browser. Use an optimized image under 2 MB.");
    }
    const originalDataUrl = await readFileAsDataUrl(file);
    try {
      const optimizedDataUrl = await resizeImageDataUrl(originalDataUrl, file.type);
      return {
        dataUrl: optimizedDataUrl,
        warnings
      };
    } catch (error) {
      warnings.push("The image could not be optimized automatically. The original file preview is being used.");
      return {
        dataUrl: originalDataUrl,
        warnings
      };
    }
  }
  async function handleEventImageSelection() {
    const file = elements.eventImageInput.files?.[0] ?? null;
    if (!file) {
      if (!state.editingEventId) {
        setEventImagePreview("");
        setStatus(
          elements.eventImageStatus,
          "No image selected. A clean placeholder will be used if you save without an image."
        );
      }
      return;
    }
    try {
      const result = await prepareEventImage(file);
      setEventImagePreview(result.dataUrl);
      const tone = result.warnings.length > 0 ? "warning" : "success";
      const suffix = result.warnings.length > 0 ? ` ${result.warnings.join(" ")}` : "";
      setStatus(elements.eventImageStatus, `Image ready for preview and saving.${suffix}`.trim(), tone);
    } catch (error) {
      elements.eventImageInput.value = "";
      setEventImagePreview(state.editingEventId ? state.eventImageDataUrl : "");
      setStatus(elements.eventImageStatus, error.message, "error");
    }
  }
  function getEventFormPayload() {
    return {
      id: elements.eventId.value.trim(),
      titleArabic: elements.eventTitleArabic.value.trim(),
      titleDanish: elements.eventTitleDanish.value.trim(),
      date: elements.eventDate.value.trim(),
      time: elements.eventTime.value.trim(),
      locationArabic: elements.eventLocationArabic.value.trim(),
      locationDanish: elements.eventLocationDanish.value.trim(),
      descriptionArabic: elements.eventDescriptionArabic.value.trim(),
      descriptionDanish: elements.eventDescriptionDanish.value.trim(),
      imageDataUrl: state.eventImageDataUrl,
      theme: elements.eventTheme.value,
      active: elements.eventActive.checked
    };
  }
  function validateEventFormPayload(payload) {
    const errors = [];
    const validation = validateEventsArray([{
      id: payload.id || "event-form-preview",
      titleArabic: payload.titleArabic,
      titleDanish: payload.titleDanish,
      date: payload.date,
      time: payload.time,
      locationArabic: payload.locationArabic,
      locationDanish: payload.locationDanish,
      descriptionArabic: payload.descriptionArabic,
      descriptionDanish: payload.descriptionDanish,
      imageDataUrl: payload.imageDataUrl,
      theme: payload.theme,
      active: payload.active
    }]);
    errors.push(...validation.errors.map((message) => message.replace(/^Entry 1:\s*/, "")));
    return errors;
  }
  function renderSavedEventCard(event) {
    const themeMeta = getEventThemeMeta(event.theme);
    const locationText = event.locationArabic || event.locationDanish ? `${event.locationArabic || "--"} / ${event.locationDanish || "--"}` : "No location / \u0628\u062F\u0648\u0646 \u0645\u0648\u0642\u0639";
    const imageMarkup = event.imageDataUrl ? `<img src="${escapeHtml(event.imageDataUrl)}" alt="${escapeHtml(event.titleDanish || event.titleArabic || "Event image")}">` : `
      <div class="saved-event-thumb-placeholder">
        <span class="saved-event-thumb-symbol">${escapeHtml(themeMeta.symbol)}</span>
        <span class="arabic">${escapeHtml(themeMeta.placeholderArabic)}</span>
        <span class="latin">${escapeHtml(themeMeta.placeholderDanish)}</span>
      </div>
    `;
    return `
    <article class="saved-event-card" data-event-id="${escapeHtml(event.id)}">
      <div class="saved-event-thumb" data-theme="${escapeHtml(themeMeta.key)}">
        ${imageMarkup}
      </div>
      <div class="saved-event-copy">
        <h4 class="saved-event-title-ar arabic">${escapeHtml(event.titleArabic)}</h4>
        <p class="saved-event-title-da latin">${escapeHtml(event.titleDanish)}</p>
        <div class="saved-event-meta">
          <span>${escapeHtml(event.date)}</span>
          <span>${escapeHtml(event.time)}</span>
          <span>${escapeHtml(locationText)}</span>
        </div>
        <div class="saved-event-badges">
          <span>${escapeHtml(themeMeta.label)}</span>
          <span class="saved-event-status ${event.active ? "is-active" : "is-inactive"}">
            ${event.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
      <div class="saved-event-actions">
        <button type="button" data-action="edit" data-event-id="${escapeHtml(event.id)}">Edit</button>
        <button type="button" data-action="duplicate" data-event-id="${escapeHtml(event.id)}">Duplicate</button>
        <button type="button" data-action="toggle" data-event-id="${escapeHtml(event.id)}">
          ${event.active ? "Hide" : "Show"}
        </button>
        <button type="button" class="button-warning" data-action="archive" data-event-id="${escapeHtml(event.id)}">Archive</button>
      </div>
    </article>
  `;
  }
  function groupArchivedPrayerTimesByMonth(rows) {
    const grouped = /* @__PURE__ */ new Map();
    rows.forEach((row) => {
      const monthKey = String(row.date ?? "").slice(0, 7);
      if (!monthKey) {
        return;
      }
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey).push(row);
    });
    return [...grouped.entries()].sort((left, right) => left[0].localeCompare(right[0]));
  }
  function renderPrayerSummary(row) {
    const summaryParts = [
      `Fajr ${row.fajr || "\u2014"}`,
      `Sunrise ${row.sunrise || "\u2014"}`,
      `Dhuhr ${row.dhuhr || "\u2014"}`,
      `Maghrib ${row.maghrib || "\u2014"}`
    ];
    if (row.sunset) {
      summaryParts.splice(3, 0, `Sunset ${row.sunset}`);
    }
    if (row.midnight) {
      summaryParts.push(`Midnight ${row.midnight}`);
    }
    if (row.asr) {
      summaryParts.push(`Asr ${row.asr}`);
    }
    if (row.isha) {
      summaryParts.push(`Isha ${row.isha}`);
    }
    return summaryParts.join(" \u2022 ");
  }
  function renderArchivedPrayerTimes() {
    const archivedPrayerTimes = getArchivedPrayerData();
    setText(elements.archivedPrayerCount, `${archivedPrayerTimes.length} rows`);
    if (archivedPrayerTimes.length === 0) {
      elements.archivedPrayerTimesList.innerHTML = `
      <div class="saved-events-empty">
        No archived prayer times are available.
      </div>
    `;
      return;
    }
    elements.archivedPrayerTimesList.innerHTML = groupArchivedPrayerTimesByMonth(archivedPrayerTimes).map(([monthKey, rows]) => `
      <section class="archived-group">
        <div class="archived-group-header">
          <div>
            <h4>${escapeHtml(monthKey)}</h4>
            <p>${rows.length} archived prayer-time rows</p>
          </div>
          <div class="saved-event-actions archived-actions">
            <button type="button" data-archived-action="restore-prayer-month" data-month="${escapeHtml(monthKey)}">Restore month</button>
            <button type="button" class="button-danger" data-archived-action="delete-prayer-month" data-month="${escapeHtml(monthKey)}">Delete month</button>
          </div>
        </div>
        <div class="archived-prayer-rows">
          ${rows.map((row) => `
            <article class="archived-prayer-row">
              <div class="archived-prayer-copy">
                <strong>${escapeHtml(row.date)}</strong>
                <p>${escapeHtml(renderPrayerSummary(row))}</p>
              </div>
              <div class="saved-event-actions archived-actions">
                <button type="button" data-archived-action="restore-prayer-date" data-date="${escapeHtml(row.date)}">Restore</button>
                <button type="button" class="button-danger" data-archived-action="delete-prayer-date" data-date="${escapeHtml(row.date)}">Delete</button>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("");
  }
  function renderArchivedEventCard(event) {
    const themeMeta = getEventThemeMeta(event.theme);
    return `
    <article class="saved-event-card archived-event-card" data-event-id="${escapeHtml(event.id)}">
      <div class="saved-event-thumb" data-theme="${escapeHtml(themeMeta.key)}">
        ${event.imageDataUrl ? `<img src="${escapeHtml(event.imageDataUrl)}" alt="${escapeHtml(event.titleDanish || event.titleArabic || "Event image")}">` : `
            <div class="saved-event-thumb-placeholder">
              <span class="saved-event-thumb-symbol">${escapeHtml(themeMeta.symbol)}</span>
              <span class="arabic">${escapeHtml(themeMeta.placeholderArabic)}</span>
              <span class="latin">${escapeHtml(themeMeta.placeholderDanish)}</span>
            </div>
          `}
      </div>
      <div class="saved-event-copy">
        <h4 class="saved-event-title-ar arabic">${escapeHtml(event.titleArabic)}</h4>
        <p class="saved-event-title-da latin">${escapeHtml(event.titleDanish)}</p>
        <div class="saved-event-meta">
          <span>${escapeHtml(event.date)}</span>
          <span>${escapeHtml(event.time)}</span>
          <span>${escapeHtml(themeMeta.label)}</span>
        </div>
      </div>
      <div class="saved-event-actions archived-actions">
        <button type="button" data-archived-action="restore-event" data-event-id="${escapeHtml(event.id)}">Restore event</button>
        <button type="button" class="button-danger" data-archived-action="delete-event" data-event-id="${escapeHtml(event.id)}">Delete forever</button>
      </div>
    </article>
  `;
  }
  function renderArchivedEvents() {
    const archivedEvents = getArchivedEventData();
    setText(elements.archivedEventCount, `${archivedEvents.length} events`);
    if (archivedEvents.length === 0) {
      elements.archivedEventsList.innerHTML = `
      <div class="saved-events-empty">
        No archived events are available.
      </div>
    `;
      return;
    }
    elements.archivedEventsList.innerHTML = archivedEvents.map((event) => renderArchivedEventCard(event)).join("");
  }
  function renderArchivedData() {
    renderArchivedPrayerTimes();
    renderArchivedEvents();
    updateArchivedToggleLabels();
    if (!state.supabaseConnected && !state.supabaseChecked) {
      setStatus(elements.archivedStatus, "Checking whether archived Supabase data is available...", "warning");
      return;
    }
    if (!state.supabaseConnected) {
      setStatus(
        elements.archivedStatus,
        "Archived data can be managed from Supabase when the deployed admin page is connected. Local archived fallback is shown if available.",
        "warning"
      );
    }
  }
  function renderSavedEvents() {
    const collection = getCurrentEventCollection();
    elements.eventDataSource.textContent = collection.source === "supabase" ? "Supabase" : collection.source === "localStorage" ? "localStorage" : "Sample data";
    if (collection.items.length === 0) {
      elements.savedEventsList.innerHTML = `
      <div class="saved-events-empty">
        No events are available yet.
      </div>
    `;
      return;
    }
    elements.savedEventsList.innerHTML = collection.items.map((event) => renderSavedEventCard(event)).join("");
  }
  async function persistEventResult(result, successMessage, remoteAction = null) {
    const remoteResult = typeof remoteAction === "function" ? await remoteAction() : {
      ok: false,
      skipped: true,
      status: 0,
      data: null,
      error: "No remote sync action was provided."
    };
    if (result.ok) {
      syncEventEditor(result.items.filter((item) => !item.archived));
      renderSavedEvents();
      refreshStatusPanel();
      setStatus(
        elements.eventsStatus,
        `Event JSON editor updated with ${result.items.filter((item) => !item.archived).length} saved event entries.`,
        "success"
      );
    }
    if (remoteResult.ok && result.ok) {
      setStatus(
        elements.eventsStatus,
        `Event JSON editor updated with ${result.items.filter((item) => !item.archived).length} saved event entries.`,
        "success"
      );
      setStatus(elements.eventFormStatus, successMessage, "success");
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
      return true;
    }
    if (remoteResult.ok) {
      setStatus(elements.eventsStatus, "Supabase was updated, but this browser could not refresh its saved event list.", "warning");
      setStatus(
        elements.eventFormStatus,
        `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
        "warning"
      );
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "warning");
      return true;
    }
    if (result.ok) {
      setStatus(elements.eventsStatus, `Event JSON editor updated in this browser only. ${APP_CONFIG.syncMessages.localOnly}`, "warning");
      setStatus(elements.eventFormStatus, `${successMessage} Saved in this browser only.`, "warning");
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
      return true;
    }
    setStatus(elements.eventsStatus, "Could not save the event locally or remotely.", "error");
    setStatus(elements.eventFormStatus, "Could not save events locally or remotely.", "error");
    setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Supabase unavailable. Events were not saved."), "error");
    return false;
  }
  async function handleEventFormSubmit(event) {
    event.preventDefault();
    const payload = getEventFormPayload();
    const errors = validateEventFormPayload(payload);
    if (errors.length > 0) {
      showEventErrors(errors);
      setStatus(elements.eventFormStatus, "Fix the highlighted event form errors before saving.", "error");
      setStatus(elements.generalStatus, "The event form contains validation errors.", "error");
      return;
    }
    clearEventErrors();
    const collection = getCurrentEventCollection();
    const result = state.editingEventId ? updateEvent(state.editingEventId, payload, collection.items) : createEvent(payload, collection.items);
    const message = state.editingEventId ? "Event updated and saved to this browser." : "Event saved to this browser.";
    const remoteEvent = result.items.find((item) => item.id === (state.editingEventId || payload.id || ""));
    const syncCandidate = remoteEvent ?? result.items[result.items.length - 1] ?? payload;
    if (await persistEventResult(result, message, () => syncEventWithRemote(syncCandidate))) {
      resetEventForm({ preserveStatus: true });
    }
  }
  function getPrayerArchiveMatcher(payload = {}) {
    const dateSet = /* @__PURE__ */ new Set();
    if (payload.date) {
      dateSet.add(String(payload.date).trim());
    }
    if (Array.isArray(payload.dates)) {
      payload.dates.forEach((dateKey) => {
        dateSet.add(String(dateKey).trim());
      });
    }
    const monthKey = String(payload.month ?? "").trim();
    return (entry) => {
      if (dateSet.size > 0) {
        return dateSet.has(entry.date);
      }
      if (monthKey) {
        return entry.date.startsWith(`${monthKey}-`);
      }
      return false;
    };
  }
  function setPrayerArchivedLocally(payload, archived) {
    const matcher = getPrayerArchiveMatcher(payload);
    const items = getStoredPrayerData({ includeArchived: true }).map((entry) => matcher(entry) ? { ...entry, archived } : entry);
    return {
      ok: savePrayerSnapshotLocally(items),
      items
    };
  }
  function permanentlyDeletePrayerEntriesLocally(payload) {
    const matcher = getPrayerArchiveMatcher(payload);
    const items = getStoredPrayerData({ includeArchived: true }).filter((entry) => !matcher(entry));
    return {
      ok: savePrayerSnapshotLocally(items),
      items
    };
  }
  async function handleArchivedPrayerAction(action, payload, successMessage) {
    const localResult = action === "restore" ? setPrayerArchivedLocally(payload, false) : permanentlyDeletePrayerEntriesLocally(payload);
    if (state.supabaseConnected) {
      const remoteResult = action === "restore" ? await restorePrayerTimesRemotely(payload) : await permanentlyDeletePrayerTimesRemotely(payload);
      if (await handleRemoteAccessFailure(remoteResult)) {
        return;
      }
      if (remoteResult.ok) {
        await refreshRemoteAdminData({ hydrateEditors: true });
        setStatus(elements.archivedStatus, successMessage, "success");
        setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
        return;
      }
      setStatus(
        elements.archivedStatus,
        `${successMessage} failed to sync. ${getRemoteFailureMessage(remoteResult, "Supabase unavailable.")}`,
        localResult.ok ? "warning" : "error"
      );
      setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Archived prayer times could not be updated."), localResult.ok ? "warning" : "error");
      return;
    }
    if (localResult.ok) {
      setStatus(elements.archivedStatus, `${successMessage} Saved in this browser only.`, "warning");
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
      return;
    }
    setStatus(elements.archivedStatus, "Archived prayer times could not be updated.", "error");
    setStatus(elements.generalStatus, "Archived prayer times could not be updated.", "error");
  }
  async function handleArchivedEventAction(action, eventId) {
    const baseEvents = getCurrentEventCollection({ includeArchived: true }).items;
    const localResult = action === "restore" ? setEventArchived(eventId, false, baseEvents) : deleteEvent(eventId, baseEvents);
    if (state.supabaseConnected) {
      const remoteResult = action === "restore" ? await restoreEventRemotely(eventId) : await permanentlyDeleteEventRemotely(eventId);
      if (await handleRemoteAccessFailure(remoteResult)) {
        return;
      }
      if (remoteResult.ok) {
        await refreshRemoteAdminData({ hydrateEditors: true });
        setStatus(
          elements.archivedStatus,
          action === "restore" ? "Archived event restored." : "Archived event permanently deleted.",
          "success"
        );
        setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
        return;
      }
      setStatus(
        elements.archivedStatus,
        getRemoteFailureMessage(remoteResult, "Archived event could not be updated in Supabase."),
        localResult.ok ? "warning" : "error"
      );
      setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Archived event could not be updated."), localResult.ok ? "warning" : "error");
      return;
    }
    if (localResult.ok) {
      syncEventEditor(localResult.items.filter((item) => !item.archived));
      renderSavedEvents();
      renderArchivedData();
      refreshStatusPanel();
      setStatus(
        elements.archivedStatus,
        action === "restore" ? "Archived event restored in this browser only." : "Archived event permanently deleted in this browser only.",
        "warning"
      );
      setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
      return;
    }
    setStatus(elements.archivedStatus, "Archived event could not be updated.", "error");
    setStatus(elements.generalStatus, "Archived event could not be updated.", "error");
  }
  async function handleSavedEventAction(event) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    const action = target.dataset.action;
    const eventId = target.dataset.eventId;
    if (!action || !eventId) {
      return;
    }
    const collection = getCurrentEventCollection();
    const selectedEvent = collection.items.find((item) => item.id === eventId);
    if (!selectedEvent) {
      setStatus(elements.eventFormStatus, "The selected event could not be found.", "error");
      return;
    }
    if (action === "edit") {
      fillEventForm(selectedEvent);
      return;
    }
    if (action === "archive") {
      if (!window.confirm("Archive this event? You can restore it later from the archived data section.")) {
        return;
      }
      const baseEvents = getCurrentEventCollection({ includeArchived: true }).items;
      const result = setEventArchived(eventId, true, baseEvents);
      if (await persistEventResult(result, "Event archived.", () => syncEventArchiveWithRemote(eventId))) {
        if (state.editingEventId === eventId) {
          resetEventForm({ preserveStatus: true });
        }
      }
      return;
    }
    if (action === "duplicate") {
      const result = duplicateEvent(eventId, collection.items);
      const duplicatedEvent = result.items.find((item) => item.id !== eventId && item.titleDanish.includes("(copy)"));
      await persistEventResult(result, "Event duplicated with a new ID.", () => syncEventWithRemote(duplicatedEvent ?? result.items[result.items.length - 1]));
      return;
    }
    if (action === "toggle") {
      const result = toggleEventActive(eventId, collection.items);
      const toggledEvent = result.items.find((item) => item.id === eventId);
      await persistEventResult(result, "Event visibility updated.", () => syncEventWithRemote(toggledEvent));
    }
  }
  async function handleArchivedPrayerListAction(event) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    const action = target.dataset.archivedAction;
    const date = target.dataset.date;
    const month = target.dataset.month;
    if (!action || !date && !month) {
      return;
    }
    if (action === "restore-prayer-date") {
      await handleArchivedPrayerAction("restore", { date }, `Prayer times for ${date} restored.`);
      return;
    }
    if (action === "restore-prayer-month") {
      await handleArchivedPrayerAction("restore", { month }, `Prayer times for ${month} restored.`);
      return;
    }
    if (action === "delete-prayer-date") {
      if (!window.confirm(`Permanently delete archived prayer times for ${date}? This cannot be undone.`)) {
        return;
      }
      await handleArchivedPrayerAction("delete", { date }, `Archived prayer times for ${date} permanently deleted.`);
      return;
    }
    if (action === "delete-prayer-month") {
      if (!window.confirm(`Permanently delete all archived prayer times for ${month}? This cannot be undone.`)) {
        return;
      }
      await handleArchivedPrayerAction("delete", { month }, `Archived prayer times for ${month} permanently deleted.`);
    }
  }
  async function handleArchivedEventListAction(event) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    const action = target.dataset.archivedAction;
    const eventId = target.dataset.eventId;
    if (!action || !eventId) {
      return;
    }
    if (action === "restore-event") {
      await handleArchivedEventAction("restore", eventId);
      return;
    }
    if (action === "delete-event") {
      if (!window.confirm("Permanently delete this archived event? This cannot be undone.")) {
        return;
      }
      await handleArchivedEventAction("delete", eventId);
    }
  }
  async function handleAdminLoginSubmit(event) {
    event.preventDefault();
    const email = String(elements.loginEmail.value ?? "").trim();
    const password = String(elements.loginPassword.value ?? "");
    if (!email || !password) {
      setStatus(elements.loginStatus, "Please enter both email and password.", "error");
      return;
    }
    showAuthLoading("Signing in to Supabase...");
    try {
      const client = await ensureAuthClient();
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        showLoginScreen("Invalid login. Please check the email and password.", "error");
        return;
      }
      elements.loginPassword.value = "";
      await resolveAdminAccess();
    } catch (error) {
      showLoginScreen(error.message || "Supabase unavailable.", "error");
    }
  }
  async function handleAdminUserFormSubmit(event) {
    event.preventDefault();
    const payload = {
      email: String(elements.adminUserEmail.value ?? "").trim(),
      password: String(elements.adminUserPassword.value ?? ""),
      role: String(elements.adminUserRole.value ?? "admin").trim()
    };
    if (!payload.email || !payload.password) {
      setStatus(elements.adminUsersStatus, "Enter both email and password for the new admin account.", "error");
      return;
    }
    setStatus(elements.adminUsersStatus, "Creating admin account...", "warning");
    const result = await createAdminUserRemotely(payload);
    if (!result.ok) {
      setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not create the admin account."), "error");
      if (result.status === 401 || result.status === 403) {
        await resolveAdminAccess();
      }
      return;
    }
    elements.adminUserForm.reset();
    elements.adminUserRole.value = "admin";
    setStatus(elements.adminUsersStatus, result.data?.message || "Admin account created.", "success");
    await refreshAdminUsers();
  }
  async function handleAdminUsersListAction(event) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }
    const action = target.dataset.adminAction;
    const userId = target.dataset.userId;
    if (!action || !userId) {
      return;
    }
    if (action === "save-role") {
      const role = getSelectedRoleForUser(userId);
      setStatus(elements.adminUsersStatus, "Saving admin role...", "warning");
      const result = await updateAdminUserRoleRemotely({ id: userId, role });
      if (!result.ok) {
        setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not update the admin role."), "error");
        if (result.status === 401 || result.status === 403) {
          await resolveAdminAccess();
        }
        return;
      }
      setStatus(elements.adminUsersStatus, "Admin role updated.", "success");
      await resolveAdminAccess();
      return;
    }
    if (action === "disable") {
      if (!window.confirm("Disable this admin account? They will no longer be able to use /admin.")) {
        return;
      }
      setStatus(elements.adminUsersStatus, "Disabling admin account...", "warning");
      const result = await disableAdminUserRemotely(userId);
      if (!result.ok) {
        setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not disable the admin account."), "error");
        if (result.status === 401 || result.status === 403) {
          await resolveAdminAccess();
        }
        return;
      }
      setStatus(elements.adminUsersStatus, "Admin account disabled.", "success");
      await resolveAdminAccess();
      return;
    }
    if (action === "delete") {
      if (!window.confirm("Permanently delete this disabled admin account? This cannot be undone.")) {
        return;
      }
      setStatus(elements.adminUsersStatus, "Deleting admin account...", "warning");
      const result = await deleteAdminUserRemotely(userId, { permanent: true });
      if (!result.ok) {
        setStatus(elements.adminUsersStatus, getRemoteFailureMessage(result, "Could not delete the admin account."), "error");
        if (result.status === 401 || result.status === 403) {
          await resolveAdminAccess();
        }
        return;
      }
      setStatus(elements.adminUsersStatus, result.data?.message || "Admin account deleted.", "success");
      await resolveAdminAccess();
    }
  }
  function bindEvents() {
    elements.loginForm.addEventListener("submit", (event) => {
      void handleAdminLoginSubmit(event);
    });
    elements.logoutButton.addEventListener("click", () => {
      void signOutAdmin();
    });
    elements.accessDeniedLogout.addEventListener("click", () => {
      void signOutAdmin("Signed out after access denial.", "warning");
    });
    elements.adminUserForm.addEventListener("submit", (event) => {
      void handleAdminUserFormSubmit(event);
    });
    elements.refreshAdminUsers.addEventListener("click", () => {
      void refreshAdminUsers();
    });
    elements.adminUsersList.addEventListener("click", (event) => {
      void handleAdminUsersListAction(event);
    });
    elements.loadSampleData.addEventListener("click", () => {
      clearImagePreview();
      loadSampleDataIntoEditors();
      populateImportSample();
      renderSavedEvents();
      resetEventForm({ preserveStatus: true });
      setStatus(elements.eventsStatus, "Sample events loaded into the JSON fallback editor. Save if you want to replace local events.", "warning");
      setStatus(elements.prayerTimesStatus, "Sample prayer times loaded into the manual JSON editor.", "warning");
      setStatus(elements.generalStatus, "Sample data loaded into the import and editor sections. Nothing has been saved yet.", "warning");
    });
    elements.toggleManualEntry.addEventListener("click", () => {
      toggleManualSection();
    });
    elements.toggleEventJsonEntry.addEventListener("click", () => {
      toggleEventJsonSection();
    });
    elements.validatePrayerTimes.addEventListener("click", () => {
      const validated = validatePrayerTextarea();
      if (validated) {
        setStatus(elements.generalStatus, "Manual prayer-time JSON is valid and ready to save.", "success");
      }
    });
    elements.savePrayerTimes.addEventListener("click", () => {
      const normalized = validatePrayerTextarea();
      if (!normalized) {
        setStatus(elements.generalStatus, "Manual prayer-time JSON could not be saved because validation failed.", "error");
        return;
      }
      void (async () => {
        const persistence = await persistPrayerDataset(
          normalized,
          `Saved ${normalized.length} prayer-time days.`
        );
        setStatus(elements.prayerTimesStatus, persistence.detail, persistence.tone);
        setStatus(elements.generalStatus, persistence.general, persistence.ok ? persistence.tone : "error");
      })();
    });
    elements.validateEvents.addEventListener("click", () => {
      const validated = validateEventTextarea();
      if (validated) {
        setStatus(elements.generalStatus, "Event JSON is valid and ready to save.", "success");
      }
    });
    elements.saveEvents.addEventListener("click", () => {
      const normalized = validateEventTextarea();
      if (!normalized) {
        setStatus(elements.generalStatus, "Event JSON could not be saved because validation failed.", "error");
        return;
      }
      const localSaved = saveEvents(buildEventStorageSnapshot(normalized));
      if (localSaved) {
        syncEventEditor(normalized);
        renderSavedEvents();
        refreshStatusPanel();
      }
      void (async () => {
        const remoteResult = await syncEventCollectionWithRemote(normalized);
        if (remoteResult.ok && localSaved) {
          setStatus(elements.eventsStatus, `Saved ${normalized.length} events locally and to Supabase.`, "success");
          setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
          return;
        }
        if (remoteResult.ok) {
          setStatus(elements.eventsStatus, `Saved ${normalized.length} events to Supabase, but this browser copy could not be updated.`, "warning");
          setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "warning");
          return;
        }
        if (localSaved) {
          setStatus(elements.eventsStatus, `Saved ${normalized.length} events in this browser only.`, "warning");
          setStatus(elements.generalStatus, APP_CONFIG.syncMessages.localOnly, "warning");
          return;
        }
        setStatus(elements.eventsStatus, "Could not save events locally or remotely.", "error");
        setStatus(elements.generalStatus, getRemoteFailureMessage(remoteResult, "Supabase unavailable. Events were not saved."), "error");
      })();
    });
    elements.themeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        applyTheme(input.value);
        setStatus(elements.themeStatus, `Theme selected: ${getThemeLabel(input.value)}. Click Save theme to store it.`, "warning");
      });
    });
    elements.saveTheme.addEventListener("click", () => {
      const selectedTheme = elements.themeInputs.find((input) => input.checked)?.value ?? APP_CONFIG.defaultTheme;
      if (!saveThemeToStorage(selectedTheme)) {
        setStatus(elements.themeStatus, "Could not save the theme to localStorage in this browser.", "error");
        setStatus(elements.generalStatus, "Theme was not saved.", "error");
        return;
      }
      applyTheme(selectedTheme);
      refreshStatusPanel();
      setStatus(elements.themeStatus, `Theme saved as ${getThemeLabel(selectedTheme)}.`, "success");
      setStatus(elements.generalStatus, "Theme saved. index.html will use the selected theme in this browser.", "success");
    });
    elements.imageInput.addEventListener("change", handleImageSelection);
    elements.runOcrButton.addEventListener("click", () => {
      runOcrForCurrentImage();
    });
    elements.importTextInput.addEventListener("input", () => {
      updatePreviewActionState();
      if (state.previewRows.length > 0) {
        setStatus(elements.parseStatus, "Timetable text changed. Click Parse timetable or Re-parse text to refresh the preview.", "warning");
      }
    });
    elements.useSampleImportText.addEventListener("click", () => {
      populateImportSample();
      setStatus(elements.generalStatus, "Sample timetable text loaded. Review the preview before saving.", "warning");
    });
    elements.parseTimetable.addEventListener("click", () => {
      parseImportText();
    });
    elements.reparsePreview.addEventListener("click", () => {
      parseImportText();
    });
    elements.autoFixImportText.addEventListener("click", () => {
      autoFixImportText();
    });
    elements.clearPreview.addEventListener("click", () => {
      clearPreviewState({ preserveSkippedLines: true });
    });
    elements.previewTableContainer.addEventListener("input", updatePreviewCell);
    elements.previewTableContainer.addEventListener("change", updatePreviewCell);
    elements.saveImportedPrayerTimes.addEventListener("click", () => {
      saveImportedPrayerRows();
    });
    elements.eventTheme.addEventListener("change", () => {
      setEventPlaceholderTheme(elements.eventTheme.value);
    });
    elements.eventImageInput.addEventListener("change", () => {
      handleEventImageSelection();
    });
    elements.eventForm.addEventListener("submit", handleEventFormSubmit);
    elements.eventCancelEdit.addEventListener("click", () => {
      resetEventForm({ preserveStatus: true });
      setStatus(elements.eventFormStatus, "Edit cancelled. The form is ready for a new event.", "warning");
    });
    elements.savedEventsList.addEventListener("click", handleSavedEventAction);
    elements.toggleArchivedPrayerTimes.addEventListener("click", () => {
      elements.archivedPrayerTimesSection.hidden = !elements.archivedPrayerTimesSection.hidden;
      updateArchivedToggleLabels();
    });
    elements.toggleArchivedEvents.addEventListener("click", () => {
      elements.archivedEventsSection.hidden = !elements.archivedEventsSection.hidden;
      updateArchivedToggleLabels();
    });
    elements.archivedPrayerTimesList.addEventListener("click", (event) => {
      void handleArchivedPrayerListAction(event);
    });
    elements.archivedEventsList.addEventListener("click", (event) => {
      void handleArchivedEventListAction(event);
    });
    elements.clearPrayerTimes.addEventListener("click", () => {
      if (!clearStoredPrayerTimes()) {
        setStatus(elements.dangerStatus, "Could not clear saved prayer times in this browser.", "error");
        return;
      }
      elements.prayerTimesInput.value = prettyJson(
        state.supabaseConnected && state.remoteAdminDataLoaded ? state.remotePrayerTimes : SAMPLE_PRAYER_TIMES
      );
      setStatus(elements.prayerTimesStatus, "Saved prayer times cleared. The manual JSON editor now shows sample data.", "warning");
      setStatus(
        elements.importSaveStatus,
        state.supabaseConnected ? "Saved prayer times cleared in this browser. Deployed screens can still read the shared Supabase data." : "Saved prayer times cleared. The display will use sample fallback data until you save new rows.",
        "warning"
      );
      setStatus(elements.dangerStatus, "Saved prayer times cleared from this browser.", "warning");
      setStatus(
        elements.generalStatus,
        state.supabaseConnected ? "Local prayer cache cleared. Supabase remains connected for shared screen updates." : "Saved prayer times cleared. index.html will fall back to sample prayer data.",
        "warning"
      );
      renderArchivedData();
      refreshStatusPanel();
    });
    elements.clearEvents.addEventListener("click", () => {
      if (!clearStoredEvents()) {
        setStatus(elements.dangerStatus, "Could not clear saved events in this browser.", "error");
        return;
      }
      syncEventEditor(
        state.supabaseConnected && state.remoteAdminDataLoaded ? state.remoteEvents : SAMPLE_EVENTS
      );
      renderSavedEvents();
      resetEventForm({ preserveStatus: true });
      setStatus(elements.eventsStatus, "Saved events cleared. The JSON fallback editor now shows sample events.", "warning");
      setStatus(elements.dangerStatus, "Saved events cleared from this browser.", "warning");
      setStatus(
        elements.generalStatus,
        state.supabaseConnected ? "Local event cache cleared. Supabase remains connected for shared screen updates." : "Saved events cleared. index.html will fall back to sample events if needed.",
        "warning"
      );
      renderArchivedData();
      refreshStatusPanel();
    });
    elements.clearLocalData.addEventListener("click", () => {
      if (!clearStoredDisplayData()) {
        setStatus(elements.dangerStatus, "Could not reset localStorage in this browser.", "error");
        return;
      }
      applyTheme(APP_CONFIG.defaultTheme);
      clearImagePreview();
      populateEditors();
      setDefaultImportPeriod();
      elements.importTextInput.value = "";
      state.previewRows = [];
      renderSkippedLines([]);
      renderPreviewTable();
      refreshPreviewValidation();
      renderSavedEvents();
      resetEventForm({ preserveStatus: true });
      setStatus(elements.prayerTimesStatus, "Saved prayer times cleared. The manual JSON editor now shows sample data.", "warning");
      setStatus(elements.eventsStatus, "Saved events cleared. The editor now shows sample events.", "warning");
      setStatus(elements.themeStatus, "Saved theme cleared. The display will fall back to teal.", "warning");
      setStatus(elements.dangerStatus, "All saved local data cleared from this browser.", "warning");
      setStatus(
        elements.generalStatus,
        state.supabaseConnected ? "Local browser data cleared. Deployed screens can still read shared Supabase data." : "Saved browser data cleared. index.html will now fall back to sample data.",
        "warning"
      );
      renderArchivedData();
      refreshStatusPanel();
    });
  }
  async function initAdmin() {
    populateMonthOptions();
    setDefaultImportPeriod();
    applyTheme(getThemeFromStorage());
    populateEditors();
    refreshStatusPanel();
    setGeneralReadyState();
    toggleManualSection(false);
    toggleEventJsonSection(false);
    elements.archivedPrayerTimesSection.hidden = true;
    elements.archivedEventsSection.hidden = true;
    renderPreviewTable();
    renderSavedEvents();
    renderArchivedData();
    renderAdminUsers();
    resetEventForm({ preserveStatus: true });
    bindEvents();
    state.dashboardInitialized = true;
    syncRemoteAuthProvider();
    try {
      const client = await ensureAuthClient();
      client.auth.onAuthStateChange((_event, session) => {
        state.authSession = session ?? null;
        syncRemoteAuthProvider();
        if (!session) {
          state.adminProfile = null;
          state.adminUsers = [];
          state.supabaseConnected = false;
          state.supabaseChecked = false;
          state.remoteAdminDataLoaded = false;
          renderAdminSummaryReset();
          const logoutMessage = state.pendingLogoutMessage || "Please log in to continue.";
          const logoutTone = state.pendingLogoutMessage ? state.pendingLogoutTone : "warning";
          state.pendingLogoutMessage = "";
          state.pendingLogoutTone = "success";
          showLoginScreen(logoutMessage, logoutTone);
          return;
        }
        if (state.authResolved) {
          void resolveAdminAccess();
        }
      });
    } catch (error) {
      showLoginScreen(error.message || "Supabase unavailable.", "error");
      return;
    }
    await resolveAdminAccess();
  }
  void initAdmin();
})();
