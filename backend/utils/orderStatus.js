const CANCEL_PRESETS = [
  "customer_request",
  "payment_issue",
  "out_of_stock",
  "other",
];

const FORWARD_TRANSITIONS = {
  paid: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
};

const REFUNDABLE_STATUSES = ["paid", "processing", "shipped", "delivered"];

const EMAIL_ON_STATUS = {
  paid: "paid",
  shipped: "shipped",
  delivered: "delivered",
  canceled: "canceled",
  refunded: "refunded",
};

const canTransition = (from, to) => {
  if (from === to) return false;
  if (to === "canceled") return from === "pending";
  if (to === "refunded") return REFUNDABLE_STATUSES.includes(from);
  if (to === "paid") return from === "pending";
  return (FORWARD_TRANSITIONS[from] || []).includes(to);
};

const nextStatuses = (from) => {
  const next = [...(FORWARD_TRANSITIONS[from] || [])];
  if (from === "pending") next.push("canceled");
  if (REFUNDABLE_STATUSES.includes(from)) next.push("refunded");
  return next;
};

const formatCancelComment = (preset, note = "") => {
  const label = CANCEL_PRESETS.includes(preset) ? preset : "other";
  const trimmed = (note || "").trim();
  return trimmed ? `${label}: ${trimmed}` : label;
};

const appendStatusHistory = (order, { to, by = null, comment = "" }) => {
  const from = order.status;
  order.statusHistory.push({
    from,
    to,
    at: new Date(),
    by,
    comment: comment || "",
  });
  order.status = to;
  return order;
};

/** Templates an admin may resend for the current order status. */
const allowedEmailTemplates = (status) => {
  switch (status) {
    case "paid":
    case "processing":
      return ["paid"];
    case "shipped":
      return ["paid", "shipped"];
    case "delivered":
      return ["paid", "shipped", "delivered"];
    case "canceled":
      return ["canceled"];
    case "refunded":
      return ["refunded"];
    default:
      return [];
  }
};

module.exports = {
  CANCEL_PRESETS,
  FORWARD_TRANSITIONS,
  REFUNDABLE_STATUSES,
  EMAIL_ON_STATUS,
  canTransition,
  nextStatuses,
  formatCancelComment,
  appendStatusHistory,
  allowedEmailTemplates,
};
