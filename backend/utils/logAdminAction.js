const AuditLog = require("../models/auditLogModel");

const logAdminAction = async (
  req,
  { action, resourceType, resourceId = null, meta = {} }
) => {
  try {
    await AuditLog.create({
      actor: req.user.id,
      action,
      resourceType,
      resourceId: resourceId != null ? String(resourceId) : null,
      meta,
    });
  } catch (err) {
    console.error("Failed to write audit log:", err.message);
  }
};

module.exports = logAdminAction;
