const { jsonResponse, parseJsonBody } = require("./_shared");
const {
  assertNotRemovingLastActiveSuperAdmin,
  findAuthUserByEmail,
  getAdminProfileById,
  normalizeEmail,
  normalizeRole,
  requireAdminAccess,
} = require("./_admin-auth");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPassword(password) {
  return String(password ?? "").length >= 8;
}

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
    const email = normalizeEmail(payload?.email);
    const password = String(payload?.password ?? "");
    const role = normalizeRole(payload?.role);

    if (!email || !EMAIL_PATTERN.test(email)) {
      return jsonResponse(400, { error: "A valid admin email is required." });
    }

    if (!isValidPassword(password)) {
      return jsonResponse(400, { error: "Password must be at least 8 characters long." });
    }

    if (!role) {
      return jsonResponse(400, { error: "Role must be admin or super_admin." });
    }

    const existingUser = await findAuthUserByEmail(access.supabaseAdmin, email);
    if (existingUser?.id) {
      const existingProfile = await getAdminProfileById(access.supabaseAdmin, existingUser.id);

      if (existingProfile?.role === "super_admin" && existingProfile.role !== role) {
        try {
          await assertNotRemovingLastActiveSuperAdmin(access.supabaseAdmin, existingProfile);
        } catch (error) {
          return jsonResponse(400, { error: error.message });
        }
      }

      const { error: profileError } = await access.supabaseAdmin
        .from("admin_profiles")
        .upsert(
          {
            id: existingUser.id,
            email,
            role,
            active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        );

      if (profileError) {
        return jsonResponse(500, {
          error: "The auth user exists, but the admin profile could not be updated.",
          details: profileError.message,
        });
      }

      return jsonResponse(200, {
        success: true,
        message: "Admin account already existed. Profile updated and activated.",
        user: {
          id: existingUser.id,
          email,
          role,
          active: true,
        },
      });
    }

    const { data: createdData, error: createError } = await access.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !createdData?.user?.id) {
      return jsonResponse(500, {
        error: "Unable to create the admin auth user.",
        details: createError?.message || "Unknown auth creation error.",
      });
    }

    const nowIso = new Date().toISOString();
    const { data: profileData, error: profileError } = await access.supabaseAdmin
      .from("admin_profiles")
      .upsert(
        {
          id: createdData.user.id,
          email,
          role,
          active: true,
          created_at: nowIso,
          updated_at: nowIso,
        },
        { onConflict: "id" },
      )
      .select("id, email, role, active, created_at, updated_at")
      .single();

    if (profileError) {
      return jsonResponse(500, {
        error: "Admin auth user was created, but the admin profile could not be saved.",
        details: profileError.message,
      });
    }

    return jsonResponse(200, {
      success: true,
      message: "Admin account created successfully.",
      user: {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        active: Boolean(profileData.active),
        createdAt: profileData.created_at || "",
        updatedAt: profileData.updated_at || "",
      },
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while creating the admin user.",
      details: error.message,
    });
  }
};
