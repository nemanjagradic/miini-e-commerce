import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { uiActions } from "../../store/ui-slice";
import Spinner from "../../UI/Spinner";
import {
  getPrimaryImageUrl,
  resolveMediaUrl,
} from "../../utils/productImages";

const statusStyles = {
  pending: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  processing: "bg-sky-100 text-sky-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivered: "bg-green-100 text-green-900",
  canceled: "bg-red-100 text-red-900",
  refunded: "bg-stone-200 text-stone-800",
};

const PERIOD_PRESETS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "all", label: "All time" },
  { value: "custom", label: "Custom" },
];

const emptyStats = {
  money: {
    revenue: 0,
    orders: 0,
    aov: 0,
    refunds: 0,
    refundCount: 0,
    net: 0,
  },
  queue: { paid: 0, processing: 0, shipped: 0 },
  charts: {
    truncated: false,
    ordersByDay: [],
    revenueByDay: [],
  },
  topSellers: { period: "30d", items: [] },
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n) || 0);

const formatShortDate = (dateStr) => {
  if (!dateStr) return "";
  const [, m, d] = dateStr.split("-");
  return `${m}/${d}`;
};

const StatTile = ({ label, value, to, sub }) => {
  const className =
    "rounded-xl border border-black/10 bg-white p-4 shadow-sm transition hover:border-black/20 hover:bg-[#faf9f7]/80";
  const body = (
    <>
      <p className="text-[11px] font-medium uppercase leading-snug tracking-wide text-darker/50 sm:text-xs">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {sub ? <p className="mt-1 text-xs text-darker/50">{sub}</p> : null}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={`block ${className}`}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
};

const ChartCard = ({
  title,
  data,
  dataKey,
  empty,
  formatY,
  allowDecimals = true,
}) => {
  const hasData = data.some((row) => Number(row[dataKey]) > 0);

  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="relative mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 11, fill: "#78716c" }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              allowDecimals={allowDecimals}
              domain={[0, "auto"]}
              tick={{ fontSize: 11, fill: "#78716c" }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={formatY}
            />
            <Tooltip
              labelFormatter={(label) => label}
              formatter={(value) => [
                formatY ? formatY(value) : value,
                title,
              ]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: 12,
              }}
            />
            <Bar dataKey={dataKey} fill="#1f1e1c" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {!hasData && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70">
            <p className="text-sm text-darker/50">{empty}</p>
          </div>
        )}
      </div>
    </section>
  );
};

