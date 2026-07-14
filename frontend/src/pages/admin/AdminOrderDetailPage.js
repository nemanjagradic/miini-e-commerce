import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { uiActions } from "../../store/ui-slice";
import Spinner from "../../UI/Spinner";
import Modal from "../../UI/Modal";

const statusStyles = {
  pending: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  processing: "bg-sky-100 text-sky-900",
  shipped: "bg-indigo-100 text-indigo-900",
  delivered: "bg-green-100 text-green-900",
  canceled: "bg-red-100 text-red-900",
  refunded: "bg-stone-200 text-stone-800",
};

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(n) || 0);

const PRESET_LABELS = {
  customer_request: "Customer request",
  payment_issue: "Payment issue",
  out_of_stock: "Out of stock",
  other: "Other",
};

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [cancelPreset, setCancelPreset] = useState("customer_request");
  const [cancelNote, setCancelNote] = useState("");
  const [restock, setRestock] = useState(true);
  const [resendTemplate, setResendTemplate] = useState("paid");
  const [confirmRefund, setConfirmRefund] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const applyOrder = (data, nextMeta) => {
    setOrder(data);
    if (nextMeta) {
      setMeta(nextMeta);
      const templates = nextMeta.emailTemplates || [];
      setResendTemplate((current) =>
        templates.includes(current) ? current : templates[0] || ""
      );
      if (nextMeta.defaultRestock !== undefined) {
        setRestock(nextMeta.defaultRestock);
      }
    }
    setTrackingNumber(data.trackingNumber || "");
    setCarrier(data.carrier || "");
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/admin/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load order");
      applyOrder(data.data, data.meta);
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, dispatch, id]);

  useEffect(() => {
    load();
  }, [load]);

  const request = async (path, options = {}) => {
    setBusy(true);
    try {
      const res = await fetch(`${API_URL}/orders/admin/${id}${path}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Request failed");
      if (data.data) applyOrder(data.data, data.meta);
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: data.message || "Saved.",
          time: 3,
        })
      );
      return data;
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
      return null;
    } finally {
      setBusy(false);
    }
  };

  const forwardStatuses = (meta?.nextStatuses || []).filter(
    (s) => s !== "canceled" && s !== "refunded"
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <p className="text-darker/70">Order not found.</p>
        <Link to="/admin/orders" className="mt-4 inline-block underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <Link
          to="/admin/orders"
          className="inline-flex items-center gap-2 text-sm text-darker/60 hover:text-lightBlack"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            Order #{String(order._id).slice(-6)}
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[order.status] || "bg-stone-100"
            }`}
          >
            {order.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-darker/60">
          {order.user?.name} · {order.user?.email} ·{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {order.shippingAddress && (
        <section className="mb-6 rounded-xl border border-black/10 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Shipping address</h3>
          <p className="mt-3 whitespace-pre-line text-sm text-darker/80">
            {[
              order.shippingAddress.fullName,
              order.shippingAddress.phone,
              order.shippingAddress.line1,
              order.shippingAddress.line2,
              [
                order.shippingAddress.city,
                order.shippingAddress.state,
                order.shippingAddress.postalCode,
              ]
                .filter(Boolean)
                .join(", "),
              order.shippingAddress.country === "CA"
                ? "Canada"
                : "United States",
            ]
              .filter(Boolean)
              .join("\n")}
          </p>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Line items</h3>
            <ul className="mt-4 divide-y divide-black/5">
              {order.products.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-darker/50">
                      {formatMoney(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatMoney(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-darker/60">Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-darker/60">Shipping</span>
                <span>{formatMoney(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatMoney(order.totalPrice)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Status timeline</h3>
            {order.statusHistory?.length ? (
              <ol className="mt-4 space-y-3">
                {[...order.statusHistory].reverse().map((entry, i) => (
                  <li
                    key={`${entry.at}-${i}`}
                    className="relative border-l-2 border-black/10 pl-4"
                  >
                    <p className="text-sm font-medium capitalize">
                      {entry.from} → {entry.to}
                    </p>
                    <p className="text-xs text-darker/50">
                      {new Date(entry.at).toLocaleString()}
                      {entry.by?.name ? ` · ${entry.by.name}` : " · System"}
                    </p>
                    {entry.comment ? (
                      <p className="mt-1 text-sm text-darker/70">
                        {entry.comment}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-darker/50">No history yet.</p>
            )}
          </section>

          <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Internal notes</h3>
            <p className="mt-1 text-xs text-darker/50">
              Append-only. Never emailed to the customer.
            </p>
            <ul className="mt-4 space-y-3">
              {(order.adminNotes || []).map((note) => (
                <li
                  key={note._id}
                  className="rounded-lg bg-[#faf9f7] px-3 py-2 text-sm"
                >
                  <p>{note.body}</p>
                  <p className="mt-1 text-xs text-darker/50">
                    {note.by?.name || "Admin"} ·{" "}
                    {new Date(note.at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!noteBody.trim()) return;
                const result = await request("/notes", {
                  method: "POST",
                  body: JSON.stringify({ body: noteBody.trim() }),
                });
                if (result) setNoteBody("");
              }}
            >
              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={2}
                placeholder="Add an internal note…"
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
              />
              <button
                type="submit"
                disabled={busy || !noteBody.trim()}
                className="self-end rounded-lg bg-lightBlack px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Add note
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Fulfillment</h3>
            {forwardStatuses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {forwardStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      request("/status", {
                        method: "PATCH",
                        body: JSON.stringify({ status }),
                      })
                    }
                    className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-medium capitalize transition hover:bg-[#faf9f7] disabled:opacity-50"
                  >
                    Mark {status}
                  </button>
                ))}
              </div>
            )}

            <form
              className="mt-5 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                await request("/tracking", {
                  method: "PATCH",
                  body: JSON.stringify({ trackingNumber, carrier }),
                });
              }}
            >
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-darker/50">
                  Carrier
                </label>
                <input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
                  placeholder="USPS, UPS…"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-darker/50">
                  Tracking number
                </label>
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium disabled:opacity-50"
              >
                Save tracking
              </button>
            </form>
          </section>

          {order.status === "pending" && (
            <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Cancel order</h3>
              <div className="mt-3 space-y-3">
                <select
                  value={cancelPreset}
                  onChange={(e) => setCancelPreset(e.target.value)}
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                >
                  {(meta?.cancelPresets || Object.keys(PRESET_LABELS)).map(
                    (p) => (
                      <option key={p} value={p}>
                        {PRESET_LABELS[p] || p}
                      </option>
                    )
                  )}
                </select>
                <textarea
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  rows={2}
                  placeholder="Optional note"
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirmCancel(true)}
                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 disabled:opacity-50"
                >
                  Cancel pending order
                </button>
              </div>
            </section>
          )}

          {meta?.refundable && (
            <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Full refund</h3>
              <p className="mt-1 text-sm text-darker/60">
                Stripe full refund of {formatMoney(order.totalPrice)}.
              </p>
              <label className="mt-4 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={restock}
                  onChange={(e) => setRestock(e.target.checked)}
                />
                Restock inventory
              </label>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmRefund(true)}
                className="mt-4 rounded-lg bg-lightBlack px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Issue refund
              </button>
            </section>
          )}

          {order.stripeRefundId && (
            <p className="text-xs text-darker/50">
              Stripe refund: {order.stripeRefundId}
            </p>
          )}

          {(meta?.emailTemplates || []).length > 0 && (
            <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Resend email</h3>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <select
                  value={resendTemplate}
                  onChange={(e) => setResendTemplate(e.target.value)}
                  className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm capitalize"
                >
                  {meta.emailTemplates.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={busy || !resendTemplate}
                  onClick={() =>
                    request("/resend-email", {
                      method: "POST",
                      body: JSON.stringify({ template: resendTemplate }),
                    })
                  }
                  className="rounded-lg border border-black/15 px-3 py-2 text-sm font-medium disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {confirmCancel && (
        <Modal
          message="Cancel this pending order?"
          description="The customer will receive a cancellation email."
          cancelMessage="Keep order"
          confirmMessage="Yes, cancel"
          handleCancel={() => setConfirmCancel(false)}
          handleConfirm={async () => {
            setConfirmCancel(false);
            await request("/cancel", {
              method: "POST",
              body: JSON.stringify({
                preset: cancelPreset,
                note: cancelNote,
              }),
            });
          }}
        />
      )}

      {confirmRefund && (
        <Modal
          message="Issue a full Stripe refund?"
          description={
            restock
              ? "Inventory will be restocked."
              : "Inventory will not be restocked."
          }
          cancelMessage="No"
          confirmMessage="Yes, refund"
          handleCancel={() => setConfirmRefund(false)}
          handleConfirm={async () => {
            setConfirmRefund(false);
            await request("/refund", {
              method: "POST",
              body: JSON.stringify({ restock }),
            });
          }}
        />
      )}
    </div>
  );
};

export default AdminOrderDetailPage;
