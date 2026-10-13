const escape = (value) =>
  String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r/g, "");
const stamp = (value) =>
  value.replace(/[-:]/g, "").slice(0, 15).padEnd(15, "0");
function fold(line) {
  let result = "",
    length = 0;
  for (const ch of line) {
    const bytes = new TextEncoder().encode(ch).length;
    if (length + bytes > 74) {
      result += "\r\n ";
      length = 1;
    }
    result += ch;
    length += bytes;
  }
  return result;
}
export function eventCalendar(event) {
  const dt = event.Date.slice(0, 19);
  const end =
    event.endTime ||
    new Date(new Date(dt + "Z").getTime() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Haven Heights//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE",
    "TZID:America/Chicago",
    "BEGIN:DAYLIGHT",
    "DTSTART:20070311T020000",
    "TZOFFSETFROM:-0600",
    "TZOFFSETTO:-0500",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "DTSTART:20071104T020000",
    "TZOFFSETFROM:-0500",
    "TZOFFSETTO:-0600",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:event-${event.id}@havenheights.com`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=America/Chicago:${stamp(dt)}`,
    `DTEND;TZID=America/Chicago:${stamp(end)}`,
    `SUMMARY:${escape(event.Title)}`,
    `LOCATION:${escape(event.Location)}`,
    `DESCRIPTION:${escape(event.Details)}`,
    event.status === "cancelled" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ]
    .map(fold)
    .join("\r\n");
}
export function downloadCalendar(event) {
  const url = URL.createObjectURL(
    new Blob([eventCalendar(event)], { type: "text/calendar;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `church-event-${event.id}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
