const { createSupabaseAdminClient, createSupabaseAnonClient } = require("./_supabase");
const { jsonResponse } = require("./_shared");

const ADMIN_ROLES = new Set(["admin", "super_admin"]);

function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeRole(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return ADMIN_ROLES.has(normalized) ? normalized : "";
}

function getHeaderValue(event, headerName) {
  const expected = String(headerName).toLowerCase();
  const headers = event?.headers ?? {};
  const matchedKey = Object.keys(headers).find((key) => key.toLowerCase() === expected);
  return matchedKey ? String(headers[matchedKey] ?? "").trim() : "";
}

function getBearerToken(event) {
  const authorization = getHeaderValue(event, "authorization");
  if (!authorization) {
    return "";
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? String(match[1] ?? "").trim() : "";
}

async function verifySupabaseUser(token) {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user?.id) {
    return { ok: false, error: error?.message || "Invalid or expired session." };
  }

  return {
    ok: true,
    user: data.user,
  };
}

async function getAdminProfileById(supabaseAdmin, userId) {
  const { data, error } = await supabaseAdmin
    .from("admin_profiles")
    .select("id, email, role, active, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load admin profile: ${error.message}`);
  }

  return data ?? null;
}

async function requireAdminAccess(event, options = {}) {
  const requireSuperAdmin = options.requireSuperAdmin === true;
  const token = getBearerToken(event);

  if (!token) {
    return {
      ok: false,
      response: jsonResponse(401, { error: "Missing Authorization Bearer token." }),
    };
  }

  let verifiedUser;
  try {
    verifiedUser = await verifySupabaseUser(token);
  } catch (error) {
    return {
      ok: false,
      response: jsonResponse(503, {
        error: "Supabase auth verification is not configured.",
        details: error.message,
      }),
    };
  }

  if (!verifiedUser.ok) {
    return {
      ok: false,
      response: jsonResponse(401, { error: "Invalid or expired session." }),
    };
  }

  let supabaseAdmin;
  try {
    supabaseAdmin = createSupabaseAdminClient();
  } catch (error) {
    return {
      ok: false,
      response: jsonResponse(503, {
        error: "Supabase admin client is not configured.",
        details: error.message,
      }),
    };
  }

  try {
    const profile = await getAdminProfileById(supabaseAdmin, verifiedUser.user.id);

    if (!profile) {
      return {
        ok: false,
        response: jsonResponse(403, { error: "No admin profile found for this user." }),
      };
    }

    if (!profile.active) {
      return {
        ok: false,
        response: jsonResponse(403, { error: "This admin account is disabled." }),
      };
    }

    if (requireSuperAdmin && profile.role !== "super_admin") {
      return {
        ok: false,
        response: jsonResponse(403, { error: "Super admin access is required for this action." }),
      };
    }

    return {
      ok: true,
      token,
      user: verifiedUser.user,
      profile,
      supabaseAdmin,
    };
  } catch (error) {
    return {
      ok: false,
      response: jsonResponse(500, {
        error: "Unable to validate admin access.",
        details: error.message,
      }),
    };
  }
}

async function listAuthUsers(supabaseAdmin, options = {}) {
  const perPage = Number(options.perPage ?? 1000);
  const maxPages = Number(options.maxPages ?? 50);
  const users = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(`Unable to list auth users: ${error.message}`);
    }

    const batch = data?.users ?? [];
    users.push(...batch);

    if (batch.length < perPage) {
      break;
    }
  }

  return users;
}

async function findAuthUserByEmail(supabaseAdmin, email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  const users = await listAuthUsers(supabaseAdmin);
  return users.find((user) => normalizeEmail(user.email) === normalizedEmail) ?? null;
}

async function countActiveSuperAdmins(supabaseAdmin) {
  const { count, error } = await supabaseAdmin
    .from("admin_profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin")
    .eq("active", true);

  if (error) {
    throw new Error(`Unable to count active super admins: ${error.message}`);
  }

  return Number(count ?? 0);
}

async function assertNotRemovingLastActiveSuperAdmin(supabaseAdmin, profile) {
  if (!profile || profile.role !== "super_admin" || !profile.active) {
    return;
  }

  const activeSuperAdminCount = await countActiveSuperAdmins(supabaseAdmin);
  if (activeSuperAdminCount <= 1) {
    throw new Error("Cannot remove, disable, or demote the last active super admin.");
  }
}

module.exports = {
  ADMIN_ROLES,
  assertNotRemovingLastActiveSuperAdmin,
  countActiveSuperAdmins,
  findAuthUserByEmail,
  getAdminProfileById,
  getBearerToken,
  normalizeEmail,
  normalizeRole,
  requireAdminAccess,
};
