export function formatDate(num) {
  return num.toString().padStart(2, "0");
}

export function YYYYMMDDDate(date) {
  if (typeof date == "object") {
    return (
      new Date(date).getFullYear() +
      "-" +
      formatDate(new Date(date).getMonth()) +
      "-" +
      formatDate(new Date(date).getDate())
    );
  }
  return date;
}
