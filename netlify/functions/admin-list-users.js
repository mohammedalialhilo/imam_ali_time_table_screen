const { jsonResponse } = require("./_shared");
const { requireAdminAccess } = require("./_admin-auth");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed. Use GET." });
  }

  const access = await requireAdminAccess(event, { requireSuperAdmin: true });
  if (!access.ok) {
    return access.response;
  }

  try {
    const { data, error } = await access.supabaseAdmin
      .from("admin_profiles")
      .select("id, email, role, active, created_at, updated_at")
      .order("created_at", { ascending: true });

    if (error) {
      return jsonResponse(500, {
        error: "Unable to list admin users.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      items: (data ?? []).map((item) => ({
        id: item.id,
        email: item.email,
        role: item.role,
        active: Boolean(item.active),
        createdAt: item.created_at || "",
        updatedAt: item.updated_at || "",
      })),
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while listing admin users.",
      details: error.message,
    });
  }
};
