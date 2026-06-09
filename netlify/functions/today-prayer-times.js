const fs = require("fs/promises");
const path = require("path");

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function pad(value) {
  return String(value).padStart(2, "0");
}

function getDateKeyFromDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getRequestedDateKey(event) {
  const requestedDate = event.queryStringParameters?.date;
  if (DATE_KEY_PATTERN.test(String(requestedDate ?? "").trim())) {
    return requestedDate;
  }

  return getDateKeyFromDate(new Date());
}

function getTomorrowDateKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return getDateKeyFromDate(new Date(year, month - 1, day + 1, 0, 0, 0, 0));
}

exports.handler = async function handler(event) {
  try {
    const filePath = path.join(__dirname, "..", "..", "data", "prayer-times.sample.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const payload = JSON.parse(fileContent);
    const requestedDateKey = getRequestedDateKey(event);
    const tomorrowDateKey = getTomorrowDateKey(requestedDateKey);

    const todayPrayerTimes = payload.find((entry) => entry.date === requestedDateKey) ?? null;
    const tomorrowPrayerTimes = payload.find((entry) => entry.date === tomorrowDateKey) ?? null;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        source: "sample-file",
        date: requestedDateKey,
        prayerTimes: todayPrayerTimes,
        tomorrowPrayerTimes,
        items: [todayPrayerTimes, tomorrowPrayerTimes].filter(Boolean),
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
