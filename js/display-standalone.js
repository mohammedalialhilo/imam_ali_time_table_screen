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

  __modules["./clock.js"] = (() => {
    function getLocaleDateFormatter(locale, options = {}) {
      return new Intl.DateTimeFormat(locale, options);
    }
    
    function pad(value) {
      return String(value).padStart(2, "0");
    }
    
    function toDateKey(date = new Date()) {
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    
    function formatCurrentTime(date = new Date()) {
      return getLocaleDateFormatter("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    }
    
    function formatGregorianDate(date = new Date()) {
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
    
    function formatShortBadgeDate(dateInput) {
      const date = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : dateInput;
      const day = getLocaleDateFormatter("en-GB", { day: "2-digit" }).format(date);
      const month = getLocaleDateFormatter("en-GB", { month: "short" }).format(date).replace(".", "");
      return { day, month };
    }
    
    function formatWeekdayLabel(dateInput) {
      const date = typeof dateInput === "string" ? new Date(`${dateInput}T00:00:00`) : dateInput;
      return {
        arabic: getLocaleDateFormatter("ar-EG", { weekday: "long" }).format(date),
        danish: getLocaleDateFormatter("da-DK", { weekday: "long" }).format(date),
      };
    }
    
    function formatEventDateText(dateInput) {
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
    
    function startClock(tick) {
      tick(new Date());
      return window.setInterval(() => tick(new Date()), 1000);
    }

    return { toDateKey, formatCurrentTime, formatGregorianDate, formatShortBadgeDate, formatWeekdayLabel, formatEventDateText, startClock };
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

  __modules["./display.js"] = (() => {
    const { APP_CONFIG } = __modules["./config.js"];
    const { eventMatchesDisplayTheme, getEventThemeMeta, loadEvents, getUpcomingEvent } = __modules["./events.js"];
    const { formatCurrentTime, formatEventDateText, formatGregorianDate, formatShortBadgeDate, formatWeekdayLabel, startClock, } = __modules["./clock.js"];
    const { getCountdownPayload, getDisplayPrayerKeys, getLocalDateKey, getNextPrayer, getPrayerDisplayTime, getPrayerMetaForMode, getTodayPrayerTimes, getTomorrowPrayerTimes, loadPrayerTimes, } = __modules["./prayer-times.js"];
    const { getThemeFromStorage } = __modules["./storage.js"];
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

    return {  };
  })();

}());
