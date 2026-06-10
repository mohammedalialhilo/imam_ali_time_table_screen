const { createSupabaseAdminClient } = require("./_supabase");
const { jsonResponse, normalizeEventRow, parseJsonBody } = require("./_shared");

exports.handler = async function handler(event) {
  if (!["POST", "DELETE"].includes(event.httpMethod)) {
    return jsonResponse(405, { error: "Method not allowed. Use POST or DELETE." });
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
    const body = event.httpMethod === "DELETE" ? {} : parseJsonBody(event);
    const normalized = normalizeEventRow(body);
    const eventId = normalized.id || String(event.queryStringParameters?.id ?? "").trim();

    if (!eventId) {
      return jsonResponse(400, {
        error: "Event id is required for deletion.",
      });
    }

    const { data, error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .select("id");

    if (error) {
      return jsonResponse(500, {
        error: "Unable to delete the event from Supabase.",
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
      error: "Unexpected error while deleting the event.",
      details: error.message,
    });
  }
};
