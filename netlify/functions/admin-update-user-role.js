const { jsonResponse, parseJsonBody } = require("./_shared");
const {
  assertNotRemovingLastActiveSuperAdmin,
  getAdminProfileById,
  normalizeRole,
  requireAdminAccess,
} = require("./_admin-auth");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
  }

  const access = await requireAdminAccess(event, { requireSuperAdmin: true });
  if (!access.ok) {
    return access.response;
  }

  try {
    const payload = parseJsonBody(event);
    const userId = String(payload?.id ?? "").trim();
    const nextRole = normalizeRole(payload?.role);

    if (!userId) {
      return jsonResponse(400, { error: "User id is required." });
    }

    if (!nextRole) {
      return jsonResponse(400, { error: "Role must be admin or super_admin." });
    }

    const existingProfile = await getAdminProfileById(access.supabaseAdmin, userId);
    if (!existingProfile) {
      return jsonResponse(404, { error: "The admin profile could not be found." });
    }

    if (existingProfile.role === "super_admin" && nextRole !== "super_admin") {
      try {
        await assertNotRemovingLastActiveSuperAdmin(access.supabaseAdmin, existingProfile);
      } catch (error) {
        return jsonResponse(400, { error: error.message });
      }
    }

    const { data, error } = await access.supabaseAdmin
      .from("admin_profiles")
      .update({
        role: nextRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("id, email, role, active, created_at, updated_at")
      .single();

    if (error) {
      return jsonResponse(500, {
        error: "Unable to update the admin role.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      user: {
        id: data.id,
        email: data.email,
        role: data.role,
        active: Boolean(data.active),
        createdAt: data.created_at || "",
        updatedAt: data.updated_at || "",
      },
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while updating the admin role.",
      details: error.message,
    });
  }
};
