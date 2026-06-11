const { requireAdminAccess } = require("./_admin-auth");
const { fromPrayerDbRow, isValidDateKey, jsonResponse, parseJsonBody, sortPrayerRows } = require("./_shared");

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
  const monthStart = `${year}-${pad(month)}-01`;
  const nextMonth = month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 };
  return {
    monthKey: `${year}-${pad(month)}`,
    start: monthStart,
    endExclusive: `${nextMonth.year}-${pad(nextMonth.month)}-01`,
  };
}

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
    const dates = normalizeDateList(payload);
    const monthRange = dates.length === 0 ? getMonthRange(payload.month) : null;

    if (dates.length === 0 && !monthRange) {
      return jsonResponse(400, {
        error: "Provide prayer-time dates or a month key like YYYY-MM to restore.",
      });
    }

    let query = access.supabaseAdmin
      .from("prayer_times")
      .update({ archived: false, updated_at: new Date().toISOString() })
      .eq("archived", true);

    if (dates.length > 0) {
      query = query.in("date", dates);
    } else {
      query = query.gte("date", monthRange.start).lt("date", monthRange.endExclusive);
    }

    const { data, error } = await query.select("*");

    if (error) {
      return jsonResponse(500, {
        error: "Unable to restore prayer times in Supabase.",
        details: error.message,
      });
    }

    const items = sortPrayerRows((data ?? []).map(fromPrayerDbRow));
    return jsonResponse(200, {
      success: true,
      source: "supabase",
      count: items.length,
      month: monthRange?.monthKey ?? "",
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while restoring prayer times.",
      details: error.message,
    });
  }
};
