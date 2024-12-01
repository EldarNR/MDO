export function formatDate(dateString, showTime = false) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (showTime) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  return `${day}.${month}.${year}`;
}

export function formatDueDate(dateString) {
  const date = new Date(dateString);
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const hours = String(Math.abs(offset / 60)).padStart(2, "0");
  const minutes = String(Math.abs(offset % 60)).padStart(2, "0");
  const timezone = `${sign}${hours}:${minutes}`;

  return date.toISOString().replace("Z", timezone);
}
