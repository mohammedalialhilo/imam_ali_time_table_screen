const { createSupabaseAdminClient } = require("./_supabase");
const { jsonResponse, normalizeEventRow, parseJsonBody } = require("./_shared");

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
    const confirmed = payload?.confirm === true;

    if (!eventId) {
      return jsonResponse(400, {
        error: "Event id is required for permanent deletion.",
      });
    }

    if (!confirmed) {
      return jsonResponse(400, {
        error: "Permanent deletion requires confirm: true.",
      });
    }

    const { data: existing, error: existingError } = await supabase
      .from("events")
      .select("id, archived")
      .eq("id", eventId)
      .maybeSingle();

    if (existingError) {
      return jsonResponse(500, {
        error: "Unable to load the event before permanent deletion.",
        details: existingError.message,
      });
    }

    if (!existing) {
      return jsonResponse(404, {
        error: "The event could not be found for permanent deletion.",
      });
    }

    if (!existing.archived) {
      return jsonResponse(400, {
        error: "Only archived events can be permanently deleted.",
      });
    }

    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .eq("archived", true)
      .select("id");

    if (error) {
      return jsonResponse(500, {
        error: "Unable to permanently delete the event from Supabase.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      source: "supabase",
      deletedId: eventId,
      deletedCount: Array.isArray(data) ? data.length : 0,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while permanently deleting the event.",
      details: error.message,
    });
  }
};
