const { createSupabaseAdminClient } = require("./_supabase");
const {
  fromEventDbRow,
  jsonResponse,
  normalizeEventRow,
  parseJsonBody,
  toEventDbRow,
  validateEventRow,
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
    const normalized = normalizeEventRow(payload?.event ?? payload);
    const validation = validateEventRow(normalized);

    if (!validation.valid) {
      return jsonResponse(400, {
        error: "Event validation failed.",
        details: validation.errors,
      });
    }

    let existingRow = null;
    if (normalized.id) {
      const { data: currentData, error: currentError } = await supabase
        .from("events")
        .select("id, created_at")
        .eq("id", normalized.id)
        .maybeSingle();

      if (currentError) {
        return jsonResponse(500, {
          error: "Unable to load the existing event before saving.",
          details: currentError.message,
        });
      }

      existingRow = currentData ?? null;
    }

    const dbRow = toEventDbRow(normalized, existingRow ?? {});
    const { data, error } = await supabase
      .from("events")
      .upsert(dbRow, { onConflict: "id" })
      .select("*")
      .single();

    if (error) {
      return jsonResponse(500, {
        error: "Unable to save the event to Supabase.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      source: "supabase",
      event: fromEventDbRow(data ?? dbRow),
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while saving the event.",
      details: error.message,
    });
  }
};
