export function formatDate(dateValue: Date | number): string {
  const date = new Date(dateValue);
  return date.toLocaleString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export function isOverDueDate(dateValue: Date | number): boolean {
  const date = new Date(dateValue);
  const todayDate = new Date();
  return (
    todayDate.getFullYear() > date.getFullYear() ||
    todayDate.getMonth() > date.getMonth() ||
    todayDate.getDay() > date.getDay()
  );
}
