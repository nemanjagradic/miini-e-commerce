import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { invalidateShippingSettingsCache } from "../../hooks/useShippingSettings";
import Spinner from "../../UI/Spinner";

const AdminSettingsPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);
  const [standardShipping, setStandardShipping] = useState(15);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/settings`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load settings");
        if (!cancelled) {
          setLowStockThreshold(data.data.lowStockThreshold);
          setFreeShippingThreshold(data.data.freeShippingThreshold);
          setStandardShipping(data.data.standardShipping ?? 15);
        }
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
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [API_URL, dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/settings`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lowStockThreshold: Number(lowStockThreshold),
          freeShippingThreshold: Number(freeShippingThreshold),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save settings");

      setLowStockThreshold(data.data.lowStockThreshold);
      setFreeShippingThreshold(data.data.freeShippingThreshold);
      invalidateShippingSettingsCache();
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Settings saved.",
          time: 3,
        })
      );
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight">Settings</h2>
      <p className="mt-2 max-w-xl text-sm text-darker/70">
        Store-wide thresholds for low-stock alerts and free shipping. The
        standard delivery fee stays fixed at ${standardShipping}.
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-8 max-w-md space-y-5 rounded-xl border border-black/10 bg-white p-6 shadow-sm"
        >
          <label className="block">
            <span className="text-sm font-medium">Low stock threshold</span>
            <p className="mt-0.5 text-xs text-darker/50">
              Alert when stock is below this number.
            </p>
            <input
              type="number"
              min={0}
              step={1}
              required
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">
              Free shipping threshold ($)
            </span>
            <p className="mt-0.5 text-xs text-darker/50">
              Orders at or above this subtotal get free delivery.
            </p>
            <input
              type="number"
              min={0}
              step={1}
              required
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
            />
          </label>

          <div className="rounded-lg bg-[#faf9f7] px-3 py-2 text-xs text-darker/60">
            Standard shipping fee: ${standardShipping} (not editable)
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-lightBlack px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-black disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminSettingsPage;
