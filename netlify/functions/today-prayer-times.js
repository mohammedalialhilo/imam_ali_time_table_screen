const fs = require("fs/promises");
const path = require("path");

function getTodayDateKey() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Copenhagen",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

exports.handler = async function handler() {
  try {
    const filePath = path.join(__dirname, "..", "..", "data", "prayer-times.sample.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const payload = JSON.parse(fileContent);
    const todayDateKey = getTodayDateKey();
    const todayPrayerTimes = payload.find((entry) => entry.date === todayDateKey) ?? payload[0] ?? null;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        source: "sample-file",
        date: todayDateKey,
        prayerTimes: todayPrayerTimes,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: "Unable to read prayer times sample file.",
        details: error.message,
      }),
    };
  }
};
