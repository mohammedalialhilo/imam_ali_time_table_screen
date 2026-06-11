const { createSupabaseAnonClient } = require("./_supabase");
const {
  fromEventDbRow,
  getCopenhagenDateKey,
  getCopenhagenTimeKey,
  jsonResponse,
  sortEventRows,
} = require("./_shared");

function getEventSortKey(event) {
  return `${event.date}T${event.time}`;
}

exports.handler = async function handler() {
  let supabase;

  try {
    supabase = createSupabaseAnonClient();
  } catch (error) {
    return jsonResponse(503, {
      error: "Supabase is not configured for event reads.",
      details: error.message,
    });
  }

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("active", true)
      .eq("archived", false)
      .order("event_date", { ascending: true })
      .order("event_time", { ascending: true })
      .limit(200);

    if (error) {
      return jsonResponse(500, {
        error: "Unable to read events from Supabase.",
        details: error.message,
      });
    }

    const items = sortEventRows((data ?? []).map(fromEventDbRow));
    const nowSortKey = `${getCopenhagenDateKey(new Date())}T${getCopenhagenTimeKey(new Date())}`;
    const futureEvent = items.find((item) => getEventSortKey(item) >= nowSortKey) ?? null;
    const fallbackPastEvent = [...items].reverse().find((item) => getEventSortKey(item) < nowSortKey) ?? null;
    const upcomingEvent = futureEvent ?? fallbackPastEvent;

    return jsonResponse(200, {
      source: "supabase",
      upcomingEvent,
      items: upcomingEvent ? [upcomingEvent] : [],
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while reading events.",
      details: error.message,
    });
  }
};
