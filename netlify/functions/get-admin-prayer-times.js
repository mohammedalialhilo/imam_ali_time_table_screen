const { createSupabaseAdminClient } = require("./_supabase");
const { fromPrayerDbRow, jsonResponse, sortPrayerRows } = require("./_shared");

function parseArchivedFilter(event) {
  const rawValue = String(event?.queryStringParameters?.archived ?? "").trim().toLowerCase();
  if (rawValue === "true") {
    return true;
  }
  if (rawValue === "all") {
    return "all";
  }
  return false;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed. Use GET." });
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error) {
    return jsonResponse(503, {
      error: "Supabase admin client is not configured.",
      details: error.message,
    });
  }

  try {
    const archivedFilter = parseArchivedFilter(event);
    let query = supabase
      .from("prayer_times")
      .select("*")
      .order("date", { ascending: true });

    if (archivedFilter !== "all") {
      query = query.eq("archived", archivedFilter);
    }

    const { data, error } = await query;

    if (error) {
      return jsonResponse(500, {
        error: "Unable to read prayer times from Supabase.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      source: "supabase",
      archived: archivedFilter,
      items: sortPrayerRows((data ?? []).map(fromPrayerDbRow)),
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while reading prayer times.",
      details: error.message,
    });
  }
};
