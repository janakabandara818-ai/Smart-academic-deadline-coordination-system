const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeDeadline(item) {
  if (!item?.moduleId || !DATE_PATTERN.test(item.date)) {
    throw new Error(`Invalid deadline: ${item?.id ?? 'unknown'}`);
  }
  return {
    ...item,
    moduleId: item.moduleId.trim().toUpperCase(),
    time: item.time ?? '23:59'
  };
}

// 'all' / 'All' → every deadline; module ID → that module only.
// Always sorted by date + time. Empty array = UI empty state.
export function filterDeadlines(deadlines, moduleId = 'all') {
  if (!Array.isArray(deadlines)) {
    throw new TypeError('deadlines must be an array');
  }
  const wanted =
    !moduleId || moduleId.toLowerCase() === 'all'
      ? null
      : moduleId.trim().toUpperCase();

  return deadlines
    .map(normalizeDeadline)
    .filter((d) => wanted === null || d.moduleId === wanted)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}
