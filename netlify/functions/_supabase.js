const { createClient } = require("@supabase/supabase-js");

function readRequiredEnv(name) {
  const value = String(process.env[name] ?? "").trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSupabaseUrl() {
  return readRequiredEnv("SUPABASE_URL");
}

function getSupabaseAnonKey() {
  return readRequiredEnv("SUPABASE_ANON_KEY");
}

function getSupabaseServiceRoleKey() {
  return readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function createBaseClient(key) {
  return createClient(getSupabaseUrl(), key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createSupabaseAnonClient() {
  return createBaseClient(getSupabaseAnonKey());
}

function createSupabaseAdminClient() {
  return createBaseClient(getSupabaseServiceRoleKey());
}

module.exports = {
  createSupabaseAnonClient,
  createSupabaseAdminClient,
};
