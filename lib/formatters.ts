export function formatEventDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone:
        "Asia/Colombo",
    }
  ).format(new Date(value));
}

export function formatEventTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone:
        "Asia/Colombo",
    }
  ).format(new Date(value));
}

export function formatMoney(
  price: number,
  currency: string
) {
  return new Intl.NumberFormat(
    "en-LK",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(price);
}