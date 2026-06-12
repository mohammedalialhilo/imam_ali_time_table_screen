const { timingSafeEqual } = require("node:crypto");

const { findAuthUserByEmail, normalizeEmail } = require("./_admin-auth");
const { jsonResponse } = require("./_shared");
const { createSupabaseAdminClient } = require("./_supabase");

const REQUIRED_SEED_EMAIL = "noorlocatoor@gmail.com";
const SUPER_ADMIN_ROLE = "super_admin";

function readRequiredEnv(name) {
  const value = String(process.env[name] ?? "").trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function readSeedEmail() {
  const configuredEmail = normalizeEmail(
    process.env.SEED_SUPER_ADMIN_EMAIL ?? REQUIRED_SEED_EMAIL,
  );

  if (!configuredEmail) {
    throw new Error("Missing required environment variable: SEED_SUPER_ADMIN_EMAIL");
  }

  if (configuredEmail !== REQUIRED_SEED_EMAIL) {
    throw new Error(`SEED_SUPER_ADMIN_EMAIL must be ${REQUIRED_SEED_EMAIL}.`);
  }

  return configuredEmail;
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

  if (error) {
    throw new Error(`Unable to save admin profile: ${error.message}`);
  }
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed. Use POST." });
  }

  const cleanProvidedToken = String(getProvidedSeedToken(event) || "").trim();
  let expectedSeedToken;
  try {
    expectedSeedToken = readRequiredEnv("SEED_SETUP_TOKEN");
  } catch (_error) {
    console.info("[seed-super-admin] token validation", {
      hasSeedSetupToken: false,
      hasProvidedSeedToken: Boolean(cleanProvidedToken),
    });

    return jsonResponse(500, {
      error: "Server configuration error",
      message: "SEED_SETUP_TOKEN is not configured.",
    });
  }

  const cleanExpectedToken = String(expectedSeedToken || "").trim();

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

  let supabase;
  let seedEmail;
  let seedPassword;
  try {
    supabase = createSupabaseAdminClient();
    seedEmail = readSeedEmail();
    seedPassword = readRequiredEnv("SEED_SUPER_ADMIN_PASSWORD");
  } catch (error) {
    return jsonResponse(503, {
      error: "Seed function is not fully configured.",
      details: error.message,
    });
  }

  try {
    let user = await findAuthUserByEmail(supabase, seedEmail);
    let createdNewUser = false;

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
            error: "Unable to create the super admin user.",
            details: error.message,
          });
        }

        user = await findAuthUserByEmail(supabase, seedEmail);
      } else {
        user = data?.user ?? null;
        createdNewUser = true;
      }
    }

    if (!user?.id) {
      return jsonResponse(500, {
        error: "Unable to locate the super admin user after seeding.",
      });
    }

    await ensureAdminProfile(supabase, user.id, seedEmail);

    return jsonResponse(200, {
      success: true,
      message: createdNewUser
        ? "Super admin seeded successfully"
        : "Super admin already exists and is active",
      email: seedEmail,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unexpected error while seeding the super admin user.",
      details: error.message,
    });
  }
};
