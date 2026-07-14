const AUDIT_ACTION_LABELS = {
  "category.create": "Created category",
  "category.update": "Updated category",
  "category.delete": "Deleted category",
  "product.create": "Created product",
  "product.update": "Updated product",
  "product.softDelete": "Archived product",
  "product.restore": "Restored product",
  "product.hardDelete": "Permanently deleted product",
  "order.status": "Updated order status",
  "order.tracking": "Updated order tracking",
  "order.note": "Added order note",
  "order.cancel": "Canceled order",
  "order.refund": "Refunded order",
  "order.resendEmail": "Resent order email",
  "user.activate": "Activated user",
  "user.deactivate": "Deactivated user",
  "settings.update": "Updated settings",
};

export const getAuditActionLabel = (action) =>
  AUDIT_ACTION_LABELS[action] || action || "—";
