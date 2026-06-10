(function () {
  const __modules = Object.create(null);

  __modules["./config.js"] = (() => {
    const APP_CONFIG = {
      timezone: "Europe/Copenhagen",
      defaultTheme: "teal",
      prayerDisplayMode: "imamAliCopenhagen",
      themes: {
        teal: {
          label: "Teal",
          labelArabic: "الفيروزي",
          logo: "assets/logo-teal.png",
        },
        muharram: {
          label: "Muharram",
          labelArabic: "محرم",
          logo: "assets/logo-red.png",
        },
      },
      eventCategories: {
        normal: {
          label: "Normal",
          labelArabic: "عادي",
          labelDanish: "Normal",
          placeholderArabic: "فعالية المسجد",
          placeholderDanish: "Moské-arrangement",
          symbol: "N",
          displayThemes: ["teal"],
        },
        muharram: {
          label: "Muharram",
          labelArabic: "محرم",
          labelDanish: "Muharram",
          placeholderArabic: "فعالية محرم",
          placeholderDanish: "Muharram-arrangement",
          symbol: "M",
          displayThemes: ["muharram"],
        },
        ramadan: {
          label: "Ramadan",
          labelArabic: "رمضان",
          labelDanish: "Ramadan",
          placeholderArabic: "برنامج رمضان",
          placeholderDanish: "Ramadan-program",
          symbol: "R",
          displayThemes: ["teal"],
        },
        eid: {
          label: "Eid",
          labelArabic: "عيد",
          labelDanish: "Eid",
          placeholderArabic: "فعالية العيد",
          placeholderDanish: "Eid-arrangement",
          symbol: "E",
          displayThemes: ["teal"],
        },
        majlis: {
          label: "Majlis",
          labelArabic: "مجلس",
          labelDanish: "Majlis",
          placeholderArabic: "مجلس",
          placeholderDanish: "Majlis",
          symbol: "J",
          displayThemes: ["teal", "muharram"],
        },
        friday: {
          label: "Friday prayer",
          labelArabic: "الجمعة",
          labelDanish: "Fredagsbøn",
          placeholderArabic: "صلاة الجمعة",
          placeholderDanish: "Fredagsbøn",
          symbol: "F",
          displayThemes: ["teal"],
        },
      },
      storageKeys: {
        prayerTimes: "imamAliDisplay.prayerTimes",
        events: "imamAliDisplay.events",
        theme: "imamAliDisplay.theme",
      },
      prayerFields: ["fajr", "sunrise", "dhuhr", "asr", "sunset", "maghrib", "isha", "midnight"],
      prayerDisplayModes: {
        standard: {
          order: ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"],
          countdownOrder: ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"],
          labels: {
            fajr: { arabic: "الفجر", danish: "Fajr" },
            sunrise: { arabic: "الشروق", danish: "Solopgang" },
            dhuhr: { arabic: "الظهر", danish: "Middag" },
            asr: { arabic: "العصر", danish: "Eftermiddag" },
            maghrib: { arabic: "المغرب", danish: "Maghrib" },
            isha: { arabic: "العشاء", danish: "Nat" },
          },
        },
        imamAliCopenhagen: {
          order: ["fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"],
          countdownOrder: ["fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"],
          labels: {
            fajr: { arabic: "الصبح", danish: "Subh" },
            sunrise: { arabic: "الشروق", danish: "Solopgang" },
            dhuhr: { arabic: "الظهر", danish: "Dhuhr" },
            sunset: { arabic: "الغروب", danish: "Solnedgang" },
            maghrib: { arabic: "المغرب", danish: "Maghrib" },
            midnight: { arabic: "منتصف الليل", danish: "Midnat" },
          },
        },
      },
      prayerMeta: {
        fajr: { icon: "moon" },
        sunrise: { icon: "sunrise" },
        dhuhr: { icon: "sun" },
        asr: { icon: "asr" },
        sunset: { icon: "sunset" },
        maghrib: { icon: "sunset" },
        isha: { icon: "night" },
        midnight: { icon: "midnight" },
      },
      samplePaths: {
        prayerTimes: "data/prayer-times.sample.json",
        events: "data/events.sample.json",
      },
      apiPaths: {
        todayPrayerTimes: "/.netlify/functions/get-today-prayer-times",
        upcomingEvent: "/.netlify/functions/get-upcoming-event",
        savePrayerTimes: "/.netlify/functions/save-prayer-times",
        saveEvent: "/.netlify/functions/save-event",
        deleteEvent: "/.netlify/functions/delete-event",
      },
      syncMessages: {
        connected: "Connected to Supabase. Updates will sync to mosque screens.",
        localOnly: "Saved locally only. This will not update other screens until Supabase is connected.",
        saveError: "Error saving to Supabase. Please check Netlify environment variables.",
        unavailable: "Supabase unavailable. Changes are saved locally only.",
      },
      footerMessages: {
        teal: {
          arabic: "مرحباً بكم - نسعد بزيارتكم",
          danish: "Alle er velkomne - Vi glæder os til at se dig",
        },
        muharram: {
          arabic: "السلام عليك يا أبا عبد الله الحسين",
          danish: "Fred være med dig, o Abu Abdullah al-Hussein",
        },
      },
      bannerContexts: {
        teal: {
          arabic: "صلاة الجمعة",
          danish: "Fredagsbøn",
          metaArabic: "الجمعة - 13:30",
          metaDanish: "Fredag - 13:30",
          tagArabic: "البرنامج الأسبوعي",
          tagDanish: "Weekly program",
        },
        muharram: {
          arabic: "شهر محرم الحرام",
          danish: "Muharram 1448",
          metaArabic: "برنامج المجالس والفعاليات",
          metaDanish: "Majalis og særlige begivenheder",
          tagArabic: "محرم",
          tagDanish: "Muharram",
        },
      },
      headlineFallbacks: {
        teal: {
          titleArabic: "صلاة الجمعة",
          titleDanish: "Fredagsbøn (Jumu'ah)",
          descriptionArabic: "جدول اليوم معروض مباشرة من شاشة المسجد",
          descriptionDanish: "Dagens skema vises direkte på moskéens skærm",
          tagArabic: "البرنامج اليومي",
          tagDanish: "Dagsprogram",
        },
        muharram: {
          titleArabic: "شهر محرم الحرام",
          titleDanish: "Muharram al-Haram",
          descriptionArabic: "نسخة محرم المهيأة للمجالس والفعاليات الخاصة",
          descriptionDanish: "Muharram-version klargjort til majalis og særlige arrangementer",
          tagArabic: "محرم 1448",
          tagDanish: "Muharram 1448",
        },
      },
      noticeMessages: {
        teal: {
          titleArabic: "ابقَ على اطلاع",
          titleDanish: "Hold dig opdateret",
          bodyArabic: "تابع الأحداث القادمة على موقعنا ووسائل التواصل الاجتماعي.",
          bodyDanish: "Følg med i kommende begivenheder på vores hjemmeside og sociale medier.",
        },
        muharram: {
          titleArabic: "ذكرى محرم",
          titleDanish: "Muharram påmindelse",
          bodyArabic: "نسخة محرم مهيأة للمجالس والفعاليات الخاصة وإحياء الذكرى.",
          bodyDanish: "Muharram-layoutet er klargjort til majalis og særlige mindehøjtideligheder.",
        },
      },
      prayerMessages: {
        missingToday: {
          arabic: "بيانات اليوم غير متوفرة",
          danish: "Dagens bønnetider mangler",
        },
        missingTodayDetail: {
          arabic: "لا توجد مواقيت محفوظة لتاريخ اليوم.",
          danish: "Der findes ingen gemte bønnetider for dagens dato.",
        },
        dayCompleted: {
          arabic: "انتهت صلوات اليوم",
          danish: "Dagens bønner er afsluttet",
        },
        countdownUnavailable: {
          arabic: "--س --د --ث",
          danish: "--t --m --s",
        },
        invalidTime: {
          arabic: "وقت غير صالح",
          danish: "Ugyldig tid",
        },
      },
      eventMessages: {
        noneUpcoming: {
          arabic: "لا توجد فعاليات قادمة حالياً",
          danish: "Der er ingen kommende begivenheder lige nu",
        },
        noneUpcomingDetail: {
          arabic: "سيتم عرض الفعالية التالية عند إضافتها وتفعيلها.",
          danish: "Den næste begivenhed vises her, når den er tilføjet og aktiv.",
        },
      },
    };
    
    const SAMPLE_PRAYER_TIMES = [
      {
        date: "2026-06-09",
        hijriDateArabic: "23 ذو الحجة 1447 هـ",
        hijriDateLatin: "23 Dhu al-Hijjah 1447 H",
        fajr: "02:29",
        sunrise: "04:28",
        dhuhr: "13:09",
        asr: "17:39",
        sunset: "21:11",
        maghrib: "21:51",
        isha: "23:43",
        midnight: "23:50",
      },
      {
        date: "2026-06-10",
        hijriDateArabic: "24 ذو الحجة 1447 هـ",
        hijriDateLatin: "24 Dhu al-Hijjah 1447 H",
        fajr: "02:28",
        sunrise: "04:27",
        dhuhr: "13:09",
        asr: "17:40",
        sunset: "21:12",
        maghrib: "21:52",
        isha: "23:44",
        midnight: "23:51",
      },
      {
        date: "2026-06-11",
        hijriDateArabic: "25 ذو الحجة 1447 هـ",
        hijriDateLatin: "25 Dhu al-Hijjah 1447 H",
        fajr: "02:27",
        sunrise: "04:27",
        dhuhr: "13:09",
        asr: "17:40",
        sunset: "21:13",
        maghrib: "21:53",
        isha: "23:45",
        midnight: "23:52",
      },
      {
        date: "2026-06-12",
        hijriDateArabic: "26 ذو الحجة 1447 هـ",
        hijriDateLatin: "26 Dhu al-Hijjah 1447 H",
        fajr: "02:26",
        sunrise: "04:26",
        dhuhr: "13:10",
        asr: "17:41",
        sunset: "21:14",
        maghrib: "21:54",
        isha: "23:46",
        midnight: "23:53",
      },
      {
        date: "2026-06-13",
        hijriDateArabic: "27 ذو الحجة 1447 هـ",
        hijriDateLatin: "27 Dhu al-Hijjah 1447 H",
        fajr: "02:25",
        sunrise: "04:26",
        dhuhr: "13:10",
        asr: "17:41",
        sunset: "21:15",
        maghrib: "21:55",
        isha: "23:47",
        midnight: "23:54",
      },
      {
        date: "2026-06-14",
        hijriDateArabic: "28 ذو الحجة 1447 هـ",
        hijriDateLatin: "28 Dhu al-Hijjah 1447 H",
        fajr: "02:24",
        sunrise: "04:26",
        dhuhr: "13:10",
        asr: "17:42",
        sunset: "21:16",
        maghrib: "21:56",
        isha: "23:48",
        midnight: "23:55",
      },
      {
        date: "2026-06-15",
        hijriDateArabic: "29 ذو الحجة 1447 هـ",
        hijriDateLatin: "29 Dhu al-Hijjah 1447 H",
        fajr: "02:24",
        sunrise: "04:26",
        dhuhr: "13:10",
        asr: "17:42",
        sunset: "21:17",
        maghrib: "21:57",
        isha: "23:48",
        midnight: "23:56",
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
        midnight: "23:50",
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
        midnight: "23:50",
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
        midnight: "23:50",
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
        midnight: "23:50",
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
        midnight: "23:49",
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
        midnight: "23:49",
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
        midnight: "23:49",
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
        midnight: "23:48",
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
        midnight: "23:48",
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
        midnight: "23:48",
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
        midnight: "23:47",
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
        midnight: "23:47",
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
        midnight: "23:46",
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
        midnight: "23:46",
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
        midnight: "23:45",
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
        midnight: "23:44",
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
        midnight: "23:44",
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
        midnight: "23:43",
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
        midnight: "23:42",
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
        midnight: "23:42",
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
        midnight: "23:41",
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
        midnight: "23:40",
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
        midnight: "23:39",
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
        midnight: "23:39",
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
        midnight: "23:38",
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
        midnight: "23:37",
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
        midnight: "23:36",
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
        midnight: "23:35",
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
        midnight: "23:34",
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
        midnight: "23:33",
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
        midnight: "23:32",
      },
    ];
    
    const SAMPLE_EVENTS = [
      {
        id: "event-001",
        titleArabic: "صلاة الجمعة",
        titleDanish: "Fredagsbøn (Jumu'ah)",
        date: "2026-06-12",
        time: "13:30",
        locationArabic: "الجامع الرئيسي",
        locationDanish: "Hovedmoskeen",
        descriptionArabic: "مرحباً بكم - نسعد بزيارتكم",
        descriptionDanish: "Alle er velkomne - Vi glæder os til at se dig",
        theme: "friday",
        active: true,
      },
      {
        id: "event-002",
        titleArabic: "مجلس الليلة الأولى من محرم",
        titleDanish: "Majlis – første aften af Muharram",
        date: "2026-06-13",
        time: "19:30",
        locationArabic: "الجامع الرئيسي",
        locationDanish: "Hovedmoskeen",
        descriptionArabic: "ذكرى استشهاد الإمام الحسين عليه السلام",
        descriptionDanish: "Mindehøjtidelighed for Imam Hussein",
        theme: "muharram",
        active: true,
      },
    ];

    return { APP_CONFIG, SAMPLE_PRAYER_TIMES, SAMPLE_EVENTS };
  })();

  __modules["./remote-data.js"] = (() => {
    const { APP_CONFIG } = __modules["./config.js"];
    function canUseRemoteFunctions() {
      return typeof window !== "undefined"
        && window.location.protocol !== "file:"
        && typeof fetch === "function";
    }
    
    function buildJsonHeaders(headers = {}) {
      return {
        Accept: "application/json",
        ...headers,
      };
    }
    
    async function requestJson(url, options = {}) {
      if (!canUseRemoteFunctions()) {
        return {
          ok: false,
          skipped: true,
          status: 0,
          data: null,
          error: "Remote functions are unavailable in direct file-open mode.",
        };
      }
    
      const requestOptions = {
        cache: "no-store",
        ...options,
        headers: buildJsonHeaders(options.headers),
      };
    
      if (options.body && typeof options.body !== "string") {
        requestOptions.body = JSON.stringify(options.body);
        requestOptions.headers = buildJsonHeaders({
          "Content-Type": "application/json",
          ...options.headers,
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
          error: response.ok ? "" : String(data?.error ?? data?.details ?? `HTTP ${response.status}`),
        };
      } catch (error) {
        return {
          ok: false,
          skipped: false,
          status: 0,
          data: null,
          error: error.message,
        };
      }
    }
    
    function getRemoteFailureMessage(result, fallbackMessage = APP_CONFIG.syncMessages.unavailable) {
      if (result?.skipped) {
        return APP_CONFIG.syncMessages.localOnly;
      }
    
      if (result?.status === 503) {
        return APP_CONFIG.syncMessages.saveError;
      }
    
      if (result?.error) {
        return `${fallbackMessage} ${result.error}`.trim();
      }
    
      return fallbackMessage;
    }
    
    async function loadPrayerTimesFromRemote(dateKey) {
      const query = dateKey ? `?date=${encodeURIComponent(dateKey)}` : "";
      return requestJson(`${APP_CONFIG.apiPaths.todayPrayerTimes}${query}`);
    }
    
    async function loadUpcomingEventFromRemote() {
      return requestJson(APP_CONFIG.apiPaths.upcomingEvent);
    }
    
    async function savePrayerTimesRemotely(items) {
      return requestJson(APP_CONFIG.apiPaths.savePrayerTimes, {
        method: "POST",
        body: { items },
      });
    }
    
    async function saveEventRemotely(event) {
      return requestJson(APP_CONFIG.apiPaths.saveEvent, {
        method: "POST",
        body: event,
      });
    }
    
    async function deleteEventRemotely(eventId) {
      return requestJson(APP_CONFIG.apiPaths.deleteEvent, {
        method: "POST",
        body: { id: eventId },
      });
    }
    
    async function checkSupabaseConnection() {
      const result = await loadUpcomingEventFromRemote();
      if (result.ok) {
        return {
          connected: true,
          message: APP_CONFIG.syncMessages.connected,
          detail: "Supabase",
        };
      }
    
      return {
        connected: false,
        message: result.status === 503
          ? APP_CONFIG.syncMessages.saveError
          : APP_CONFIG.syncMessages.unavailable,
        detail: result.skipped ? "localStorage fallback" : "localStorage fallback",
        error: result.error,
      };
    }

    return { getRemoteFailureMessage, loadPrayerTimesFromRemote, loadUpcomingEventFromRemote, savePrayerTimesRemotely, saveEventRemotely, deleteEventRemotely, checkSupabaseConnection };
  })();

  __modules["./storage.js"] = (() => {
    const { APP_CONFIG } = __modules["./config.js"];
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

    return { getPrayerTimesFromStorage, savePrayerTimesToStorage, getEventsFromStorage, saveEventsToStorage, getThemeFromStorage, saveThemeToStorage, clearStoredDisplayData, hasLocalStorageSupport, clearStoredPrayerTimes, clearStoredEvents, clearStoredTheme };
  })();

  __modules["./events.js"] = (() => {
    const { APP_CONFIG, SAMPLE_EVENTS } = __modules["./config.js"];
    const { loadUpcomingEventFromRemote } = __modules["./remote-data.js"];
    const { getEventsFromStorage, saveEventsToStorage } = __modules["./storage.js"];
    const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
    const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const IMAGE_DATA_URL_PATTERN = /^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/i;
    
    const FALLBACK_EVENT_CATEGORIES = {
      normal: {
        label: "Normal",
        labelArabic: "عادي",
        labelDanish: "Normal",
        placeholderArabic: "فعالية المسجد",
        placeholderDanish: "Moské-arrangement",
        symbol: "N",
        displayThemes: ["teal"],
      },
      muharram: {
        label: "Muharram",
        labelArabic: "محرم",
        labelDanish: "Muharram",
        placeholderArabic: "فعالية محرم",
        placeholderDanish: "Muharram-arrangement",
        symbol: "M",
        displayThemes: ["muharram"],
      },
      ramadan: {
        label: "Ramadan",
        labelArabic: "رمضان",
        labelDanish: "Ramadan",
        placeholderArabic: "برنامج رمضان",
        placeholderDanish: "Ramadan-program",
        symbol: "R",
        displayThemes: ["teal"],
      },
      eid: {
        label: "Eid",
        labelArabic: "عيد",
        labelDanish: "Eid",
        placeholderArabic: "فعالية العيد",
        placeholderDanish: "Eid-arrangement",
        symbol: "E",
        displayThemes: ["teal"],
      },
      majlis: {
        label: "Majlis",
        labelArabic: "مجلس",
        labelDanish: "Majlis",
        placeholderArabic: "مجلس",
        placeholderDanish: "Majlis",
        symbol: "J",
        displayThemes: ["teal", "muharram"],
      },
      friday: {
        label: "Friday prayer",
        labelArabic: "الجمعة",
        labelDanish: "Fredagsbøn",
        placeholderArabic: "صلاة الجمعة",
        placeholderDanish: "Fredagsbøn",
        symbol: "F",
        displayThemes: ["teal"],
      },
    };
    
    const LEGACY_THEME_MAP = {
      teal: "normal",
      muharram: "muharram",
    };
    
    function getEventCategories() {
      return APP_CONFIG.eventCategories ?? FALLBACK_EVENT_CATEGORIES;
    }
    
    function pad(value) {
      return String(value).padStart(2, "0");
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
      return (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      );
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
        createdAt: normalizeIsoTimestamp(event.createdAt),
        updatedAt: normalizeIsoTimestamp(event.updatedAt),
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
    
    function sanitizeEventsArray(input) {
      if (!Array.isArray(input)) {
        return [];
      }
    
      const byId = new Map();
      input.forEach((event, index) => {
        const sanitized = sanitizeEventEntry(event, index);
        if (sanitized) {
          byId.set(sanitized.id, sanitized);
        }
      });
    
      return sortEventsByDateTime([...byId.values()]);
    }
    
    function normalizeEventPayload(payload) {
      if (Array.isArray(payload)) {
        return payload;
      }
    
      if (Array.isArray(payload?.items)) {
        return payload.items;
      }
    
      if (Array.isArray(payload?.events)) {
        return payload.events;
      }
    
      if (payload?.upcomingEvent && typeof payload.upcomingEvent === "object") {
        return [payload.upcomingEvent];
      }
    
      if (payload && typeof payload === "object" && "id" in payload) {
        return [payload];
      }
    
      return [];
    }
    
    async function fetchEventsJson(url) {
      if (typeof window === "undefined" || window.location.protocol === "file:" || typeof fetch !== "function") {
        return [];
      }
    
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          return [];
        }
    
        const payload = await response.json();
        return sanitizeEventsArray(normalizeEventPayload(payload));
      } catch (error) {
        return [];
      }
    }
    
    async function loadSampleEventsFromFile() {
      return fetchEventsJson(APP_CONFIG.samplePaths.events);
    }
    
    async function loadEventsFromFunction() {
      const result = await loadUpcomingEventFromRemote();
      if (!result.ok) {
        return null;
      }
    
      return sanitizeEventsArray(normalizeEventPayload(result.data));
    }
    
    function buildStoredEvent(eventData = {}, existingEvent = null) {
      const nowIso = new Date().toISOString();
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
        createdAt: existingEvent?.createdAt || normalizeIsoTimestamp(eventData.createdAt) || nowIso,
        updatedAt: nowIso,
      };
    }
    
    function withSavedEvents(items) {
      return {
        ok: saveEvents(items),
        items,
      };
    }
    
    function getEventThemeMeta(theme) {
      const safeTheme = getSafeThemeKey(theme);
      return {
        key: safeTheme,
        ...getEventCategories()[safeTheme],
      };
    }
    
    function eventMatchesDisplayTheme(event, displayTheme = APP_CONFIG.defaultTheme) {
      const eventTheme = getEventThemeMeta(event?.theme);
      return eventTheme.displayThemes.includes(displayTheme);
    }
    
    function getEventDateTime(event) {
      const safeDate = normalizeString(event?.date);
      const safeTime = normalizeString(event?.time);
      if (!isValidDateKey(safeDate) || !isValidTimeString(safeTime)) {
        return new Date(0);
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
          normalized: [],
        };
      }
    
      const errors = [];
      const normalized = input.map((event, index) => normalizeEventEntry(event, index));
      const duplicateIds = new Map();
    
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
        normalized: sortEventsByDateTime(normalized),
      };
    }
    
    async function loadEvents() {
      const functionEvents = await loadEventsFromFunction();
      if (functionEvents !== null) {
        return { items: functionEvents, source: "supabase-function" };
      }
    
      const storedEvents = sanitizeEventsArray(getEventsFromStorage());
      if (storedEvents.length > 0) {
        return { items: storedEvents, source: "localStorage" };
      }
    
      const fileEvents = await loadSampleEventsFromFile();
      if (fileEvents.length > 0) {
        return { items: fileEvents, source: "sample-file" };
      }
    
      return {
        items: sanitizeEventsArray(SAMPLE_EVENTS),
        source: "inline-sample",
      };
    }
    
    function getUpcomingEvent(events, now = new Date()) {
      const activeEvents = sanitizeEventsArray(events).filter((event) => event.active);
      if (activeEvents.length === 0) {
        return null;
      }
    
      const futureEvents = activeEvents
        .filter((event) => getEventDateTime(event).getTime() >= now.getTime())
        .sort((left, right) => getEventDateTime(left) - getEventDateTime(right));
    
      if (futureEvents.length > 0) {
        return futureEvents[0];
      }
    
      const mostRecentPastEvents = activeEvents
        .filter((event) => getEventDateTime(event).getTime() < now.getTime())
        .sort((left, right) => getEventDateTime(right) - getEventDateTime(left));
    
      return mostRecentPastEvents[0] ?? null;
    }
    
    function getSavedEvents() {
      return sanitizeEventsArray(getEventsFromStorage());
    }
    
    function saveEvents(events) {
      return saveEventsToStorage(sortEventsByDateTime(sanitizeEventsArray(events)));
    }
    
    function createEvent(eventData, baseEvents = getSavedEvents()) {
      const items = sortEventsByDateTime([
        ...sanitizeEventsArray(baseEvents),
        sanitizeEventEntry(buildStoredEvent(eventData), 0),
      ].filter(Boolean));
    
      return withSavedEvents(items);
    }
    
    function updateEvent(eventId, eventData, baseEvents = getSavedEvents()) {
      const items = sanitizeEventsArray(baseEvents).map((event) => (
        event.id === eventId
          ? sanitizeEventEntry(buildStoredEvent(eventData, event), 0)
          : event
      )).filter(Boolean);
    
      return withSavedEvents(sortEventsByDateTime(items));
    }
    
    function deleteEvent(eventId, baseEvents = getSavedEvents()) {
      const items = sanitizeEventsArray(baseEvents).filter((event) => event.id !== eventId);
      return withSavedEvents(items);
    }
    
    function duplicateEvent(eventId, baseEvents = getSavedEvents()) {
      const items = sanitizeEventsArray(baseEvents);
      const original = items.find((event) => event.id === eventId);
      if (!original) {
        return { ok: false, items };
      }
    
      const copy = sanitizeEventEntry(buildStoredEvent({
        ...original,
        id: createEventId(),
        titleArabic: `${original.titleArabic} - نسخة`,
        titleDanish: `${original.titleDanish} (copy)`,
        createdAt: "",
        updatedAt: "",
      }), 0);
    
      return withSavedEvents(sortEventsByDateTime([...items, copy].filter(Boolean)));
    }
    
    function toggleEventActive(eventId, baseEvents = getSavedEvents()) {
      const items = sanitizeEventsArray(baseEvents).map((event) => (
        event.id === eventId
          ? sanitizeEventEntry(buildStoredEvent({ ...event, active: !event.active }, event), 0)
          : event
      )).filter(Boolean);
    
      return withSavedEvents(sortEventsByDateTime(items));
    }
    
    function createDraftEventDate(year, month, day) {
      return `${year}-${pad(month)}-${pad(day)}`;
    }

    return { getEventThemeMeta, eventMatchesDisplayTheme, getEventDateTime, validateEventsArray, loadEvents, getUpcomingEvent, getSavedEvents, saveEvents, createEvent, updateEvent, deleteEvent, duplicateEvent, toggleEventActive, createDraftEventDate };
  })();

  __modules["./import-prayer-image.js"] = (() => {
    const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
    const STRICT_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const HEADER_TOKENS = ["ugedag", "date", "subh", "solopgang", "dhuhr", "solnedgang", "maghrib", "midnat"];
    const DANISH_WEEKDAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag", "søndag"];
    
    const IMPORT_MONTH_OPTIONS = [
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
    
    const SAMPLE_TIMETABLE_TEXT = `Ugedag Date Subh Solopgang Dhuhr Solnedgang Maghrib Midnat
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
    
    function normalizeTextLine(rawLine = "") {
      return String(rawLine)
        .replace(/\t+/g, " ")
        .replace(/[;,|]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
    
    function looksLikeHeader(line) {
      const lower = line.toLowerCase();
      const matches = HEADER_TOKENS.filter((token) => lower.includes(token)).length;
      return matches >= 3;
    }
    
    function cleanTimeCandidate(value = "") {
      return String(value)
        .trim()
        .replace(/[oO]/g, "0")
        .replace(/[.,]/g, ":")
        .replace(/\s+/g, "");
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
      return /\d/.test(line) && timeTokens.length > 0;
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
        errors: [],
        statusText: "Klar til gennemgang / جاهز للمراجعة",
        ...overrides,
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
      });
    
      return normalized;
    }
    
    function getRowErrors(row) {
      const errors = [];
      const requiredFields = ["date", "fajr", "sunrise", "dhuhr", "sunset", "maghrib", "midnight"];
      const optionalTimeFields = ["asr", "isha"];
    
      if (!isDateKey(row.date)) {
        errors.push("Date must use YYYY-MM-DD.");
      } else {
        const [year, month, day] = row.date.split("-").map(Number);
        if (!isRealCalendarDate(year, month, day)) {
          errors.push("Date is not a real calendar date.");
        }
      }
    
      requiredFields
        .filter((field) => field !== "date")
        .forEach((field) => {
          if (!isStrictTime(row[field])) {
            errors.push(`${field} must use HH:mm.`);
          }
        });
    
      optionalTimeFields.forEach((field) => {
        if (row[field] && !isStrictTime(row[field])) {
          errors.push(`${field} must use HH:mm or stay empty.`);
        }
      });
    
      return errors;
    }
    
    function validateImportedPrayerRows(rows = []) {
      const normalizedRows = Array.isArray(rows) ? rows.map(normalizeImportedRow) : [];
      const duplicateMap = new Map();
    
      normalizedRows.forEach((row) => {
        if (row.date) {
          duplicateMap.set(row.date, (duplicateMap.get(row.date) ?? 0) + 1);
        }
      });
    
      const decoratedRows = normalizedRows.map((row) => {
        const errors = getRowErrors(row);
        if (row.date && duplicateMap.get(row.date) > 1) {
          errors.push("Date is duplicated in the preview.");
        }
    
        return {
          ...row,
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
          message: "Choose a valid month and year before parsing.",
        };
      }
    
      lines.forEach((rawLine, index) => {
        const normalizedLine = normalizeTextLine(rawLine);
        if (!normalizedLine || looksLikeHeader(normalizedLine)) {
          return;
        }
    
        const firstTimeMatch = normalizedLine.match(/\b[0-2]?\d\s*[:.]\s*\d{2}\b/);
        const firstTimeIndex = firstTimeMatch?.index ?? -1;
        const dayNumber = extractDayNumber(normalizedLine, firstTimeIndex);
        const timeTokens = extractTimeTokens(normalizedLine);
    
        if (!dayNumber || timeTokens.length < 5) {
          if (shouldRecordSkippedLine(normalizedLine, timeTokens)) {
            skippedLines.push({
              lineNumber: index + 1,
              rawLine: normalizedLine,
              reason: "Could not find a usable day number and timetable values on this line.",
            });
          }
          return;
        }
    
        const row = createEmptyImportedPrayerRow({
          date: buildDateKey(safeYear, safeMonth, dayNumber),
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
        midnight: row.midnight || "",
      }));
    }
    
    function summarizeImportedRows(rows = []) {
      if (!Array.isArray(rows) || rows.length === 0) {
        return {
          count: 0,
          firstDate: "—",
          lastDate: "—",
        };
      }
    
      const ordered = [...rows].sort((left, right) => left.date.localeCompare(right.date));
      return {
        count: ordered.length,
        firstDate: ordered[0].date,
        lastDate: ordered[ordered.length - 1].date,
      };
    }

    return { IMPORT_MONTH_OPTIONS, SAMPLE_TIMETABLE_TEXT, normalizeLooseTime, createEmptyImportedPrayerRow, validateImportedPrayerRows, parseTimetableText, importedRowsToPrayerEntries, summarizeImportedRows };
  })();

  __modules["./prayer-times.js"] = (() => {
    const { APP_CONFIG, SAMPLE_PRAYER_TIMES } = __modules["./config.js"];
    const { loadPrayerTimesFromRemote } = __modules["./remote-data.js"];
    const { getPrayerTimesFromStorage } = __modules["./storage.js"];
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
    
    function getSafeDisplayMode(mode = APP_CONFIG.prayerDisplayMode) {
      return APP_CONFIG.prayerDisplayModes[mode] ? mode : APP_CONFIG.prayerDisplayMode;
    }
    
    function isRealCalendarDate(dateKey) {
      if (!isValidDateKey(dateKey)) {
        return false;
      }
    
      const [year, month, day] = dateKey.split("-").map(Number);
      const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);
      return (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
      );
    }
    
    function getDisplayPrayerKeys(mode = APP_CONFIG.prayerDisplayMode) {
      return [...APP_CONFIG.prayerDisplayModes[getSafeDisplayMode(mode)].order];
    }
    
    function getCountdownPrayerKeys(mode = APP_CONFIG.prayerDisplayMode) {
      return [...APP_CONFIG.prayerDisplayModes[getSafeDisplayMode(mode)].countdownOrder];
    }
    
    function getPrayerMetaForMode(prayerKey, mode = APP_CONFIG.prayerDisplayMode) {
      const safeMode = getSafeDisplayMode(mode);
      const baseMeta = APP_CONFIG.prayerMeta[prayerKey] ?? {};
      const labelMeta = APP_CONFIG.prayerDisplayModes[safeMode].labels[prayerKey] ?? {};
    
      return {
        key: prayerKey,
        icon: baseMeta.icon ?? "sun",
        arabic: labelMeta.arabic ?? prayerKey,
        danish: labelMeta.danish ?? prayerKey,
      };
    }
    
    function normalizePrayerEntry(entry = {}) {
      const normalized = {
        date: String(entry.date ?? "").trim(),
        hijriDateArabic: String(entry.hijriDateArabic ?? "").trim(),
        hijriDateLatin: String(entry.hijriDateLatin ?? "").trim(),
      };
    
      APP_CONFIG.prayerFields.forEach((key) => {
        normalized[key] = String(entry[key] ?? "").trim();
      });
    
      return normalized;
    }
    
    function sanitizePrayerEntry(entry) {
      const normalized = normalizePrayerEntry(entry);
      if (!isValidDateKey(normalized.date) || !isRealCalendarDate(normalized.date)) {
        return null;
      }
    
      const sanitized = { ...normalized };
      APP_CONFIG.prayerFields.forEach((key) => {
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
      const result = await loadPrayerTimesFromRemote(requestedDate);
      if (!result.ok) {
        return [];
      }
    
      return sanitizePrayerTimesArray(normalizePrayerPayload(result.data));
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
    
    function buildPrayerCandidate(entry, prayerKey, mode = APP_CONFIG.prayerDisplayMode) {
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
        label: getPrayerMetaForMode(prayerKey, mode),
        time,
        at,
        dateKey: entry.date,
      };
    }
    
    function validateFlexibleSchema(entry, index, errors, schema) {
      const requiredBaseFields = ["fajr", "sunrise", "dhuhr", "maghrib"];
      requiredBaseFields.forEach((key) => {
        if (!isValidTimeString(entry[key])) {
          errors.push(`Entry ${index + 1}: ${key} must use HH:mm.`);
        }
      });
    
      if (schema === "standard") {
        if (!isValidTimeString(entry.asr)) {
          errors.push(`Entry ${index + 1}: asr must use HH:mm.`);
        }
        if (!isValidTimeString(entry.isha)) {
          errors.push(`Entry ${index + 1}: isha must use HH:mm.`);
        }
        return;
      }
    
      if (schema === "imamAliCopenhagen") {
        if (!isValidTimeString(entry.sunset)) {
          errors.push(`Entry ${index + 1}: sunset must use HH:mm.`);
        }
        if (!isValidTimeString(entry.midnight)) {
          errors.push(`Entry ${index + 1}: midnight must use HH:mm.`);
        }
        return;
      }
    
      if (!isValidTimeString(entry.asr) && !isValidTimeString(entry.sunset)) {
        errors.push(`Entry ${index + 1}: provide either asr or sunset in HH:mm.`);
      }
    
      if (!isValidTimeString(entry.isha) && !isValidTimeString(entry.midnight)) {
        errors.push(`Entry ${index + 1}: provide either isha or midnight in HH:mm.`);
      }
    }
    
    function validatePrayerTimesArray(input, options = {}) {
      if (!Array.isArray(input)) {
        return {
          valid: false,
          errors: ["Prayer times must be an array of daily objects."],
          normalized: [],
        };
      }
    
      const schema = options.schema ?? "any";
      const errors = [];
      const normalized = input.map(normalizePrayerEntry);
      const duplicateDates = new Map();
    
      normalized.forEach((entry) => {
        if (entry.date) {
          duplicateDates.set(entry.date, (duplicateDates.get(entry.date) ?? 0) + 1);
        }
      });
    
      normalized.forEach((entry, index) => {
        if (!isValidDateKey(entry.date)) {
          errors.push(`Entry ${index + 1}: date must use YYYY-MM-DD.`);
        } else if (!isRealCalendarDate(entry.date)) {
          errors.push(`Entry ${index + 1}: date is not a real calendar date.`);
        }
    
        APP_CONFIG.prayerFields.forEach((key) => {
          if (entry[key] && !isValidTimeString(entry[key])) {
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
        normalized,
      };
    }
    
    async function loadPrayerTimes() {
      const functionPrayerTimes = await loadPrayerTimesFromFunction();
      if (functionPrayerTimes.length > 0) {
        return { items: functionPrayerTimes, source: "supabase-function" };
      }
    
      const storedPrayerTimes = sanitizePrayerTimesArray(getPrayerTimesFromStorage());
      if (storedPrayerTimes.length > 0) {
        return { items: storedPrayerTimes, source: "localStorage" };
      }
    
      const filePrayerTimes = await loadSamplePrayerTimesFromFile();
      if (filePrayerTimes.length > 0) {
        return { items: filePrayerTimes, source: "sample-file" };
      }
    
      return {
        items: sanitizePrayerTimesArray(SAMPLE_PRAYER_TIMES),
        source: "inline-sample",
      };
    }
    
    function getLocalDateKey(date = new Date()) {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    
    function parseTimeForDate(dateKey, timeString) {
      if (!isValidDateKey(dateKey) || !isValidTimeString(timeString)) {
        return null;
      }
    
      const [year, month, day] = dateKey.split("-").map(Number);
      const [hours, minutes] = timeString.split(":").map(Number);
      const parsedDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
      return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    
    function getTodayPrayerTimes(prayerTimes, date = new Date()) {
      return findPrayerEntry(prayerTimes, getLocalDateKey(date));
    }
    
    function getTomorrowPrayerTimes(prayerTimes, date = new Date()) {
      return findPrayerEntry(prayerTimes, getLocalDateKey(addLocalDays(date, 1)));
    }
    
    function getNextPrayer(
      todayEntry,
      now = new Date(),
      tomorrowEntry = null,
      mode = APP_CONFIG.prayerDisplayMode,
    ) {
      const countdownKeys = getCountdownPrayerKeys(mode);
    
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
    
      for (const prayerKey of countdownKeys) {
        const candidate = buildPrayerCandidate(todayEntry, prayerKey, mode);
        if (candidate && candidate.at.getTime() >= now.getTime()) {
          return {
            ...candidate,
            status: "upcoming-today",
            dayOffset: 0,
          };
        }
      }
    
      for (const prayerKey of countdownKeys) {
        const candidate = buildPrayerCandidate(tomorrowEntry, prayerKey, mode);
        if (candidate && candidate.at.getTime() >= now.getTime()) {
          return {
            ...candidate,
            status: "upcoming-tomorrow",
            dayOffset: 1,
          };
        }
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
    
    function getPrayerDisplayTime(entry, prayerKey) {
      const value = String(entry?.[prayerKey] ?? "").trim();
      return isValidTimeString(value) ? value : "—";
    }
    
    function getCountdownPayload(targetDate, now = new Date()) {
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

    return { getDisplayPrayerKeys, getCountdownPrayerKeys, getPrayerMetaForMode, validatePrayerTimesArray, loadPrayerTimes, getLocalDateKey, parseTimeForDate, getTodayPrayerTimes, getTomorrowPrayerTimes, getNextPrayer, getPrayerDisplayTime, getCountdownPayload };
  })();

  __modules["./admin.js"] = (() => {
    const { APP_CONFIG, SAMPLE_EVENTS, SAMPLE_PRAYER_TIMES } = __modules["./config.js"];
    const { createEvent, deleteEvent, duplicateEvent, getEventThemeMeta, getSavedEvents, saveEvents, toggleEventActive, updateEvent, validateEventsArray, } = __modules["./events.js"];
    const { IMPORT_MONTH_OPTIONS, SAMPLE_TIMETABLE_TEXT, importedRowsToPrayerEntries, parseTimetableText, summarizeImportedRows, validateImportedPrayerRows, } = __modules["./import-prayer-image.js"];
    const { validatePrayerTimesArray } = __modules["./prayer-times.js"];
    const { clearStoredDisplayData, clearStoredEvents, clearStoredPrayerTimes, getPrayerTimesFromStorage, getThemeFromStorage, hasLocalStorageSupport, savePrayerTimesToStorage, saveThemeToStorage, } = __modules["./storage.js"];
    const { checkSupabaseConnection, deleteEventRemotely, getRemoteFailureMessage, saveEventRemotely, savePrayerTimesRemotely, } = __modules["./remote-data.js"];
    const TESSERACT_CDN = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    const MAX_EVENT_IMAGE_BYTES = 2 * 1024 * 1024;
    const ALLOWED_EVENT_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
    
    const PREVIEW_FIELDS = [
      { key: "date", label: "Date" },
      { key: "fajr", label: "Fajr / Subh" },
      { key: "sunrise", label: "Sunrise / Solopgang" },
      { key: "dhuhr", label: "Dhuhr" },
      { key: "asr", label: "Asr (optional)" },
      { key: "sunset", label: "Sunset / Solnedgang" },
      { key: "maghrib", label: "Maghrib" },
      { key: "isha", label: "Isha (optional)" },
      { key: "midnight", label: "Midnight / Midnat" },
    ];
    
    const elements = {
      body: document.body,
      adminThemeBadge: document.querySelector("#admin-theme-badge"),
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
      refreshPreview: document.querySelector("#refresh-preview"),
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
    };
    
    const state = {
      previewRows: [],
      currentImageFile: null,
      currentImageUrl: "",
      tesseractPromise: null,
      eventImageDataUrl: "",
      editingEventId: "",
      supabaseConnected: false,
      supabaseChecked: false,
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
    
    function prettyJson(value) {
      return JSON.stringify(value, null, 2);
    }
    
    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
    
    function sortByDate(entries) {
      return [...entries].sort((left, right) => left.date.localeCompare(right.date));
    }
    
    function mergePrayerEntries(existingEntries, incomingEntries) {
      const merged = new Map();
      [...existingEntries, ...incomingEntries].forEach((entry) => {
        merged.set(entry.date, entry);
      });
      return sortByDate([...merged.values()]);
    }
    
    function getThemeLabel(theme) {
      return APP_CONFIG.themes[theme]?.label ?? APP_CONFIG.themes[APP_CONFIG.defaultTheme].label;
    }
    
    function getSavedPrayerData() {
      const savedPrayerTimes = getPrayerTimesFromStorage();
      const validation = validatePrayerTimesArray(savedPrayerTimes, { schema: "any" });
      return validation.valid ? sortByDate(validation.normalized) : [];
    }
    
    function getSampleEvents() {
      const validation = validateEventsArray(SAMPLE_EVENTS);
      return validation.valid ? validation.normalized : [];
    }
    
    function getCurrentEventCollection() {
      const savedEvents = getSavedEvents();
      if (savedEvents.length > 0) {
        return {
          items: savedEvents,
          source: "localStorage",
        };
      }
    
      return {
        items: getSampleEvents(),
        source: "sample",
      };
    }
    
    function getDisplaySourceLabel(usingLocalPrayerData, usingLocalEventData) {
      if (state.supabaseConnected) {
        return "Supabase";
      }
    
      if (usingLocalPrayerData || usingLocalEventData) {
        return "localStorage";
      }
    
      return "Sample data";
    }
    
    async function refreshSupabaseConnectionState() {
      const result = await checkSupabaseConnection();
      state.supabaseConnected = result.connected;
      state.supabaseChecked = true;
      refreshStatusPanel();
      setStatus(
        elements.generalStatus,
        result.connected ? APP_CONFIG.syncMessages.connected : APP_CONFIG.syncMessages.unavailable,
        result.connected ? "success" : "warning",
      );
      return result;
    }
    
    async function syncPrayerTimesWithRemote(entries) {
      const result = await savePrayerTimesRemotely(entries);
      state.supabaseConnected = result.ok;
      state.supabaseChecked = true;
      refreshStatusPanel();
      return result;
    }
    
    async function syncEventWithRemote(event) {
      const result = await saveEventRemotely(event);
      state.supabaseConnected = result.ok;
      state.supabaseChecked = true;
      refreshStatusPanel();
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
          error: "",
        };
      }
    
      const results = await Promise.all(events.map((item) => saveEventRemotely(item)));
      const failedResult = results.find((result) => !result.ok) ?? null;
      const allSkipped = results.every((result) => result.skipped);
      state.supabaseConnected = !failedResult && !allSkipped;
      state.supabaseChecked = true;
      refreshStatusPanel();
    
      if (failedResult) {
        return failedResult;
      }
    
      if (allSkipped) {
        return {
          ok: false,
          skipped: true,
          status: 0,
          data: null,
          error: "Remote functions are unavailable in direct file-open mode.",
        };
      }
    
      return {
        ok: true,
        skipped: false,
        status: 200,
        data: { count: results.length },
        error: "",
      };
    }
    
    async function syncEventDeleteWithRemote(eventId) {
      const result = await deleteEventRemotely(eventId);
      state.supabaseConnected = result.ok;
      state.supabaseChecked = true;
      refreshStatusPanel();
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
      elements.importMonth.innerHTML = IMPORT_MONTH_OPTIONS
        .map((monthOption) => `<option value="${monthOption.value}">${monthOption.label}</option>`)
        .join("");
    }
    
    function setDefaultImportPeriod() {
      const now = new Date();
      elements.importMonth.value = String(now.getMonth() + 1);
      elements.importYear.value = String(now.getFullYear());
    }
    
    function refreshStatusPanel() {
      const savedPrayerTimes = getSavedPrayerData();
      const savedEvents = getSavedEvents();
      const currentTheme = getThemeFromStorage();
      const usingLocalPrayerData = savedPrayerTimes.length > 0;
      const usingLocalEventData = savedEvents.length > 0;
    
      setText(elements.statusPrayerCount, String(savedPrayerTimes.length));
      setText(elements.statusPrayerFirstDate, savedPrayerTimes[0]?.date ?? "—");
      setText(elements.statusPrayerLastDate, savedPrayerTimes[savedPrayerTimes.length - 1]?.date ?? "—");
      setText(elements.statusEventCount, String(savedEvents.length));
      setText(elements.statusCurrentTheme, getThemeLabel(currentTheme));
      setText(elements.statusDataSource, getDisplaySourceLabel(usingLocalPrayerData, usingLocalEventData));
    
      if (!state.supabaseChecked) {
        setStatus(elements.adminStatusNote, "Checking Supabase connection status...", "warning");
        return;
      }
    
      if (state.supabaseConnected) {
        setStatus(elements.adminStatusNote, APP_CONFIG.syncMessages.connected, "success");
        return;
      }
    
      if (!usingLocalPrayerData && !usingLocalEventData) {
        setStatus(
          elements.adminStatusNote,
          `${APP_CONFIG.syncMessages.unavailable} The display will use bundled sample data.`,
          "warning",
        );
        return;
      }
    
      if (!usingLocalPrayerData) {
        setStatus(
          elements.adminStatusNote,
          `${APP_CONFIG.syncMessages.unavailable} Prayer times still come from sample data. Events or theme settings are saved in this browser.`,
          "warning",
        );
        return;
      }
    
      setStatus(
        elements.adminStatusNote,
        `${APP_CONFIG.syncMessages.unavailable} Saved browser data is available in this browser and can be read by index.html.`,
        "success",
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
          "success",
        );
        return;
      }
    
      setStatus(
        elements.generalStatus,
        "This browser does not allow localStorage. Supabase saves may still work when deployed, but browser-local fallback data will not be stored here.",
        "warning",
      );
    }
    
    function toggleManualSection(forceVisible) {
      const shouldShow = typeof forceVisible === "boolean"
        ? forceVisible
        : elements.manualJsonSection.hidden;
    
      elements.manualJsonSection.hidden = !shouldShow;
      elements.toggleManualEntry.textContent = shouldShow
        ? "Hide manual JSON entry"
        : "إدخال البيانات يدوياً / Enter data manually";
    }
    
    function toggleEventJsonSection(forceVisible) {
      const shouldShow = typeof forceVisible === "boolean"
        ? forceVisible
        : elements.eventJsonSection.hidden;
    
      elements.eventJsonSection.hidden = !shouldShow;
      elements.toggleEventJsonEntry.textContent = shouldShow
        ? "Hide event JSON entry"
        : "إدخال الفعاليات بصيغة JSON يدوياً / Enter event JSON manually";
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
      elements.parseSkippedLines.innerHTML = skippedLines
        .map((item) => `<li><strong>Line ${item.lineNumber}:</strong> ${escapeHtml(item.rawLine)}</li>`)
        .join("");
    }
    
    function getPreviewFieldIssue(row, field) {
      const joinedErrors = row.errors.join(" ").toLowerCase();
      if (field === "date") {
        return joinedErrors.includes("date");
      }
      return joinedErrors.includes(field.toLowerCase());
    }
    
    function renderPreviewTable() {
      if (state.previewRows.length === 0) {
        elements.previewTableContainer.innerHTML = `
          <div class="preview-empty-state">
            Upload a timetable image or paste timetable text to build the editable preview table.
          </div>
        `;
        return;
      }
    
      const headerMarkup = PREVIEW_FIELDS.map((field) => `<th scope="col">${field.label}</th>`).join("");
      const bodyMarkup = state.previewRows.map((row, rowIndex) => {
        const fieldCells = PREVIEW_FIELDS.map((field) => {
          const invalidClass = getPreviewFieldIssue(row, field.key) ? " is-invalid" : "";
          return `
            <td>
              <input
                class="preview-input${invalidClass}"
                type="text"
                value="${escapeHtml(row[field.key] ?? "")}"
                data-row-index="${rowIndex}"
                data-field="${field.key}"
              >
            </td>
          `;
        }).join("");
    
        const statusClass = row.errors.length > 0 ? "preview-status-text is-error" : "preview-status-text";
        const statusText = row.errors.length > 0
          ? row.statusText
          : `Ready. Source line ${row.sourceLineNumber || "—"}.`;
    
        return `
          <tr class="${row.errors.length > 0 ? "preview-row-error" : ""}">
            ${fieldCells}
            <td>
              <p class="${statusClass}" title="${escapeHtml(row.sourceLine || "")}">${escapeHtml(statusText)}</p>
            </td>
          </tr>
        `;
      }).join("");
    
      elements.previewTableContainer.innerHTML = `
        <table class="preview-table">
          <thead>
            <tr>
              ${headerMarkup}
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>${bodyMarkup}</tbody>
        </table>
      `;
    }
    
    function refreshPreviewValidation() {
      const validation = validateImportedPrayerRows(state.previewRows);
      state.previewRows = validation.rows;
    
      const summary = summarizeImportedRows(validation.rows.filter((row) => row.date));
      setText(
        elements.previewSummary,
        validation.rows.length > 0
          ? `Preview rows: ${summary.count}. First date: ${summary.firstDate}. Last date: ${summary.lastDate}.`
          : "No timetable parsed yet.",
      );
    
      if (validation.rows.length === 0) {
        setStatus(elements.previewErrors, "Parse a timetable to see validation details here.");
      } else if (validation.valid) {
        setStatus(elements.previewErrors, "All preview rows are valid and ready to save.", "success");
      } else {
        setStatus(
          elements.previewErrors,
          `${validation.errorCount} validation issues must be fixed before saving.`,
          "error",
        );
      }
    
      elements.saveImportedPrayerTimes.disabled = !validation.valid;
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
        year: Number(elements.importYear.value),
      });
    
      state.previewRows = parseResult.rows;
      renderSkippedLines(parseResult.skippedLines);
      refreshPreviewValidation();
      setStatus(
        elements.importSaveStatus,
        parseResult.rows.length > 0
          ? "Preview updated. Review every row, then save imported prayer times."
          : "Imported prayer times are not saved yet.",
        parseResult.rows.length > 0 ? "warning" : "",
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
    
    function populateImportSample() {
      elements.importMonth.value = "7";
      elements.importYear.value = "2026";
      elements.importTextInput.value = SAMPLE_TIMETABLE_TEXT;
      parseImportText();
    }
    
    function updateManualEditorFromSavedPrayerData(prayerEntries) {
      elements.prayerTimesInput.value = prettyJson(sortByDate(prayerEntries));
    }
    
    async function persistPrayerDataset(prayerEntries, successMessage) {
      const localSaved = savePrayerTimesToStorage(prayerEntries);
      const remoteResult = await syncPrayerTimesWithRemote(prayerEntries);
    
      if (localSaved) {
        updateManualEditorFromSavedPrayerData(prayerEntries);
        refreshStatusPanel();
      }
    
      if (remoteResult.ok && localSaved) {
        return {
          ok: true,
          localSaved: true,
          tone: "success",
          detail: successMessage,
          general: APP_CONFIG.syncMessages.connected,
        };
      }
    
      if (remoteResult.ok) {
        return {
          ok: true,
          localSaved: false,
          tone: "warning",
          detail: `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
          general: APP_CONFIG.syncMessages.connected,
        };
      }
    
      if (localSaved) {
        return {
          ok: true,
          localSaved: true,
          tone: "warning",
          detail: `${successMessage} Saved in this browser only.`,
          general: APP_CONFIG.syncMessages.localOnly,
          remoteError: getRemoteFailureMessage(remoteResult),
        };
      }
    
      return {
        ok: false,
        localSaved: false,
        tone: "error",
        detail: "Could not save prayer times locally or remotely.",
        general: getRemoteFailureMessage(remoteResult, "Supabase unavailable. Prayer times were not saved."),
      };
    }
    
    async function saveImportedPrayerRows() {
      const validation = validateImportedPrayerRows(state.previewRows);
      state.previewRows = validation.rows;
      refreshPreviewValidation();
    
      if (!validation.valid) {
        setStatus(elements.importSaveStatus, "Imported rows contain validation errors and cannot be saved yet.", "error");
        setStatus(elements.generalStatus, "Fix the highlighted preview rows before saving imported prayer times.", "error");
        return;
      }
    
      const mergedPrayerEntries = mergePrayerEntries(
        getSavedPrayerData(),
        importedRowsToPrayerEntries(validation.rows),
      );
    
      const persistence = await persistPrayerDataset(
        mergedPrayerEntries,
        `Saved ${validation.rows.length} imported prayer-time rows. The merged dataset now has ${mergedPrayerEntries.length} day entries.`,
      );
    
      setStatus(elements.importSaveStatus, persistence.detail, persistence.tone);
      setStatus(elements.generalStatus, persistence.general, persistence.ok ? persistence.tone : "error");
      setStatus(
        elements.prayerTimesStatus,
        persistence.localSaved
          ? "Manual JSON editor updated with the saved merged prayer-time dataset."
          : "Manual JSON editor could not be updated because the browser copy was not saved.",
        persistence.localSaved ? persistence.tone : "error",
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
    
      setStatus(elements.imageImportStatus, "Loading OCR engine…", "warning");
    
      try {
        const Tesseract = await loadTesseract();
        const result = await Tesseract.recognize(state.currentImageFile, "eng", {
          logger(message) {
            if (message?.status) {
              const percent = typeof message.progress === "number"
                ? ` ${Math.round(message.progress * 100)}%`
                : "";
              setStatus(elements.imageImportStatus, `${message.status}${percent}`, "warning");
            }
          },
        });
    
        const extractedText = String(result?.data?.text ?? "").trim();
        elements.importTextInput.value = extractedText;
    
        if (!extractedText) {
          setStatus(
            elements.imageImportStatus,
            "OCR finished but no text was detected. Paste the timetable text manually below.",
            "warning",
          );
          return;
        }
    
        setStatus(
          elements.imageImportStatus,
          "OCR finished. Review and correct the extracted text before parsing.",
          "success",
        );
        setStatus(elements.parseStatus, "OCR text is ready. Click Parse timetable after reviewing it.", "warning");
      } catch (error) {
        setStatus(
          elements.imageImportStatus,
          "OCR is unavailable right now. The page still works: paste timetable text manually and continue.",
          "warning",
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
    
      state.previewRows[rowIndex] = {
        ...state.previewRows[rowIndex],
        [field]: target.value,
      };
      refreshPreviewValidation();
      setStatus(elements.importSaveStatus, "Preview changed. Save again after reviewing the updated rows.", "warning");
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
        "success",
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
        "success",
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
      elements.eventFormErrors.innerHTML = errors
        .map((message) => `<li>${escapeHtml(message)}</li>`)
        .join("");
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
      elements.eventSubmitButton.textContent = "Save event / حفظ الفعالية";
      elements.eventCancelEdit.hidden = true;
      setStatus(
        elements.eventImageStatus,
        "No image selected. A clean placeholder will be used if you save without an image.",
      );
    
      if (!options.preserveStatus) {
        setStatus(
          elements.eventFormStatus,
          "Fill in the event details, then save. The list below updates after each change.",
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
      elements.eventSubmitButton.textContent = "Update event / تحديث الفعالية";
      elements.eventCancelEdit.hidden = false;
      setStatus(
        elements.eventImageStatus,
        event.imageDataUrl
          ? "Current image loaded. Choose a new image only if you want to replace it."
          : "This event currently uses the placeholder image.",
        event.imageDataUrl ? "success" : "warning",
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
      const output = canvas.toDataURL(outputType, outputType === "image/png" ? undefined : 0.86);
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
          warnings,
        };
      } catch (error) {
        warnings.push("The image could not be optimized automatically. The original file preview is being used.");
        return {
          dataUrl: originalDataUrl,
          warnings,
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
            "No image selected. A clean placeholder will be used if you save without an image.",
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
        active: elements.eventActive.checked,
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
        active: payload.active,
      }]);
    
      errors.push(...validation.errors.map((message) => message.replace(/^Entry 1:\s*/, "")));
      return errors;
    }
    
    function renderSavedEventCard(event) {
      const themeMeta = getEventThemeMeta(event.theme);
      const locationText = event.locationArabic || event.locationDanish
        ? `${event.locationArabic || "—"} / ${event.locationDanish || "—"}`
        : "No location / بدون موقع";
    
      const imageMarkup = event.imageDataUrl
        ? `<img src="${escapeHtml(event.imageDataUrl)}" alt="${escapeHtml(event.titleDanish || event.titleArabic || "Event image")}">`
        : `
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
            <button type="button" class="button-danger" data-action="delete" data-event-id="${escapeHtml(event.id)}">Delete</button>
          </div>
        </article>
      `;
    }
    
    function renderSavedEvents() {
      const collection = getCurrentEventCollection();
      elements.eventDataSource.textContent = collection.source === "localStorage" ? "localStorage" : "Sample data";
    
      if (collection.items.length === 0) {
        elements.savedEventsList.innerHTML = `
          <div class="saved-events-empty">
            No events are available yet.
          </div>
        `;
        return;
      }
    
      elements.savedEventsList.innerHTML = collection.items
        .map((event) => renderSavedEventCard(event))
        .join("");
    }
    
    async function persistEventResult(result, successMessage, remoteAction = null) {
      const remoteResult = typeof remoteAction === "function"
        ? await remoteAction()
        : {
          ok: false,
          skipped: true,
          status: 0,
          data: null,
          error: "No remote sync action was provided.",
        };
    
      if (result.ok) {
        syncEventEditor(result.items);
        renderSavedEvents();
        refreshStatusPanel();
        setStatus(elements.eventsStatus, `Event JSON editor updated with ${result.items.length} saved event entries.`, "success");
      }
    
      if (remoteResult.ok && result.ok) {
        setStatus(elements.eventsStatus, `Event JSON editor updated with ${result.items.length} saved event entries.`, "success");
        setStatus(elements.eventFormStatus, successMessage, "success");
        setStatus(elements.generalStatus, APP_CONFIG.syncMessages.connected, "success");
        return true;
      }
    
      if (remoteResult.ok) {
        setStatus(elements.eventsStatus, "Supabase was updated, but this browser could not refresh its saved event list.", "warning");
        setStatus(
          elements.eventFormStatus,
          `${successMessage} Supabase was updated, but this browser could not update its local cache.`,
          "warning",
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
      const result = state.editingEventId
        ? updateEvent(state.editingEventId, payload, collection.items)
        : createEvent(payload, collection.items);
    
      const message = state.editingEventId
        ? "Event updated and saved to this browser."
        : "Event saved to this browser.";
    
      const remoteEvent = result.items.find((item) => item.id === (state.editingEventId || payload.id || ""));
      const syncCandidate = remoteEvent ?? result.items[result.items.length - 1] ?? payload;
    
      if (await persistEventResult(result, message, () => syncEventWithRemote(syncCandidate))) {
        resetEventForm({ preserveStatus: true });
      }
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
    
      if (action === "delete") {
        if (!window.confirm("Delete this event?")) {
          return;
        }
    
        const result = deleteEvent(eventId, collection.items);
        if (await persistEventResult(result, "Event deleted.", () => syncEventDeleteWithRemote(eventId))) {
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
    
    function bindEvents() {
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
            `Saved ${normalized.length} prayer-time days.`,
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
    
        const localSaved = saveEvents(normalized);
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
    
      elements.refreshPreview.addEventListener("click", () => {
        refreshStatusPanel();
        refreshPreviewValidation();
        renderSavedEvents();
        setStatus(elements.generalStatus, "Status and preview validation refreshed.", "success");
      });
    
      elements.imageInput.addEventListener("change", handleImageSelection);
      elements.runOcrButton.addEventListener("click", () => {
        runOcrForCurrentImage();
      });
      elements.useSampleImportText.addEventListener("click", () => {
        populateImportSample();
        setStatus(elements.generalStatus, "Sample timetable text loaded. Review the preview before saving.", "warning");
      });
      elements.parseTimetable.addEventListener("click", () => {
        parseImportText();
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
    
      elements.clearPrayerTimes.addEventListener("click", () => {
        if (!clearStoredPrayerTimes()) {
          setStatus(elements.dangerStatus, "Could not clear saved prayer times in this browser.", "error");
          return;
        }
    
        elements.prayerTimesInput.value = prettyJson(SAMPLE_PRAYER_TIMES);
        setStatus(elements.prayerTimesStatus, "Saved prayer times cleared. The manual JSON editor now shows sample data.", "warning");
        setStatus(
          elements.importSaveStatus,
          state.supabaseConnected
            ? "Saved prayer times cleared in this browser. Deployed screens can still read the shared Supabase data."
            : "Saved prayer times cleared. The display will use sample fallback data until you save new rows.",
          "warning",
        );
        setStatus(elements.dangerStatus, "Saved prayer times cleared from this browser.", "warning");
        setStatus(
          elements.generalStatus,
          state.supabaseConnected
            ? "Local prayer cache cleared. Supabase remains connected for shared screen updates."
            : "Saved prayer times cleared. index.html will fall back to sample prayer data.",
          "warning",
        );
        refreshStatusPanel();
      });
    
      elements.clearEvents.addEventListener("click", () => {
        if (!clearStoredEvents()) {
          setStatus(elements.dangerStatus, "Could not clear saved events in this browser.", "error");
          return;
        }
    
        syncEventEditor(SAMPLE_EVENTS);
        renderSavedEvents();
        resetEventForm({ preserveStatus: true });
        setStatus(elements.eventsStatus, "Saved events cleared. The JSON fallback editor now shows sample events.", "warning");
        setStatus(elements.dangerStatus, "Saved events cleared from this browser.", "warning");
        setStatus(
          elements.generalStatus,
          state.supabaseConnected
            ? "Local event cache cleared. Supabase remains connected for shared screen updates."
            : "Saved events cleared. index.html will fall back to sample events if needed.",
          "warning",
        );
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
          state.supabaseConnected
            ? "Local browser data cleared. Deployed screens can still read shared Supabase data."
            : "Saved browser data cleared. index.html will now fall back to sample data.",
          "warning",
        );
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
      renderPreviewTable();
      renderSavedEvents();
      resetEventForm({ preserveStatus: true });
      bindEvents();
      await refreshSupabaseConnectionState();
    }
    
    void initAdmin();

    return {  };
  })();

}());
