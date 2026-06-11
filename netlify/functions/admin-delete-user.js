const { jsonResponse, parseJsonBody } = require("./_shared");
const {
  assertNotRemovingLastActiveSuperAdmin,
  getAdminProfileById,
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
    const permanent = payload?.permanent === true;

    if (!userId) {
      return jsonResponse(400, { error: "User id is required." });
    }

    const existingProfile = await getAdminProfileById(access.supabaseAdmin, userId);
    if (!existingProfile) {
      return jsonResponse(404, { error: "The admin profile could not be found." });
    }

    if (!permanent) {
      if (!existingProfile.active) {
        return jsonResponse(200, {
          success: true,
          message: "Admin account is already disabled.",
          mode: "disabled",
          user: {
            id: existingProfile.id,
            email: existingProfile.email,
            role: existingProfile.role,
            active: false,
          },
        });
      }

      try {
        await assertNotRemovingLastActiveSuperAdmin(access.supabaseAdmin, existingProfile);
      } catch (error) {
        return jsonResponse(400, { error: error.message });
      }

      const { data, error } = await access.supabaseAdmin
        .from("admin_profiles")
        .update({
          active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("id, email, role, active, created_at, updated_at")
        .single();

      if (error) {
        return jsonResponse(500, {
          error: "Unable to disable the admin account before deletion.",
          details: error.message,
        });
      }

      return jsonResponse(200, {
        success: true,
        message: "Admin account deactivated. Use permanent deletion only if you truly need to remove it.",
        mode: "disabled",
        user: {
          id: data.id,
          email: data.email,
          role: data.role,
          active: Boolean(data.active),
          createdAt: data.created_at || "",
          updatedAt: data.updated_at || "",
        },
      });
    }

    if (existingProfile.active) {
      return jsonResponse(400, {
        error: "Disable the admin account first before permanent deletion.",
      });
    }

    const { error } = await access.supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      return jsonResponse(500, {
        error: "Unable to permanently delete the admin account.",
        details: error.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Admin account permanently deleted.",
      mode: "deleted",
      deletedId: userId,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while deleting the admin account.",
      details: error.message,
    });
  }
};
