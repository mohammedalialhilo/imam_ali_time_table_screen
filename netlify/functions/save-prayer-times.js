const { createSupabaseAdminClient } = require("./_supabase");
const {
  fromPrayerDbRow,
  jsonResponse,
  normalizePrayerRows,
  parseJsonBody,
  sortPrayerRows,
  toPrayerDbRow,
  validatePrayerRows,
} = require("./_shared");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
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
    const payload = parseJsonBody(event);
    const rows = normalizePrayerRows(payload);

    if (rows.length === 0) {
      return jsonResponse(400, {
        error: "Provide prayer times as an array or as { items: [...] }.",
      });
    }

    const validation = validatePrayerRows(rows);
    if (!validation.valid) {
      return jsonResponse(400, {
        error: "Prayer-time validation failed.",
        details: validation.errors,
      });
    }

    const { data, error } = await supabase
      .from("prayer_times")
      .upsert(validation.items.map((row) => toPrayerDbRow(row, { archived: false })), { onConflict: "date" })
      .select("*");

    if (error) {
      return jsonResponse(500, {
        error: "Unable to save prayer times to Supabase.",
        details: error.message,
      });
    }

    const items = sortPrayerRows((data ?? validation.items).map(fromPrayerDbRow));
    return jsonResponse(200, {
      success: true,
      source: "supabase",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while saving prayer times.",
      details: error.message,
    });
  }
};
