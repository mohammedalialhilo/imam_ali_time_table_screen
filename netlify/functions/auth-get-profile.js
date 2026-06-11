const { jsonResponse } = require("./_shared");
const { requireAdminAccess } = require("./_admin-auth");

exports.handler = async function handler(event) {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed. Use GET." });
  }

  const access = await requireAdminAccess(event);
  if (!access.ok) {
    return access.response;
  }

  return jsonResponse(200, {
    success: true,
    profile: {
      id: access.profile.id,
      email: access.profile.email || access.user.email || "",
      role: access.profile.role,
      active: Boolean(access.profile.active),
    },
  });
};
