export const toDate = (d: any) => {
  if (!d) return new Date(0);
  if (d instanceof Date) return d;
  if (typeof d === "object" && typeof d.seconds === "number")
    return new Date(d.seconds * 1000);
  return new Date(0);
};
