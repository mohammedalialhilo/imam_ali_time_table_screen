import { loadPublicSupabaseConfig } from "./remote-data.js";

const SUPABASE_CDN_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";

let supabaseLibraryPromise = null;
let supabaseClientPromise = null;

function canUseBrowserAuth() {
  return typeof window !== "undefined"
    && typeof document !== "undefined"
    && window.location.protocol !== "file:";
}

function loadSupabaseLibrary() {
  if (window.supabase?.createClient) {
    return Promise.resolve(window.supabase);
  }

  if (supabaseLibraryPromise) {
    return supabaseLibraryPromise;
  }

  supabaseLibraryPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-supabase-browser="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.supabase));
      existingScript.addEventListener("error", () => reject(new Error("Could not load Supabase browser library.")));
      return;
    }

    const script = document.createElement("script");
    script.src = SUPABASE_CDN_URL;
    script.async = true;
    script.dataset.supabaseBrowser = "true";
    script.onload = () => {
      if (window.supabase?.createClient) {
        resolve(window.supabase);
        return;
      }

      reject(new Error("Supabase browser library did not initialize correctly."));
    };
    script.onerror = () => reject(new Error("Could not load Supabase browser library."));
    document.head.appendChild(script);
  });

  return supabaseLibraryPromise;
}

export async function getSupabaseBrowserClient() {
  if (!canUseBrowserAuth()) {
    throw new Error("Supabase login requires http/https or a deployed Netlify site.");
  }

  if (supabaseClientPromise) {
    return supabaseClientPromise;
  }

  supabaseClientPromise = (async () => {
    const [library, configResult] = await Promise.all([
      loadSupabaseLibrary(),
      loadPublicSupabaseConfig(),
    ]);

    if (!configResult.ok) {
      if (configResult.status === 404) {
        throw new Error("Supabase admin functions are not available on this site yet.");
      }

      throw new Error(configResult.error || "Supabase public config is unavailable.");
    }

    const supabaseUrl = String(configResult.data?.supabaseUrl ?? "").trim();
    const supabaseAnonKey = String(configResult.data?.supabaseAnonKey ?? "").trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase public config is incomplete.");
    }

    return library.createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  })();

  return supabaseClientPromise;
}
