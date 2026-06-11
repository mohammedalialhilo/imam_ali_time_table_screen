const { createSupabaseAnonClient } = require("./_supabase");
const {
  fromPrayerDbRow,
  getRequestedDateKey,
  getTomorrowDateKey,
  jsonResponse,
  sortPrayerRows,
} = require("./_shared");

exports.handler = async function handler(event) {
  let supabase;

  try {
    supabase = createSupabaseAnonClient();
  } catch (error) {
    return jsonResponse(503, {
      error: "Supabase is not configured for prayer-time reads.",
      details: error.message,
    });
  }

  try {
    const requestedDateKey = getRequestedDateKey(event);
    const tomorrowDateKey = getTomorrowDateKey(requestedDateKey);

    const { data, error } = await supabase
      .from("prayer_times")
      .select("*")
      .eq("archived", false)
      .in("date", [requestedDateKey, tomorrowDateKey]);

    if (error) {
      return jsonResponse(500, {
        error: "Unable to read prayer times from Supabase.",
        details: error.message,
      });
    }

    const items = sortPrayerRows((data ?? []).map(fromPrayerDbRow));
    const prayerTimes = items.find((row) => row.date === requestedDateKey) ?? null;
    const tomorrowPrayerTimes = items.find((row) => row.date === tomorrowDateKey) ?? null;

    if (!prayerTimes) {
      return jsonResponse(404, {
        error: "Prayer times for today were not found in Supabase.",
        source: "supabase",
        date: requestedDateKey,
        prayerTimes: null,
        tomorrowPrayerTimes,
        items,
      });
    }

    return jsonResponse(200, {
      source: "supabase",
      date: requestedDateKey,
      prayerTimes,
      tomorrowPrayerTimes,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while reading prayer times.",
      details: error.message,
    });
  }
};
