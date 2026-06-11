const { createSupabaseAdminClient } = require("./_supabase");
const { fromEventDbRow, jsonResponse, normalizeEventRow, parseJsonBody } = require("./_shared");

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
    const normalized = normalizeEventRow(payload);
    const eventId = normalized.id || String(event.queryStringParameters?.id ?? "").trim();

    if (!eventId) {
      return jsonResponse(400, {
        error: "Event id is required for restore.",
      });
    }

    const { data, error } = await supabase
      .from("events")
      .update({ archived: false, updated_at: new Date().toISOString() })
      .eq("id", eventId)
      .select("*")
      .maybeSingle();

    if (error) {
      return jsonResponse(500, {
        error: "Unable to restore the event in Supabase.",
        details: error.message,
      });
    }

    if (!data) {
      return jsonResponse(404, {
        error: "The event could not be found for restore.",
      });
    }

    return jsonResponse(200, {
      success: true,
      source: "supabase",
      event: fromEventDbRow(data),
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while restoring the event.",
      details: error.message,
    });
  }
};
