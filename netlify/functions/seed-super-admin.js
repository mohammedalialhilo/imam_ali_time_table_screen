const { timingSafeEqual } = require("node:crypto");
const { createClient } = require("@supabase/supabase-js");

const { findAuthUserByEmail, normalizeEmail } = require("./_admin-auth");
const { jsonResponse } = require("./_shared");

const SUPER_ADMIN_ROLE = "super_admin";

function readEnvValue(name) {
  return String(process.env[name] ?? "").trim();
}

function missingEnvResponse(name) {
  return jsonResponse(500, {
    success: false,
    error: "Missing environment variable",
    missing: name,
  });
}

function getRequiredEnv(name) {
  const value = readEnvValue(name);
  return value ? { ok: true, value } : { ok: false, response: missingEnvResponse(name) };
}

function getHeaderValue(event, name) {
  const expectedName = String(name ?? "").trim();
  if (!expectedName) {
    return "";
  }

  const normalizedExpectedName = expectedName.toLowerCase();
  const headerMaps = [event?.headers ?? {}, event?.multiValueHeaders ?? {}];

  for (const headers of headerMaps) {
    if (!headers || typeof headers !== "object") {
      continue;
    }

    const directCandidates = [
      expectedName,
      expectedName.toLowerCase(),
      expectedName.toUpperCase(),
    ];

    for (const candidate of directCandidates) {
      if (!Object.prototype.hasOwnProperty.call(headers, candidate)) {
        continue;
      }

      const value = headers[candidate];
      if (Array.isArray(value)) {
        const firstNonEmpty = value.find((item) => String(item ?? "").trim());
        return String(firstNonEmpty ?? "").trim();
      }

      return String(value ?? "").trim();
    }

    const matchingKey = Object.keys(headers).find(
      (key) => String(key).toLowerCase() === normalizedExpectedName,
    );

    if (!matchingKey) {
      continue;
    }

    const value = headers[matchingKey];
    if (Array.isArray(value)) {
      const firstNonEmpty = value.find((item) => String(item ?? "").trim());
      return String(firstNonEmpty ?? "").trim();
    }

    return String(value ?? "").trim();
  }

  return "";
}

function getProvidedSeedToken(event) {
  return String(
    getHeaderValue(event, "x-seed-token")
      || getHeaderValue(event, "X-Seed-Token")
      || getHeaderValue(event, "X-SEED-TOKEN")
      || event?.headers?.["x-seed-token"]
      || event?.headers?.["X-Seed-Token"]
      || event?.headers?.["X-SEED-TOKEN"]
      || event?.multiValueHeaders?.["x-seed-token"]?.[0]
      || event?.multiValueHeaders?.["X-Seed-Token"]?.[0]
      || event?.multiValueHeaders?.["X-SEED-TOKEN"]?.[0]
      || "",
  ).trim();
}

function tokensMatch(left, right) {
  const leftBuffer = Buffer.from(String(left ?? ""));
  const rightBuffer = Buffer.from(String(right ?? ""));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function createSupabaseAdminClient(supabaseUrl, serviceRoleKey) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function ensureAdminProfile(supabase, userId, email) {
  const { error } = await supabase
    .from("admin_profiles")
    .upsert(
      {
        id: userId,
        email,
        role: SUPER_ADMIN_ROLE,
        active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

  return {
    ok: !error,
    error,
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      success: false,
      error: "Method not allowed",
      message: "Use POST.",
    });
  }

  console.info("Seed function started");

  const cleanProvidedToken = String(getProvidedSeedToken(event) || "").trim();
  const seedTokenEnv = getRequiredEnv("SEED_SETUP_TOKEN");
  if (!seedTokenEnv.ok) {
    return seedTokenEnv.response;
  }

  const cleanExpectedToken = String(seedTokenEnv.value || "").trim();

  console.info("[seed-super-admin] token validation", {
    hasSeedSetupToken: Boolean(cleanExpectedToken),
    hasProvidedSeedToken: Boolean(cleanProvidedToken),
  });

  if (!cleanProvidedToken || !tokensMatch(cleanProvidedToken, cleanExpectedToken)) {
    return jsonResponse(403, {
      success: false,
      error: "Forbidden",
      message: "Missing or invalid seed token.",
    });
  }

  console.info("Seed token accepted");
  console.info("Checking required environment variables");

  const requiredEnvNames = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SEED_SUPER_ADMIN_EMAIL",
    "SEED_SUPER_ADMIN_PASSWORD",
    "SEED_SETUP_TOKEN",
  ];

  const resolvedEnv = {};
  for (const envName of requiredEnvNames) {
    const result = getRequiredEnv(envName);
    if (!result.ok) {
      return result.response;
    }

    resolvedEnv[envName] = result.value;
  }

  const seedEmail = normalizeEmail(resolvedEnv.SEED_SUPER_ADMIN_EMAIL);
  if (!seedEmail) {
    return missingEnvResponse("SEED_SUPER_ADMIN_EMAIL");
  }

  const seedPassword = resolvedEnv.SEED_SUPER_ADMIN_PASSWORD;

  let supabase;
  try {
    supabase = createSupabaseAdminClient(
      resolvedEnv.SUPABASE_URL,
      resolvedEnv.SUPABASE_SERVICE_ROLE_KEY,
    );
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      error: "Server configuration error",
      message: error.message,
    });
  }

  console.info("Supabase client created");
  console.info("Creating or finding super admin user");

  let user;
  try {
    user = await findAuthUserByEmail(supabase, seedEmail);
  } catch (error) {
    return jsonResponse(500, {
      success: false,
      error: "Supabase auth error",
      message: error.message,
    });
  }

  if (!user) {
    let createUserResult;
    try {
      createUserResult = await supabase.auth.admin.createUser({
        email: seedEmail,
        password: seedPassword,
        email_confirm: true,
      });
    } catch (error) {
      return jsonResponse(500, {
        success: false,
        error: "Supabase auth error",
        message: error.message,
      });
    }

    const { data, error } = createUserResult;

    if (error) {
      const conflictDetected = /already|registered|exists|duplicate/i.test(String(error.message ?? ""));
      if (!conflictDetected) {
        return jsonResponse(500, {
          success: false,
          error: "Supabase auth error",
          message: error.message,
        });
      }

      try {
        user = await findAuthUserByEmail(supabase, seedEmail);
      } catch (lookupError) {
        return jsonResponse(500, {
          success: false,
          error: "Supabase auth error",
          message: lookupError.message,
        });
      }
    } else {
      user = data?.user ?? null;
    }
  }

  if (!user?.id) {
    return jsonResponse(500, {
      success: false,
      error: "Supabase auth error",
      message: "Unable to locate the super admin user after seeding.",
    });
  }

  console.info("Creating or updating admin_profiles row");

  const profileResult = await ensureAdminProfile(supabase, user.id, seedEmail);
  if (!profileResult.ok) {
    return jsonResponse(500, {
      success: false,
      error: "Admin profile error",
      message: profileResult.error.message,
    });
  }

  console.info("Seed completed");

  return jsonResponse(200, {
    success: true,
    message: "Super admin seeded successfully.",
    email: seedEmail,
    role: SUPER_ADMIN_ROLE,
  });
};
