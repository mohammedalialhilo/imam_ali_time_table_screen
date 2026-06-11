import { APP_CONFIG } from "./config.js";

let remoteAuthTokenProvider = null;

function canUseRemoteFunctions() {
  return typeof window !== "undefined"
    && window.location.protocol !== "file:"
    && typeof fetch === "function";
}

function buildJsonHeaders(headers = {}) {
  return {
    Accept: "application/json",
    ...headers,
  };
}

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export function setRemoteAuthTokenProvider(provider) {
  remoteAuthTokenProvider = typeof provider === "function" ? provider : null;
}

async function requestJson(url, options = {}) {
  if (!canUseRemoteFunctions()) {
    return {
      ok: false,
      skipped: true,
      status: 0,
      data: null,
      error: "Remote functions are unavailable in direct file-open mode.",
    };
  }

  const headers = buildJsonHeaders(options.headers);
  if (remoteAuthTokenProvider) {
    const token = await remoteAuthTokenProvider();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const requestOptions = {
    cache: "no-store",
    ...options,
    headers,
  };

  if (options.body && typeof options.body !== "string") {
    requestOptions.body = JSON.stringify(options.body);
    requestOptions.headers = buildJsonHeaders({
      "Content-Type": "application/json",
      ...headers,
    });
  }

  try {
    const response = await fetch(url, requestOptions);
    let data = null;

    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }

    return {
      ok: response.ok,
      skipped: false,
      status: response.status,
      data,
      error: response.ok ? "" : String(data?.error ?? data?.details ?? `HTTP ${response.status}`),
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      status: 0,
      data: null,
      error: error.message,
    };
  }
}

export function getRemoteFailureMessage(result, fallbackMessage = APP_CONFIG.syncMessages.unavailable) {
  if (result?.skipped) {
    return APP_CONFIG.syncMessages.localOnly;
  }

  if (result?.status === 401) {
    return "Your admin session is missing or has expired. Please log in again.";
  }

  if (result?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (result?.status === 503) {
    return APP_CONFIG.syncMessages.saveError;
  }

  if (result?.error) {
    return `${fallbackMessage} ${result.error}`.trim();
  }

  return fallbackMessage;
}

export async function loadPublicSupabaseConfig() {
  return requestJson(APP_CONFIG.apiPaths.publicSupabaseConfig);
}

export async function loadAuthProfile() {
  return requestJson(APP_CONFIG.apiPaths.authGetProfile);
}

export async function loadPrayerTimesFromRemote(dateKey) {
  const query = buildQueryString({ date: dateKey });
  return requestJson(`${APP_CONFIG.apiPaths.todayPrayerTimes}${query}`);
}

export async function loadUpcomingEventFromRemote() {
  return requestJson(APP_CONFIG.apiPaths.upcomingEvent);
}

export async function loadAdminPrayerTimesFromRemote(options = {}) {
  const query = buildQueryString({
    archived: options.archived ?? false,
  });
  return requestJson(`${APP_CONFIG.apiPaths.adminPrayerTimes}${query}`);
}

export async function loadAdminEventsFromRemote(options = {}) {
  const query = buildQueryString({
    archived: options.archived ?? false,
  });
  return requestJson(`${APP_CONFIG.apiPaths.adminEvents}${query}`);
}

export async function savePrayerTimesRemotely(items) {
  return requestJson(APP_CONFIG.apiPaths.savePrayerTimes, {
    method: "POST",
    body: { items },
  });
}

export async function saveEventRemotely(event) {
  return requestJson(APP_CONFIG.apiPaths.saveEvent, {
    method: "POST",
    body: event,
  });
}

export async function archiveEventRemotely(eventId) {
  return requestJson(APP_CONFIG.apiPaths.archiveEvent, {
    method: "POST",
    body: { id: eventId },
  });
}

export async function restoreEventRemotely(eventId) {
  return requestJson(APP_CONFIG.apiPaths.restoreEvent, {
    method: "POST",
    body: { id: eventId },
  });
}

export async function restorePrayerTimesRemotely(payload) {
  return requestJson(APP_CONFIG.apiPaths.restorePrayerTimes, {
    method: "POST",
    body: payload,
  });
}

export async function permanentlyDeleteEventRemotely(eventId) {
  return requestJson(APP_CONFIG.apiPaths.permanentlyDeleteEvent, {
    method: "POST",
    body: { id: eventId, confirm: true },
  });
}

export async function permanentlyDeletePrayerTimesRemotely(payload) {
  return requestJson(APP_CONFIG.apiPaths.permanentlyDeletePrayerTimes, {
    method: "POST",
    body: { ...payload, confirm: true },
  });
}

export async function loadAdminUsersFromRemote() {
  return requestJson(APP_CONFIG.apiPaths.adminListUsers);
}

export async function createAdminUserRemotely(payload) {
  return requestJson(APP_CONFIG.apiPaths.adminCreateUser, {
    method: "POST",
    body: payload,
  });
}

export async function updateAdminUserRoleRemotely(payload) {
  return requestJson(APP_CONFIG.apiPaths.adminUpdateUserRole, {
    method: "POST",
    body: payload,
  });
}

export async function disableAdminUserRemotely(userId) {
  return requestJson(APP_CONFIG.apiPaths.adminDisableUser, {
    method: "POST",
    body: { id: userId },
  });
}

export async function deleteAdminUserRemotely(userId, options = {}) {
  return requestJson(APP_CONFIG.apiPaths.adminDeleteUser, {
    method: "POST",
    body: {
      id: userId,
      permanent: options.permanent === true,
    },
  });
}

export async function checkSupabaseConnection() {
  const result = await loadUpcomingEventFromRemote();
  if (result.ok) {
    return {
      connected: true,
      message: APP_CONFIG.syncMessages.connected,
      detail: "Supabase",
    };
  }

  return {
    connected: false,
    message: result.status === 503
      ? APP_CONFIG.syncMessages.saveError
      : APP_CONFIG.syncMessages.unavailable,
    detail: result.skipped ? "localStorage fallback" : "localStorage fallback",
    error: result.error,
  };
}
