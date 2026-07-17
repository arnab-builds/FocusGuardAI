export const formatDuration = (time) => {
  if (!time) return "0 sec";

  // Remove microseconds
  const cleanTime = time.split(".")[0];

  const [hours, minutes, seconds] = cleanTime.split(":").map(Number);

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${hours} hr`;
  }

  if (minutes > 0) {
    if (seconds > 0) {
      return `${minutes} min ${seconds} sec`;
    }
    return `${minutes} min`;
  }

  return `${seconds} sec`;
};