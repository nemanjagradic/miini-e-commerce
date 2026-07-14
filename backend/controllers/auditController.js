const AuditLog = require("../models/auditLogModel");
const catchAsync = require("../utils/catchAsync");

exports.getAuditLogs = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.q?.trim()) {
    const q = req.query.q.trim();
    const idQuery = q.replace(/^#/, "").trim();
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    filter.$or = [
      { action: { $regex: escapeRegex(q), $options: "i" } },
      { resourceType: { $regex: escapeRegex(q), $options: "i" } },
      { resourceId: { $regex: escapeRegex(idQuery), $options: "i" } },
    ];
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: logs.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: logs,
  });
});
