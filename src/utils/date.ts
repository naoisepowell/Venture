function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/** "Today", "Yesterday", "3 days ago", "Jan 5", "Mar 2025" */
export function formatRelativeDate(value: Date | string): string {
  const date = toDate(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'Last week' : `${weeks} weeks ago`;
  }

  const sameYear = date.getFullYear() === now.getFullYear();
  return sameYear
    ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

/** "Jan 5" or "Jan 5, 2024" when year differs */
export function formatShortDate(value: Date | string): string {
  const date = toDate(value);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** "January 5, 2024" */
export function formatLongDate(value: Date | string): string {
  return toDate(value).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** "Jan 5 – Jan 12" or "Jan 5 – Feb 2" */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = toDate(start);
  const e = toDate(end);
  const startStr = s.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const endStr = sameMonth
    ? e.getDate().toString()
    : e.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${startStr} – ${endStr}`;
}

/** "3 nights", "1 day", "2 weeks" */
export function formatDuration(start: Date | string, end: Date | string): string {
  const diffDays = Math.round(
    (toDate(end).getTime() - toDate(start).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return '1 day';
  if (diffDays < 14) return `${diffDays} night${diffDays === 1 ? '' : 's'}`;
  const weeks = Math.round(diffDays / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'}`;
}

export function isToday(value: Date | string): boolean {
  const d = toDate(value);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function isFuture(value: Date | string): boolean {
  return toDate(value).getTime() > Date.now();
}

export function isPast(value: Date | string): boolean {
  return toDate(value).getTime() < Date.now();
}
