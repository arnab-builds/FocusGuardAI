const formatNumber = (value, locale) =>
  new Intl.NumberFormat(locale || undefined).format(value);

export const formatDuration = (time, t, locale) => {
  const translate = t || ((_, fallback) => fallback);

  if (!time) {
    return `${formatNumber(0, locale)} ${translate(
      "seconds_short",
      "sec"
    )}`;
  }

  // Remove microseconds
  const cleanTime = time.split(".")[0];

  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  if (hours > 0) {
    if (minutes > 0) {
      return `${formatNumber(hours, locale)} ${translate(
        "hours_short",
        "hr"
      )} ${formatNumber(minutes, locale)} ${translate(
        "minutes_short",
        "min"
      )}`;
    }

    return `${formatNumber(hours, locale)} ${translate(
      "hours_short",
      "hr"
    )}`;
  }

  if (minutes > 0) {
    if (seconds > 0) {
      return `${formatNumber(minutes, locale)} ${translate(
        "minutes_short",
        "min"
      )} ${formatNumber(seconds, locale)} ${translate(
        "seconds_short",
        "sec"
      )}`;
    }

    return `${formatNumber(minutes, locale)} ${translate(
      "minutes_short",
      "min"
    )}`;
  }

  return `${formatNumber(seconds, locale)} ${translate(
    "seconds_short",
    "sec"
  )}`;
};
