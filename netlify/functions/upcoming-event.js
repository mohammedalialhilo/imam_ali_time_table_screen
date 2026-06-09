const fs = require("fs/promises");
const path = require("path");

function createEventDateTime(event) {
  return new Date(`${event.date}T${event.time}:00`);
}

exports.handler = async function handler() {
  try {
    const filePath = path.join(__dirname, "..", "..", "data", "events.sample.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const payload = JSON.parse(fileContent);

    const activeEvents = payload
      .filter((event) => event.active)
      .sort((left, right) => createEventDateTime(left) - createEventDateTime(right));

    const now = new Date();
    const upcomingEvent = activeEvents.find((event) => createEventDateTime(event) >= now) ?? activeEvents[0] ?? null;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        source: "sample-file",
        upcomingEvent,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: "Unable to read events sample file.",
        details: error.message,
      }),
    };
  }
};
