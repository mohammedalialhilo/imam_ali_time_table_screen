const { createSupabaseAdminClient } = require("./_supabase");
const { isValidDateKey, jsonResponse, parseJsonBody } = require("./_shared");

const MONTH_KEY_PATTERN = /^\d{4}-\d{2}$/;

function pad(value) {
  return String(value).padStart(2, "0");
}

function normalizeDateList(payload = {}) {
  const dates = [];
  if (payload.date) {
    dates.push(String(payload.date).trim());
  }
  if (Array.isArray(payload.dates)) {
    payload.dates.forEach((dateKey) => {
      dates.push(String(dateKey).trim());
    });
  }
  return [...new Set(dates.filter((dateKey) => isValidDateKey(dateKey)))];
}

function getMonthRange(monthKey) {
  if (!MONTH_KEY_PATTERN.test(String(monthKey ?? "").trim())) {
    return null;
  }

  const [year, month] = String(monthKey).split("-").map(Number);
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  return {
    monthKey: `${year}-${pad(month)}`,
    start: `${year}-${pad(month)}-01`,
    endExclusive: `${nextMonth.year}-${pad(nextMonth.month)}-01`,
  };
}

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
    const confirmed = payload?.confirm === true;
    const dates = normalizeDateList(payload);
    const monthRange = dates.length === 0 ? getMonthRange(payload.month) : null;

    if (!confirmed) {
      return jsonResponse(400, {
        error: "Permanent deletion requires confirm: true.",
      });
    }

    if (dates.length === 0 && !monthRange) {
      return jsonResponse(400, {
        error: "Provide prayer-time dates or a month key like YYYY-MM to permanently delete.",
      });
    }

    let query = supabase
      .from("prayer_times")
      .delete()
      .eq("archived", true);

    if (dates.length > 0) {
      query = query.in("date", dates);
    } else {
      query = query.gte("date", monthRange.start).lt("date", monthRange.endExclusive);
    }

    const { data, error } = await query.select("date");

    if (error) {
      return jsonResponse(500, {
        error: "Unable to permanently delete prayer times from Supabase.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      source: "supabase",
      count: Array.isArray(data) ? data.length : 0,
      month: monthRange?.monthKey ?? "",
      dates: Array.isArray(data) ? data.map((item) => item.date) : [],
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while permanently deleting prayer times.",
      details: error.message,
    });
  }
};