const AdminHomePage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [topSellersPeriod, setTopSellersPeriod] = useState("30d");
  const [stats, setStats] = useState(emptyStats);
  const [recent, setRecent] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStatic = useCallback(async () => {
    const [ordersRes, stockRes] = await Promise.all([
      fetch(`${API_URL}/orders/admin/recent?limit=5`, {
        credentials: "include",
      }),
      fetch(`${API_URL}/products/admin/low-stock?limit=8`, {
        credentials: "include",
      }),
    ]);

    const ordersData = await ordersRes.json();
    const stockData = await stockRes.json();

    if (!ordersRes.ok) {
      throw new Error(ordersData.message || "Failed to load recent orders");
    }
    if (!stockRes.ok) {
      throw new Error(stockData.message || "Failed to load low stock");
    }

    setRecent(ordersData.data || []);
    setLowStock(stockData.data || []);
    setThreshold(stockData.threshold || 5);
  }, [API_URL]);

  const loadStats = useCallback(async () => {
    if (period === "custom" && (!customFrom || !customTo)) {
      return;
    }

    const params = new URLSearchParams({
      period,
      topSellersPeriod,
    });
    if (period === "custom") {
      params.set("from", customFrom);
      params.set("to", customTo);
    }

    const res = await fetch(`${API_URL}/orders/admin/stats?${params}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load stats");
    setStats(data.data || emptyStats);
  }, [API_URL, period, customFrom, customTo, topSellersPeriod]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setInitialLoading(true);
      try {
        await loadStatic();
      } catch (err) {
        if (!cancelled) {
          dispatch(
            uiActions.setAlert({
              status: "error",
              message: err.message,
              time: 4,
            })
          );
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch, loadStatic]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (period === "custom" && (!customFrom || !customTo)) return;
      setStatsLoading(true);
      try {
        await loadStats();
      } catch (err) {
        if (!cancelled) {
          dispatch(
            uiActions.setAlert({
              status: "error",
              message: err.message,
              time: 4,
            })
          );
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch, loadStats, period, customFrom, customTo]);

  const money = stats.money || emptyStats.money;
  const queue = stats.queue || emptyStats.queue;
  const charts = stats.charts || emptyStats.charts;
  const topSellers = stats.topSellers || emptyStats.topSellers;

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>

      {initialLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Sales overview</h3>
              <p className="mt-0.5 text-sm text-darker/50">
                Filtered by the selected date range (UTC).
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {PERIOD_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPeriod(p.value)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      period === p.value
                        ? "bg-[#1f1e1c] text-white"
                        : "border border-black/10 bg-white text-darker/70 hover:bg-[#faf9f7]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              {period === "custom" && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <label className="flex items-center gap-2">
                    <span className="text-darker/50">From</span>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-2 py-1.5 outline-none focus:border-black/30"
                    />
                  </label>
                  <label className="flex items-center gap-2">
                    <span className="text-darker/50">To</span>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      className="rounded-lg border border-black/10 bg-white px-2 py-1.5 outline-none focus:border-black/30"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="relative">
              {statsLoading && (
                <div className="absolute right-0 top-0 z-10">
                  <Spinner className="h-5 w-5" />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <StatTile
                  label="Revenue"
                  value={formatMoney(money.revenue)}
                  to="/admin/orders"
                />
                <StatTile
                  label="Orders"
                  value={money.orders}
                  to="/admin/orders"
                />
                <StatTile
                  label="Average order value"
                  value={formatMoney(money.aov)}
                  to="/admin/orders"
                />
                <StatTile
                  label="Refunds"
                  value={formatMoney(money.refunds)}
                  sub={
                    money.refundCount
                      ? `${money.refundCount} order${
                          money.refundCount === 1 ? "" : "s"
                        }`
                      : undefined
                  }
                  to="/admin/orders?status=refunded"
                />
                <StatTile
                  label="Net"
                  value={formatMoney(money.net)}
                  to="/admin/orders"
                />
              </div>

              {charts.truncated && (
                <p className="mt-3 text-xs text-darker/50">
                  Charts show the last 90 days of this range.
                </p>
              )}

              <div className="mt-3 grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Orders"
                  data={charts.ordersByDay || []}
                  dataKey="count"
                  empty="No data for this period"
                  allowDecimals={false}
                  formatY={(v) => String(Math.round(Number(v) || 0))}
                />
                <ChartCard
                  title="Revenue"
                  data={charts.revenueByDay || []}
                  dataKey="amount"
                  empty="No data for this period"
                  formatY={(v) => formatMoney(v)}
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Needs attention</h3>
              <p className="mt-0.5 text-sm text-darker/50">
                Current open orders — not filtered by date.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <StatTile
                label="Paid"
                value={queue.paid}
                to="/admin/orders?status=paid"
              />
              <StatTile
                label="Processing"
                value={queue.processing}
                to="/admin/orders?status=processing"
              />
              <StatTile
                label="Shipped"
                value={queue.shipped}
                to="/admin/orders?status=shipped"
              />
            </div>
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Top sellers</h3>
              <div className="flex gap-2">
                {["7d", "30d"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTopSellersPeriod(p)}
                    className={`rounded-lg px-3 py-1 text-sm font-medium ${
                      topSellersPeriod === p
                        ? "bg-[#1f1e1c] text-white"
                        : "border border-black/10 bg-white text-darker/70"
                    }`}
                  >
                    {p === "7d" ? "7 days" : "30 days"}
                  </button>
                ))}
              </div>
            </div>
            {!topSellers.items?.length ? (
              <p className="mt-6 text-sm text-darker/50">
                No sales data available
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-black/5">
                {topSellers.items.map((item) => {
                  const img = resolveMediaUrl(item.img);
                  return (
                    <li key={item.productId || item.title}>
                      <Link
                        to={
                          item.productId
                            ? `/admin/products/${item.productId}`
                            : "/admin/products"
                        }
                        className="flex items-center gap-3 py-3 transition hover:bg-[#faf9f7]/80"
                      >
                        {img ? (
                          <img
                            src={img}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-stone-200" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.title}
                          </p>
                          <p className="text-xs text-darker/50">
                            {item.units} sold · {formatMoney(item.revenue)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Recent orders</h3>
                <Link
                  to="/admin/orders"
                  className="text-sm text-darker/60 underline-offset-2 hover:underline"
                >
                  View all
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="mt-6 text-sm text-darker/50">No orders found</p>
              ) : (
                <ul className="mt-4 divide-y divide-black/5">
                  {recent.map((order) => (
                    <li key={order._id}>
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="flex items-center justify-between gap-3 py-3 transition hover:bg-[#faf9f7]/80"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            #{String(order._id).slice(-6)} ·{" "}
                            {order.user?.name || "Customer"}
                          </p>
                          <p className="text-xs text-darker/50">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                              statusStyles[order.status] || "bg-stone-100"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-sm font-medium">
                            {formatMoney(order.totalPrice)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">Low stock</h3>
                <span className="text-xs text-darker/50">
                  Below {threshold}
                </span>
              </div>
              {lowStock.length === 0 ? (
                <p className="mt-6 text-sm text-darker/50">
                  All products are above the threshold.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-black/5">
                  {lowStock.map((product) => {
                    const img = resolveMediaUrl(
                      getPrimaryImageUrl(product.imgs)
                    );
                    return (
                      <li key={product._id}>
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="flex items-center gap-3 py-3 transition hover:bg-[#faf9f7]/80"
                        >
                          {img ? (
                            <img
                              src={img}
                              alt=""
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-stone-200" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {product.title}
                            </p>
                            <p className="text-xs text-darker/50">
                              {product.category?.name || "—"}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-amber-800">
                            {product.stockQuantity}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <Link
                  to="/admin/products"
                  className="text-darker/60 underline-offset-2 hover:underline"
                >
                  Products
                </Link>
                <Link
                  to="/admin/settings"
                  className="text-darker/60 underline-offset-2 hover:underline"
                >
                  Settings
                </Link>
                <Link
                  to="/admin/categories"
                  className="text-darker/60 underline-offset-2 hover:underline"
                >
                  Categories
                </Link>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage;
