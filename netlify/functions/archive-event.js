const { requireAdminAccess } = require("./_admin-auth");
const { fromEventDbRow, jsonResponse, normalizeEventRow, parseJsonBody } = require("./_shared");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
  }

  const access = await requireAdminAccess(event);
  if (!access.ok) {
    return access.response;
  }

  try {
    const payload = parseJsonBody(event);
    const normalized = normalizeEventRow(payload);
    const eventId = normalized.id || String(event.queryStringParameters?.id ?? "").trim();

    if (!eventId) {
      return jsonResponse(400, {
        error: "Event id is required for archiving.",
      });
    }

    const { data, error } = await access.supabaseAdmin
      .from("events")
      .update({ archived: true, updated_at: new Date().toISOString() })
      .eq("id", eventId)
      .select("*")
      .maybeSingle();

    if (error) {
      return jsonResponse(500, {
        error: "Unable to archive the event in Supabase.",
        details: error.message,
      });
    }

    if (!data) {
      return jsonResponse(404, {
        error: "The event could not be found for archiving.",
      });
    }

    return jsonResponse(200, {
      success: true,
      source: "supabase",
      event: fromEventDbRow(data),
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while archiving the event.",
      details: error.message,
    });
  }
};
