export function formatDateTimeLocal(
  date: Date | null | undefined | { seconds: number; nanoseconds?: number }
): string {
  if (!date) return "";
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "object" && typeof date.seconds === "number") {
    d = new Date(date.seconds * 1000);
  } else {
    return "";
  }
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export const toDate = (d: any) => {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof d === "object" && typeof d.seconds === "number")
    return new Date(d.seconds * 1000);
  return new Date(0);
};
