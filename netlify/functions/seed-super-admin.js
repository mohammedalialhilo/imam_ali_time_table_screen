const { timingSafeEqual } = require("node:crypto");

const { findAuthUserByEmail, normalizeEmail } = require("./_admin-auth");
const { jsonResponse } = require("./_shared");
const { createSupabaseAdminClient } = require("./_supabase");

const REQUIRED_SEED_EMAIL = "noorlocatoor@gmail.com";
const SUPER_ADMIN_ROLE = "super_admin";

function readEnvValue(name) {
  return String(process.env[name] ?? "").trim();
}

function readSeedEmail() {
  const configuredEmail = normalizeEmail(readEnvValue("SEED_SUPER_ADMIN_EMAIL") || REQUIRED_SEED_EMAIL);

  if (!configuredEmail) {
    return {
      ok: false,
      response: jsonResponse(500, {
        error: "Missing environment variable",
        missing: "SEED_SUPER_ADMIN_EMAIL",
      }),
    };
  }

  if (configuredEmail !== REQUIRED_SEED_EMAIL) {
    return {
      ok: false,
      response: jsonResponse(500, {
        error: "Server configuration error",
        message: `SEED_SUPER_ADMIN_EMAIL must be ${REQUIRED_SEED_EMAIL}.`,
      }),
    };
  }

  return {
    ok: true,
    email: configuredEmail,
  };
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
      if (Object.prototype.hasOwnProperty.call(headers, candidate)) {
        const value = headers[candidate];
        if (Array.isArray(value)) {
          const firstNonEmpty = value.find((item) => String(item ?? "").trim());
          return String(firstNonEmpty ?? "").trim();
        }

        return String(value ?? "").trim();
      }
    }

    const matchingKey = Object.keys(headers).find(
      (key) => String(key).toLowerCase() === normalizedExpectedName,
    );

    if (matchingKey) {
      const value = headers[matchingKey];
      if (Array.isArray(value)) {
        const firstNonEmpty = value.find((item) => String(item ?? "").trim());
        return String(firstNonEmpty ?? "").trim();
      }

      return String(value ?? "").trim();
    }
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
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function missingEnvResponse(name) {
  return jsonResponse(500, {
    error: "Missing environment variable",
    missing: name,
  });
}

function getRequiredEnv(name) {
  const value = readEnvValue(name);
  return value ? { ok: true, value } : { ok: false, response: missingEnvResponse(name) };
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
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
  }

  console.info("Seed function started");

  const cleanProvidedToken = String(getProvidedSeedToken(event) || "").trim();
  const expectedSeedTokenResult = getRequiredEnv("SEED_SETUP_TOKEN");
  if (!expectedSeedTokenResult.ok) {
    console.info("[seed-super-admin] token validation", {
      hasSeedSetupToken: false,
      hasProvidedSeedToken: Boolean(cleanProvidedToken),
    });
    return expectedSeedTokenResult.response;
  }

  const cleanExpectedToken = String(expectedSeedTokenResult.value || "").trim();

  console.info("[seed-super-admin] token validation", {
    hasSeedSetupToken: Boolean(cleanExpectedToken),
    hasProvidedSeedToken: Boolean(cleanProvidedToken),
  });

  if (!cleanProvidedToken || !tokensMatch(cleanProvidedToken, cleanExpectedToken)) {
    return jsonResponse(403, {
      error: "Forbidden",
      message: "Missing or invalid seed token.",
    });
  }

  console.info("Seed token accepted");

  const requiredEnvNames = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SEED_SUPER_ADMIN_EMAIL",
    "SEED_SUPER_ADMIN_PASSWORD",
  ];

  for (const envName of requiredEnvNames) {
    const result = getRequiredEnv(envName);
    if (!result.ok) {
      return result.response;
    }
  }

  const seedEmailResult = readSeedEmail();
  if (!seedEmailResult.ok) {
    return seedEmailResult.response;
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error) {
    return jsonResponse(500, {
      error: "Server configuration error",
      message: error.message,
    });
  }

  console.info("Supabase client created");

  const seedEmail = seedEmailResult.email;
  const seedPassword = readEnvValue("SEED_SUPER_ADMIN_PASSWORD");

  try {
    console.info("Creating or finding super admin user");

    let user;
    try {
      user = await findAuthUserByEmail(supabase, seedEmail);
    } catch (error) {
      return jsonResponse(500, {
        error: "Supabase auth error",
        message: error.message,
      });
    }

    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: seedEmail,
        password: seedPassword,
        email_confirm: true,
      });

      if (error) {
        const conflictDetected = /already|registered|exists|duplicate/i.test(error.message);
        if (!conflictDetected) {
          return jsonResponse(500, {
            error: "Supabase auth error",
            message: error.message,
          });
        }

        try {
          user = await findAuthUserByEmail(supabase, seedEmail);
        } catch (lookupError) {
          return jsonResponse(500, {
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
        error: "Supabase auth error",
        message: "Unable to locate the super admin user after seeding.",
      });
    }

    console.info("Creating or updating admin profile");

    const profileResult = await ensureAdminProfile(supabase, user.id, seedEmail);
    if (!profileResult.ok) {
      return jsonResponse(500, {
        error: "Admin profile error",
        message: profileResult.error.message,
      });
    }

    console.info("Seed completed");

    return jsonResponse(200, {
      success: true,
      message: "Super admin seeded successfully.",
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Server configuration error",
      message: error.message,
    });
  }
};
