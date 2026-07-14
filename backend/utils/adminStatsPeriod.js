/**
 * Admin dashboard period helpers.
 * All calendar boundaries use UTC for v1 (no shop timezone setting).
 */

const MS_DAY = 24 * 60 * 60 * 1000;
const CHART_MAX_DAYS = 90;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PAID_LIKE = ["paid", "processing", "shipped", "delivered", "refunded"];

const PRESETS = new Set(["today", "yesterday", "7d", "30d", "all", "custom"]);

const startOfUtcDay = (d) => {
  const x = new Date(d);
  return new Date(
    Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate())
  );
};

const addUtcDays = (d, days) => new Date(d.getTime() + days * MS_DAY);

/** Parse YYYY-MM-DD as UTC midnight. */
const parseUtcDate = (str) => {
  if (!DATE_RE.test(str || "")) return null;
  const [y, m, day] = str.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1, day));
  if (
    d.getUTCFullYear() !== y ||
    d.getUTCMonth() !== m - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return d;
};

const formatUtcDate = (d) => d.toISOString().slice(0, 10);

/**
 * @returns {{
 *   preset: string,
 *   rangeStart: Date|null,
 *   rangeEnd: Date,
 *   chartStart: Date,
 *   chartEnd: Date,
 *   chartsTruncated: boolean,
 *   from: string|null,
 *   to: string
 * }}
 */
const resolvePeriod = ({ period = "30d", from, to } = {}) => {
  const preset = PRESETS.has(period) ? period : "30d";
  const now = new Date();
  const todayStart = startOfUtcDay(now);
  const tomorrowStart = addUtcDays(todayStart, 1);

  let rangeStart;
  let rangeEnd = tomorrowStart;

  switch (preset) {
    case "today":
      rangeStart = todayStart;
      break;
    case "yesterday":
      rangeStart = addUtcDays(todayStart, -1);
      rangeEnd = todayStart;
      break;
    case "7d":
      rangeStart = addUtcDays(todayStart, -6);
      break;
    case "30d":
      rangeStart = addUtcDays(todayStart, -29);
      break;
    case "all":
      rangeStart = null;
      break;
    case "custom": {
      const start = parseUtcDate(from);
      const endDay = parseUtcDate(to);
      if (!start || !endDay) {
        const err = new Error(
          "Custom period requires valid from and to dates (YYYY-MM-DD)."
        );
        err.statusCode = 400;
        throw err;
      }
      if (start.getTime() > endDay.getTime()) {
        const err = new Error("`from` must be on or before `to`.");
        err.statusCode = 400;
        throw err;
      }
      rangeStart = start;
      rangeEnd = addUtcDays(endDay, 1);
      break;
    }
    default:
      rangeStart = addUtcDays(todayStart, -29);
  }

  const effectiveStartForChart =
    rangeStart || addUtcDays(rangeEnd, -CHART_MAX_DAYS * 10);
  const fullSpanMs =
    rangeEnd.getTime() -
    (rangeStart ? rangeStart.getTime() : effectiveStartForChart.getTime());
  const fullSpanDays = Math.ceil(fullSpanMs / MS_DAY);

  let chartStart;
  let chartsTruncated = false;

  if (preset === "all" || fullSpanDays > CHART_MAX_DAYS) {
    chartStart = addUtcDays(rangeEnd, -CHART_MAX_DAYS);
    if (rangeStart && chartStart.getTime() < rangeStart.getTime()) {
      chartStart = rangeStart;
      chartsTruncated = false;
    } else {
      chartsTruncated = !rangeStart || chartStart.getTime() > rangeStart.getTime();
    }
  } else {
    chartStart = rangeStart;
  }

  const chartEnd = rangeEnd;

  return {
    preset,
    rangeStart,
    rangeEnd,
    chartStart,
    chartEnd,
    chartsTruncated,
    from: rangeStart ? formatUtcDate(rangeStart) : null,
    to: formatUtcDate(addUtcDays(rangeEnd, -1)),
  };
};

const resolveTopSellersPeriod = (raw) => {
  const period = raw === "7d" ? "7d" : "30d";
  const todayStart = startOfUtcDay(new Date());
  const rangeEnd = addUtcDays(todayStart, 1);
  const rangeStart =
    period === "7d"
      ? addUtcDays(todayStart, -6)
      : addUtcDays(todayStart, -29);
  return { period, rangeStart, rangeEnd };
};

/** Inclusive list of YYYY-MM-DD from chartStart (inclusive) to day before chartEnd. */
const eachUtcDay = (chartStart, chartEnd) => {
  const days = [];
  let cur = startOfUtcDay(chartStart);
  const end = startOfUtcDay(chartEnd);
  while (cur.getTime() < end.getTime()) {
    days.push(formatUtcDate(cur));
    cur = addUtcDays(cur, 1);
  }
  return days;
};

const fillDailySeries = (days, byDateMap, valueKey) =>
  days.map((date) => ({
    date,
    [valueKey]: byDateMap.get(date) || 0,
  }));

module.exports = {
  CHART_MAX_DAYS,
  PAID_LIKE,
  resolvePeriod,
  resolveTopSellersPeriod,
  eachUtcDay,
  fillDailySeries,
  formatUtcDate,
  startOfUtcDay,
  addUtcDays,
};
