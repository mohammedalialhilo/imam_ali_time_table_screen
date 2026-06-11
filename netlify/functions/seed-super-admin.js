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
  const expectedName = String(name).toLowerCase();
  const headers = event?.headers ?? {};

  const matchingKey = Object.keys(headers).find((key) => key.toLowerCase() === expectedName);
  return matchingKey ? String(headers[matchingKey] ?? "").trim() : "";
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

  let expectedSeedToken;
  try {
    expectedSeedToken = readRequiredEnv("SEED_SETUP_TOKEN");
  } catch (_error) {
    return jsonResponse(503, { error: "Seed setup token is not configured." });
  }

  const providedSeedToken = getHeaderValue(event, "x-seed-token");
  if (!providedSeedToken || !tokensMatch(providedSeedToken, expectedSeedToken)) {
    return jsonResponse(403, { error: "Forbidden." });
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
