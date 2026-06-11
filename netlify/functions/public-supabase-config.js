const { createSupabaseAnonClient } = require("./_supabase");
const { jsonResponse } = require("./_shared");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed. Use GET." });
  }

  try {
    createSupabaseAnonClient();
    return jsonResponse(200, {
      supabaseUrl: String(process.env.SUPABASE_URL ?? "").trim(),
      supabaseAnonKey: String(process.env.SUPABASE_ANON_KEY ?? "").trim(),
    });
  } catch (error) {
    return jsonResponse(503, {
      error: "Public Supabase config is not available.",
      details: error.message,
    });
  }
};
